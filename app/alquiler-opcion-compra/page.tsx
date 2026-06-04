import { redirect } from "next/navigation";

// Alquiler con Opción a Compra es ahora la home (/).
// Mantenemos esta ruta como redirección para no romper anuncios ni enlaces existentes.
export default function AlquilerOpcionCompraRedirect() {
  redirect("/");
}
