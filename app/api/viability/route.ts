import { NextResponse } from 'next/server';
import axios from 'axios';

// --- Types ---
type EmploymentStatus = 'autonomo' | 'cuenta_ajena' | 'otro';

interface ClickUpTask {
    id: string;
    name: string;
    custom_fields?: {
        id: string;
        name: string;
        value?: any;
    }[];
}

// --- Constants ---
const CLICKUP_API_BASE = 'https://api.clickup.com/api/v2';
const N8N_WEBHOOK_URL = 'https://n8n.srv954356.hstgr.cloud/webhook/form2supabase';

// --- Webhook helper ---
async function sendWebhook(phone: string, status: 'success' | 'error', detail?: string) {
    try {
        await fetch(N8N_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                phone,
                clickup_status: status,
                detail: detail ?? null,
                timestamp: new Date().toISOString(),
            }),
        });
        console.log(`[Viability] ✓ Webhook sent: ${status}`);
    } catch (err: any) {
        console.warn('[Viability] ⚠ Could not send webhook:', err.message);
    }
}

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const phone = formData.get('phone') as string;
        const employmentStatus = formData.get('employmentStatus') as EmploymentStatus;
        const purchaseType = formData.get('purchaseType') as string;

        // --- 1. Validation ---
        if (!phone) {
            return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });
        }

        const files = Array.from(formData.entries())
            .filter(([key]) => key.startsWith('file_'))
            .map(([, file]) => file as File);

        if (files.length === 0) {
            return NextResponse.json({ error: 'No files uploaded' }, { status: 400 });
        }

        // --- 1b. File Size Validation ---
        const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

        for (const file of files) {
            if (file.size > MAX_FILE_SIZE) {
                console.warn(`[Viability] ✗ Rejected oversized file: ${file.name} (${(file.size / 1024 / 1024).toFixed(1)} MB)`);
                return NextResponse.json(
                    { error: `El archivo "${file.name}" supera el límite de 10 MB. Por favor, comprime o reduce el archivo.` },
                    { status: 400 }
                );
            }
        }

        // --- 1c. Magic Number (MIME) Validation ---
        // Allowed signatures: PDF, JPEG, PNG
        const ALLOWED_SIGNATURES: { mime: string; bytes: number[]; offset?: number }[] = [
            { mime: 'application/pdf', bytes: [0x25, 0x50, 0x44, 0x46] },           // %PDF
            { mime: 'image/jpeg', bytes: [0xFF, 0xD8, 0xFF] },                  // JFIF/EXIF
            { mime: 'image/png', bytes: [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A] }, // PNG
        ];

        const matchesMagic = (buffer: Uint8Array, sig: number[], offset = 0) =>
            sig.every((byte, i) => buffer[offset + i] === byte);

        for (const file of files) {
            const HEADER_BYTES = 8;
            const arrayBuffer = await file.slice(0, HEADER_BYTES).arrayBuffer();
            const header = new Uint8Array(arrayBuffer);

            const isValid = ALLOWED_SIGNATURES.some(sig =>
                matchesMagic(header, sig.bytes, sig.offset ?? 0)
            );

            if (!isValid) {
                console.warn(`[Viability] ✗ Rejected file with invalid magic bytes: ${file.name}`);
                return NextResponse.json(
                    { error: `El archivo "${file.name}" no es un PDF, JPEG ni PNG válido.` },
                    { status: 400 }
                );
            }
        }

        // --- 2. Normalize Phone ---
        let normalizedPhone = phone.replace(/[\s-]/g, '');
        if (!normalizedPhone.startsWith('+') && (normalizedPhone.startsWith('6') || normalizedPhone.startsWith('7') || normalizedPhone.startsWith('9')) && normalizedPhone.length === 9) {
            normalizedPhone = '+34' + normalizedPhone;
        }
        const localPhone = normalizedPhone.replace(/^\+34/, '');

        // --- 3. Search task in ClickUp ---
        const listId = process.env.CLICKUP_LIST_ID;
        const apiKey = process.env.CLICKUP_API_KEY;
        const phoneFieldId = process.env.CLICKUP_PHONE_FIELD_ID;

        if (!listId || !apiKey) {
            console.error('[Viability] Missing ClickUp credentials');
            return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
        }

        console.log(`[Viability] Searching for: ${normalizedPhone} | Local: ${localPhone} | Field ID: ${phoneFieldId}`);

        let targetTaskId: string | null = null;
        let targetTaskName: string | null = null;

        // Strategy 1: Use custom_fields filter if field ID is available
        if (phoneFieldId) {
            const phoneVariations = [
                normalizedPhone,     // +34676924957
                localPhone,          // 676924957
                `+34 ${localPhone}`, // +34 676924957
                localPhone.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3'), // 676 924 957
                normalizedPhone.replace(/(\+34)(\d{3})(\d{3})(\d{3})/, '$1 $2 $3 $4') // +34 676 924 957
            ];

            console.log(`[Viability] Trying custom field filter with variations:`, phoneVariations);

            for (const phoneValue of phoneVariations) {
                if (targetTaskId) break;

                try {
                    const customFieldsParam = JSON.stringify([{
                        field_id: phoneFieldId,
                        operator: "=",
                        value: phoneValue
                    }]);

                    console.log(`[Viability] Filtering with custom_fields: ${customFieldsParam}`);

                    const response = await axios.get(`${CLICKUP_API_BASE}/list/${listId}/task`, {
                        headers: { Authorization: apiKey },
                        params: {
                            custom_fields: customFieldsParam,
                            subtasks: true,
                            include_closed: false,
                            archived: false
                        }
                    });

                    if (response.data.tasks && response.data.tasks.length > 0) {
                        targetTaskId = response.data.tasks[0].id;
                        targetTaskName = response.data.tasks[0].name;
                        console.log(`[Viability] ✓ Found via custom field (${phoneValue}): ${targetTaskName} (${targetTaskId})`);
                        break;
                    }
                } catch (error: any) {
                    console.error(`[Viability] Error filtering with ${phoneValue}:`, error.message);
                }
            }
        }

        // Strategy 2: Fallback - fetch and scan tasks (paginated)
        // ⚠ Only runs when phoneFieldId is NOT set.
        // If phoneFieldId IS configured, Strategy 1 already tried all phone variations → trust that result.
        if (!targetTaskId && !phoneFieldId) {
            console.log('[Viability] No phoneFieldId configured, scanning tasks as fallback...');

            let page = 0;
            const maxPages = 20; // Limit to 2000 tasks max to avoid infinite loops

            while (!targetTaskId && page < maxPages) {
                try {
                    const response = await axios.get(`${CLICKUP_API_BASE}/list/${listId}/task`, {
                        headers: { Authorization: apiKey },
                        params: {
                            page,
                            subtasks: true,
                            include_closed: false,
                            archived: false
                        }
                    });

                    const tasks: ClickUpTask[] = response.data.tasks || [];
                    console.log(`[Viability] Page ${page}: ${tasks.length} tasks`);

                    if (tasks.length === 0) break;

                    // Search in task names and custom fields
                    const found = tasks.find(task => {
                        const nameDigits = task.name.replace(/\D/g, '');
                        if (nameDigits.includes(localPhone)) return true;

                        if (task.custom_fields) {
                            return task.custom_fields.some(field => {
                                if (!field.value) return false;
                                const fieldStr = typeof field.value === 'string' ? field.value : JSON.stringify(field.value);
                                const fieldDigits = fieldStr.replace(/\D/g, '');
                                return fieldDigits.includes(localPhone);
                            });
                        }
                        return false;
                    });

                    if (found) {
                        targetTaskId = found.id;
                        targetTaskName = found.name;
                        console.log(`[Viability] ✓ Found via scan on page ${page}: ${targetTaskName} (${targetTaskId})`);
                        break;
                    }

                    page++;
                } catch (error: any) {
                    console.error(`[Viability] Error fetching page ${page}:`, error.message);
                    break;
                }
            }
        }

        if (!targetTaskId) {
            console.log('[Viability] ✗ No task found');
            await sendWebhook(phone, 'error', 'Usuario no encontrado en ClickUp');
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // --- 4. Check for existing attachments (prevent duplicates) ---
        try {
            const taskDetails = await axios.get(`${CLICKUP_API_BASE}/task/${targetTaskId}`, {
                headers: { Authorization: apiKey },
            });
            const attachments: any[] = taskDetails.data?.attachments ?? [];
            if (attachments.length > 0) {
                console.warn(`[Viability] ✗ Task ${targetTaskId} already has ${attachments.length} attachment(s). Blocking.`);
                await sendWebhook(phone, 'error', 'Documentación ya enviada previamente (tarea con adjuntos existentes)');
                return NextResponse.json(
                    { error: 'already_submitted' },
                    { status: 409 }
                );
            }
        } catch (error: any) {
            // If we can't read attachments, proceed anyway (fail-open)
            console.warn('[Viability] ⚠ Could not fetch task details to check attachments:', error.message);
        }

        // --- 5. Upload Files (without renaming) ---

        console.log(`[Viability] Uploading ${files.length} files to task ${targetTaskId}...`);

        // Build a map of key → file for entries that start with 'file_'
        const fileEntries = Array.from(formData.entries()).filter(([key]) => key.startsWith('file_'));

        const uploadPromises = fileEntries.map(async ([key, rawFile]) => {
            const file = rawFile as File;

            console.log(`[Viability] Uploading "${file.name}"`);

            const body = new FormData();
            // Upload with original filename
            body.append('attachment', file as unknown as Blob, file.name);

            try {
                const response = await fetch(`${CLICKUP_API_BASE}/task/${targetTaskId}/attachment`, {
                    method: 'POST',
                    headers: { Authorization: apiKey },
                    body: body
                });

                if (response.ok) {
                    console.log(`[Viability] ✓ Uploaded: ${file.name}`);
                } else {
                    const error = await response.text();
                    console.warn(`[Viability] ✗ Failed to upload ${file.name}: ${response.status}`, error);
                }
            } catch (error: any) {
                console.error(`[Viability] ✗ Network error uploading ${file.name}:`, error.message);
            }
        });

        await Promise.all(uploadPromises);

        // --- 5. Update Task Status → DOCUMENTACIÓN ---
        try {
            await axios.put(
                `${CLICKUP_API_BASE}/task/${targetTaskId}`,
                { status: 'DOCUMENTACIÓN' },
                { headers: { Authorization: apiKey, 'Content-Type': 'application/json' } }
            );
            console.log(`[Viability] ✓ Status updated to DOCUMENTACIÓN for task ${targetTaskId}`);
        } catch (error: any) {
            // Non-blocking: log but don't fail the request
            console.warn(`[Viability] ⚠ Could not update task status:`, error.response?.data ?? error.message);
        }

        await sendWebhook(phone, 'success', `Documentación enviada correctamente a ClickUp (tarea: ${targetTaskId})`);
        return NextResponse.json({ success: true, taskId: targetTaskId });

    } catch (error: any) {
        console.error('[Viability] Internal error:', error.message);
        const phone = (await req.formData().catch(() => new FormData())).get('phone') as string ?? 'unknown';
        await sendWebhook(phone, 'error', `Error interno del servidor: ${error.message}`);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
