import { Container, Plate, SectionMark } from "../ui";

const STEPS = [
  {
    num: "01",
    title: "Analizamos tu caso",
    description:
      "Estudiamos tu perfil, tu vivienda y tu situación laboral. Te decimos qué hipoteca podemos conseguirte, a qué condiciones reales, y si tu caso es viable. Todo en 48h.",
  },
  {
    num: "02",
    title: "Negociamos con los bancos",
    description:
      "Llevamos tu caso a más de 20 entidades en paralelo. Te conseguimos al menos 3 ofertas reales con condiciones que no obtendrías yendo por tu cuenta.",
  },
  {
    num: "03",
    title: "Tú eliges. Tú firmas.",
    description:
      "Te presentamos las ofertas en un comparativo claro. Eliges la que más te convenza. Nosotros gestionamos la documentación y te acompañamos hasta la firma.",
  },
];

// La placa lima es la página "Lo que toca ahora" del dossier: pasos
// numerados en serifa, separados por filetes finos.
export default function Steps() {
  return (
    <Plate tone="lime" id="como-funciona" className="mt-2 sm:mt-3">
      <Container className="grid gap-12 py-20 sm:py-28 lg:grid-cols-[5fr_7fr] lg:gap-20">
        <div>
          <SectionMark tone="ink" />
          <h2 className="v2-display v2-h2 mt-7">Tres pasos. Cero papeleo para ti.</h2>
          <p className="mt-6 max-w-[38ch] text-lg leading-relaxed text-[#141313]/75">
            Tú nos cuentas tu caso, nosotros negociamos por ti, y tú eliges la oferta.
          </p>
        </div>

        <ol className="border-t border-[#141313]/20">
          {STEPS.map((step, i) => (
            <li
              key={step.num}
              data-reveal
              style={{ "--v2-delay": `${i * 110}ms` } as React.CSSProperties}
              className="grid grid-cols-[56px_1fr] gap-x-4 border-b border-[#141313]/20 py-8 sm:grid-cols-[88px_1fr] sm:py-10"
            >
              <span className="v2-display v2-num text-[2rem] leading-none sm:text-[2.5rem]">{step.num}</span>
              <div>
                <h3 className="text-xl font-bold leading-snug sm:text-[22px]">{step.title}</h3>
                <p className="mt-3 max-w-[52ch] text-base leading-relaxed text-[#141313]/75">{step.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </Container>
    </Plate>
  );
}
