"use client";

import Image from "next/image";
import LeadForm from "./LeadForm";

// TODO: sustituir por testimonios reales con foto y consentimiento.
// Las fotos vienen de randomuser.me para tener algo decente mientras
// tanto. Cuando tengas las reales, mete los archivos en /public/historias/
// y cambia el `photo` por la ruta local.
interface Story {
  name: string;
  meta: string;
  badge: string;
  photo: string;
  quote: string;
}

const STORIES: Story[] = [
  {
    name: "Lucía y Marc",
    meta: "Barcelona · 32 y 34 años",
    badge: "Ahorraron 38.000 €",
    photo: "https://randomuser.me/api/portraits/women/65.jpg",
    quote:
      "Pensábamos firmar con nuestro banco al 3,2% fijo. FórmulaHogar nos consiguió un 2,4% en otra entidad. La diferencia en 30 años son 38.000 € que se quedan en nuestro bolsillo.",
  },
  {
    name: "David",
    meta: "Valencia · 41 años",
    badge: "De rechazado a aprobado",
    photo: "https://randomuser.me/api/portraits/men/41.jpg",
    quote:
      "Dos bancos me habían dicho que no por ser autónomo. El equipo de FórmulaHogar conocía qué entidad sí financia perfiles como el mío. Firmé en 6 semanas.",
  },
];

export default function LeadAndStories() {
  return (
    <section className="bg-white py-20 md:py-28">
      <div className="container mx-auto px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#545454]">
            Empieza ya
          </p>
          <h2 className="font-display mt-3 text-3xl text-[#141313] md:text-5xl">
            Tu análisis. Y las historias que ya lo han hecho.
          </h2>
          <p className="mt-4 text-base text-[#545454] md:text-lg">
            Rellena el formulario y te llamamos en menos de 48h. Mientras,
            mira cómo le fue a quienes pasaron por aquí antes.
          </p>
        </div>

        <div className="mt-14 grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16 items-start">
          <div className="order-2 lg:order-1">
            <LeadForm />
          </div>

          <div className="order-1 lg:order-2 space-y-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#545454]">
              Historias reales
            </p>
            {STORIES.map((s) => (
              <article
                key={s.name}
                className="rounded-xl border border-[#EBEBEB] bg-white p-6"
              >
                <div className="flex items-center gap-4">
                  <Image
                    src={s.photo}
                    alt={s.name}
                    width={48}
                    height={48}
                    unoptimized
                    className="h-12 w-12 rounded-full object-cover"
                  />
                  <div className="min-w-0">
                    <p className="font-semibold text-[#141313]">{s.name}</p>
                    <p className="text-xs text-[#545454]">{s.meta}</p>
                  </div>
                  <span className="ml-auto inline-flex shrink-0 items-center rounded-full bg-[#BFFF00] px-3 py-1 text-xs font-bold text-[#141313]">
                    {s.badge}
                  </span>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-[#141313]">
                  “{s.quote}”
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
