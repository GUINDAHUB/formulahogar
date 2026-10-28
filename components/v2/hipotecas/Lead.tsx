import { Container, Plate, SectionMark } from "../ui";
import LeadForm from "./LeadForm";

// Mismo texto que en la página en vivo. Sin retratos de stock: iniciales.
// TODO: sustituir por testimonios reales con consentimiento.
const STORIES = [
  {
    name: "Lucía y Marc",
    initials: "LM",
    meta: "Barcelona · 32 y 34 años",
    badge: "Ahorraron 38.000 €",
    quote:
      "Pensábamos firmar con nuestro banco al 3,2% fijo. FórmulaHogar nos consiguió un 2,4% en otra entidad. La diferencia en 30 años son 38.000 € que se quedan en nuestro bolsillo.",
  },
  {
    name: "David",
    initials: "D",
    meta: "Valencia · 41 años",
    badge: "De rechazado a aprobado",
    quote:
      "Dos bancos me habían dicho que no por ser autónomo. El equipo de FórmulaHogar conocía qué entidad sí financia perfiles como el mío. Firmé en 6 semanas.",
  },
];

export default function Lead() {
  return (
    <Plate tone="ink">
      <Container className="grid gap-14 py-20 sm:py-28 lg:grid-cols-[1fr_minmax(0,500px)] lg:grid-rows-[auto_1fr] lg:gap-x-20 lg:gap-y-0">
        <div className="lg:col-start-1 lg:row-start-1">
          <SectionMark />
          <h2 className="v2-display v2-h2 mt-7 max-w-[16ch]">
            Tu análisis. <span className="v2-it text-[#BFFF00]">Y las historias que ya lo han hecho.</span>
          </h2>
          <p className="mt-6 max-w-[44ch] text-lg leading-relaxed text-white/70">
            Rellena el formulario y te llamamos en menos de 48h. Mientras, mira cómo le fue a quienes pasaron por aquí
            antes.
          </p>
        </div>

        <div className="lg:sticky lg:top-28 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-start">
          <LeadForm />
        </div>

        <div className="lg:col-start-1 lg:row-start-2 lg:mt-14">
          <h3 className="text-sm font-semibold text-white/55">Historias reales</h3>
          <ul className="mt-4 border-t border-white/15">
            {STORIES.map((s, i) => (
              <li
                key={s.name}
                data-reveal
                style={{ "--v2-delay": `${i * 120}ms` } as React.CSSProperties}
                className="border-b border-white/15 py-8"
              >
                <blockquote className="v2-display v2-it max-w-[34ch] text-[1.375rem] leading-[1.4] text-white sm:text-2xl">
                  “{s.quote}”
                </blockquote>
                <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-3">
                  <span
                    aria-hidden
                    className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white/10 text-sm font-bold text-white"
                  >
                    {s.initials}
                  </span>
                  <span className="min-w-0">
                    <span className="block font-semibold text-white">{s.name}</span>
                    <span className="block text-sm text-white/60">{s.meta}</span>
                  </span>
                  <span className="rounded-full bg-[#BFFF00] px-3 py-1.5 text-xs font-bold text-[#141313] sm:ml-auto">
                    {s.badge}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>

      </Container>
    </Plate>
  );
}
