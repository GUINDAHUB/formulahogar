"use client";

import { useEffect } from "react";

export const RESERVAR_URL = "https://wh.formulahogar.com/reservar";

/**
 * Redirige a las personas a la agenda de reservas, reenviando intactos los
 * query params (?utm_source=…). Los bots de vistas previas (WhatsApp,
 * Instagram, LinkedIn, X…) no ejecutan JS, así que leen las etiquetas Open
 * Graph de esta página y muestran la tarjeta de Fórmula Hogar.
 */
export default function Redirect() {
  useEffect(() => {
    window.location.replace(RESERVAR_URL + window.location.search);
  }, []);

  return null;
}
