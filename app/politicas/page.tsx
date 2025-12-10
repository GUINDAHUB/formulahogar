import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

const PoliticasPage = () => {
  return (
    <div className="bg-white min-h-screen font-sans text-slate-800">
        {/* Header/Nav back */}
        <div className="container mx-auto px-6 py-8">
            <Link href="/" className="inline-flex items-center gap-2 text-[#163C2E] hover:text-[#28A77D] transition-colors font-medium">
                <ArrowLeft className="w-4 h-4" />
                Volver al inicio
            </Link>
        </div>

        <div className="container mx-auto px-6 max-w-4xl pb-20">
            <h1 className="text-4xl md:text-5xl font-bold text-[#163C2E] mb-12">Políticas y Privacidad</h1>
            
            <div className="space-y-12">
                {/* AVISO LEGAL */}
                <section id="aviso-legal" className="space-y-6">
                    <h2 className="text-2xl font-bold text-[#163C2E] border-b border-slate-200 pb-4">Aviso Legal</h2>
                    <div className="prose prose-slate text-slate-600 max-w-none">
                        <p>
                            En cumplimiento con el deber de información recogido en el artículo 10 de la Ley 34/2002, de 11 de julio, 
                            de Servicios de la Sociedad de la Información y del Comercio Electrónico (LSSI), se exponen a continuación 
                            los datos identificativos de la empresa propietaria de este sitio web.
                        </p>
                        
                        <h3 className="text-lg font-bold text-[#163C2E] mt-6 mb-2">1. Datos Identificativos</h3>
                        <p>
                            El titular de este sitio web es <strong>Fórmula Hogar</strong>.
                            <br />
                            Correo electrónico de contacto: hola@formulahogar.com
                        </p>

                        <h3 className="text-lg font-bold text-[#163C2E] mt-6 mb-2">2. Propiedad Intelectual e Industrial</h3>
                        <p>
                            Los derechos de propiedad intelectual e industrial de este sitio web, incluyendo su código fuente, diseño, 
                            estructura de navegación, bases de datos y los distintos elementos en él contenidos, son titularidad de 
                            Fórmula Hogar, a quien corresponde el ejercicio exclusivo de los derechos de explotación de los mismos en 
                            cualquier forma y, en especial, los derechos de reproducción, distribución, comunicación pública y transformación.
                        </p>

                        <h3 className="text-lg font-bold text-[#163C2E] mt-6 mb-2">3. Condiciones de Uso</h3>
                        <p>
                            La utilización del sitio web atribuye la condición de usuario e implica la aceptación plena y sin reservas 
                            de todas y cada una de las disposiciones incluidas en este Aviso Legal. El usuario se compromete a utilizar 
                            el sitio web, sus servicios y contenidos de conformidad con la ley, la buena fe, el orden público y los usos 
                            del tráfico.
                        </p>
                    </div>
                </section>

                {/* POLITICA DE PRIVACIDAD */}
                <section id="privacidad" className="space-y-6">
                    <h2 className="text-2xl font-bold text-[#163C2E] border-b border-slate-200 pb-4">Política de Privacidad</h2>
                    <div className="prose prose-slate text-slate-600 max-w-none">
                        <p>
                            En Fórmula Hogar nos comprometemos a proteger la privacidad de nuestros usuarios. Esta Política de Privacidad 
                            describe cómo recopilamos, utilizamos y protegemos la información personal que nos proporcionas a través de 
                            nuestro sitio web y formularios.
                        </p>

                        <h3 className="text-lg font-bold text-[#163C2E] mt-6 mb-2">1. Responsable del Tratamiento</h3>
                        <p>
                            <strong>Identidad:</strong> Fórmula Hogar<br />
                            <strong>Email:</strong> hola@formulahogar.com
                        </p>

                        <h3 className="text-lg font-bold text-[#163C2E] mt-6 mb-2">2. Información que Recopilamos</h3>
                        <p>
                            A través de nuestro formulario de calculadora y contacto, recopilamos los siguientes datos personales necesarios 
                            para evaluar la viabilidad de nuestros servicios:
                        </p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Datos identificativos: Nombre, correo electrónico y número de teléfono.</li>
                            <li>Datos económicos y laborales: Salario neto mensual, situación laboral (tipo de contrato), y edad.</li>
                            <li>Preferencias de vivienda: Precio estimado de la vivienda, comunidad autónoma de interés y si la compra se realiza de forma individual o en pareja.</li>
                        </ul>

                        <h3 className="text-lg font-bold text-[#163C2E] mt-6 mb-2">3. Finalidad del Tratamiento</h3>
                        <p>
                            Tratamos la información que nos facilitan las personas interesadas con el fin de:
                        </p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Gestionar su solicitud de información y análisis de viabilidad para la compra de vivienda.</li>
                            <li>Realizar los cálculos necesarios para ofrecerle una simulación personalizada de nuestro servicio.</li>
                            <li>Contactar con usted para asesorarle sobre nuestros servicios y productos.</li>
                            <li>Enviar comunicaciones comerciales relacionadas con nuestros servicios (si ha dado su consentimiento).</li>
                        </ul>

                        <h3 className="text-lg font-bold text-[#163C2E] mt-6 mb-2">4. Legitimación</h3>
                        <p>
                            La base legal para el tratamiento de sus datos es el <strong>consentimiento</strong> que se le solicita al enviar 
                            el formulario, aceptando explícitamente esta política de privacidad.
                        </p>

                        <h3 className="text-lg font-bold text-[#163C2E] mt-6 mb-2">5. Destinatarios</h3>
                        <p>
                            Los datos no se cederán a terceros ajenos a la prestación del servicio, salvo obligación legal. 
                            Fórmula Hogar utiliza herramientas de terceros (como servicios de hosting y automatización) que actúan como 
                            encargados del tratamiento y cumplen con la normativa de protección de datos vigente.
                        </p>

                        <h3 className="text-lg font-bold text-[#163C2E] mt-6 mb-2">6. Derechos</h3>
                        <p>
                            Cualquier persona tiene derecho a obtener confirmación sobre si en Fórmula Hogar estamos tratando datos personales 
                            que les conciernan, o no. Las personas interesadas tienen derecho a:
                        </p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Acceder a sus datos personales.</li>
                            <li>Solicitar la rectificación de los datos inexactos.</li>
                            <li>Solicitar su supresión cuando, entre otros motivos, los datos ya no sean necesarios para los fines que fueron recogidos.</li>
                            <li>Oponerse al tratamiento de sus datos.</li>
                            <li>Solicitar la limitación del tratamiento.</li>
                        </ul>
                        <p className="mt-4">
                            Puede ejercer estos derechos enviando un correo electrónico a hola@formulahogar.com.
                        </p>
                    </div>
                </section>
            </div>
        </div>
    </div>
  );
};

export default PoliticasPage;

