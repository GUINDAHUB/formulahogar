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

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const phone = formData.get('phone') as string;
        const employmentStatus = formData.get('employmentStatus') as EmploymentStatus;

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
                        console.log(`[Viability] ✓ Found via custom field (${phoneValue}): ${response.data.tasks[0].name} (${targetTaskId})`);
                        break;
                    }
                } catch (error: any) {
                    console.error(`[Viability] Error filtering with ${phoneValue}:`, error.message);
                }
            }
        }

        // Strategy 2: Fallback - fetch and scan tasks (paginated)
        if (!targetTaskId) {
            console.log('[Viability] Custom field search failed, scanning tasks...');

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
                        console.log(`[Viability] ✓ Found via scan on page ${page}: ${found.name} (${targetTaskId})`);
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
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // --- 4. Upload Files ---
        console.log(`[Viability] Uploading ${files.length} files to task ${targetTaskId}...`);

        const uploadPromises = files.map(async (file) => {
            const body = new FormData();
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
        return NextResponse.json({ success: true, taskId: targetTaskId });

    } catch (error: any) {
        console.error('[Viability] Internal error:', error.message);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
