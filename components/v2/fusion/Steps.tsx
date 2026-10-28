import { InfoIcon } from "@phosphor-icons/react/dist/ssr";
import { Container, Plate, SectionMark } from "../ui";

const STEPS = [
  { title: "Estudio de viabilidad", when: "Antes de firmar nada", text: "Te decimos cuánto baja tu cuota y cuánto cuesta en total." },
  { title: "Una sola cuota", when: "Semanas 1 a 3", text: "Un préstamo puente paga todas tus deudas de golpe." },
  { title: "Todo en tu hipoteca", when: "Meses 2 a 5", text: "El banco amplía tu hipoteca: un único recibo, más bajo." },
];

// Tres pasos que se leen de un vistazo: número, título, cuándo y una frase.
export default function Steps() {
  return (
    <Plate tone="lime" id="como-funciona" screen className="mt-2 sm:mt-3 lg:mt-0">
      <Container className="py-20 sm:py-28 lg:py-20">
        <div className="max-w-2xl">
          <SectionMark tone="ink" />
          <h2 className="v2-display v2-h2 mt-7">De varios recibos a uno, en tres pasos.</h2>
          <p className="mt-6 max-w-[40ch] text-lg leading-relaxed text-[#141313]/75">
            Tú nos cuentas lo que debes. Nosotros hacemos los números y el papeleo.
          </p>
        </div>

        <ol className="relative mt-14 grid gap-10 md:grid-cols-3 md:gap-8 lg:mt-20">
          <span aria-hidden className="absolute left-[27px] top-2 h-[calc(100%-16px)] w-px bg-[#141313]/25 md:left-0 md:top-[27px] md:h-px md:w-full" />
          {STEPS.map((step, i) => (
            <li
              key={step.title}
              data-reveal
              style={{ "--v2-delay": `${i * 120}ms` } as React.CSSProperties}
              className="relative grid grid-cols-[56px_1fr] gap-x-5 md:block"
            >
              <span className="v2-display v2-num relative grid h-14 w-14 place-items-center rounded-full bg-[#141313] text-xl text-[#BFFF00]">
                {i + 1}
              </span>
              <div className="md:mt-8">
                <p className="text-sm font-semibold text-[#141313]/65">{step.when}</p>
                <h3 className="v2-display mt-2 text-[1.75rem] leading-tight sm:text-[2rem]">{step.title}</h3>
                <p className="mt-3 max-w-[30ch] text-base leading-relaxed text-[#141313]/80 sm:text-lg">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>

        <p className="mt-14 flex max-w-xl items-start gap-3 text-sm leading-relaxed text-[#141313]/75 lg:mt-20">
          <InfoIcon size={18} weight="fill" color="#141313" className="mt-0.5 shrink-0" />
          El paso 3 depende de que el banco lo apruebe. Si no sale, ya pagas menos que hoy.
        </p>
      </Container>
    </Plate>
  );
}
