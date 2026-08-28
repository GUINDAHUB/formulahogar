import { redirect } from "next/navigation";

// Hipotecas es ahora la home (/).
// Mantenemos esta ruta como redirección para no romper anuncios ni enlaces existentes.
export default function HipotecasRedirect() {
  redirect("/");
}
