"use client";

import { useEffect } from "react";

const BELENDER_URL =
  "https://widget.belender.net/widget-boxed/clavepin/6d17c1b9-3ec4-431d-b009-be7742eff16c/e75aa965-4851-4cb9-b2d1-00b49d3b7950";

/**
 * Redirige a los usuarios reales al widget de Belender, reenviando intactos
 * los query params de la URL (?utm_source=…&etc). Los bots de vistas previas
 * (WhatsApp, Telegram…) no ejecutan JS, así que se quedan con las etiquetas
 * Open Graph de la página y muestran la marca Fórmula Hogar.
 */
export default function Redirect() {
  useEffect(() => {
    window.location.replace(BELENDER_URL + window.location.search);
  }, []);

  return null;
}
