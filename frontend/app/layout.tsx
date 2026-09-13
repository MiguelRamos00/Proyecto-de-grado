import type { Metadata } from "next";
import "./estilos.css";

export const metadata: Metadata = {
  title: "Agente de orientación",
  description: "MVP del agente conversacional del proyecto RADIA.",
};

export default function DisposicionRaiz({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
