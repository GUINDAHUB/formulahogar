import { CheckIcon, ScalesIcon, WarningIcon } from "@phosphor-icons/react/dist/ssr";
import { Container, SectionMark } from "../ui";

const GANAS = [
  "Una cuota entre un 28 % y un 59 % más baja",
  "Entre 300 y 1.150 € más al mes en tu bolsillo",
  "Un solo recibo, a tipo hipotecario",
  "Un gestor contigo de principio a fin, hasta la notaría",
];

const CUESTA = [
  "Pagas la deuda durante más años",
  "Normalmente, más intereses en total: entre 3.500 y 21.000 € en nuestras simulaciones",
  "Mientras el banco no firma, pagas el préstamo puente; por eso vamos rápido",
  "Honorarios fijos por fases, cobrados cuando el trabajo está hecho",
];

// Cara y cruz con el mismo peso visual: dos columnas de filetes, nunca se
// esconde la del coste.
export default function Balance() {
  return (
    <section id="ventajas" className="v2-screen scroll-mt-20 py-24 sm:py-36 lg:min-h-svh lg:scroll-mt-0">
      <Container inset>
        <div className="grid gap-6 lg:grid-cols-[7fr_5fr] lg:items-end lg:gap-20">
          <div>
            <SectionMark />
            <h2 className="v2-display v2-h2 mt-7 max-w-[14ch] lg:max-w-[20ch]">Lo que ganas y lo que cuesta. Siempre juntos.</h2>
          </div>
          <p className="max-w-[44ch] text-lg leading-relaxed text-[#545454] lg:pb-2">
            Nadie debería firmar algo así sin ver las dos caras. Las ponemos en el informe, una al lado de la otra.
          </p>
        </div>

        <div className="mt-16 grid gap-14 md:grid-cols-2 md:gap-0 lg:mt-24">
          {[
            { title: "Lo que ganas", items: GANAS, good: true },
            { title: "Lo que cuesta", items: CUESTA, good: false },
          ].map((col, c) => (
            <div key={col.title} className={c === 1 ? "md:border-l md:border-[#E8E8E6] md:pl-16" : "md:pr-16"}>
              <h3 className="v2-display text-[2rem] sm:text-[2.25rem]">{col.title}</h3>
              <ul className="mt-8 border-t border-[#141313]">
                {col.items.map((item, i) => (
                  <li
                    key={item}
                    data-reveal
                    style={{ "--v2-delay": `${i * 80}ms` } as React.CSSProperties}
                    className="flex items-start gap-4 border-b border-[#E8E8E6] py-6 text-base leading-relaxed sm:text-lg"
                  >
                    <span
                      className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full ${
                        col.good ? "bg-[#BFFF00]" : "bg-[#F2F2F0]"
                      }`}
                    >
                      {col.good ? (
                        <CheckIcon size={13} weight="bold" color="#141313" />
                      ) : (
                        <WarningIcon size={13} weight="fill" color="#141313" />
                      )}
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="mt-16 flex max-w-3xl items-center gap-5 lg:mt-24">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#141313]">
            <ScalesIcon size={22} weight="fill" color="#BFFF00" />
          </span>
          <span className="v2-display text-xl leading-snug sm:text-2xl">
            Fusión no reduce tu deuda: la reorganiza. Lo ponemos por escrito en el contrato.
          </span>
        </p>
      </Container>
    </section>
  );
}
