import { forwardRef } from "react";
import { FORMATOS, type DadosCard, type Formato } from "@/lib/card";
import { Cartaz } from "./cards/Cartaz";
import { Destaque } from "./cards/Destaque";
import { Polaroid } from "./cards/Polaroid";

type Props = { dados: DadosCard; formato: Formato };

const ESTILOS = { destaque: Destaque, polaroid: Polaroid, cartaz: Cartaz };

/** Card em tamanho real (1080px de largura). Quem usa escala com CSS para o preview. */
export const CardPreview = forwardRef<HTMLDivElement, Props>(function CardPreview({ dados, formato }, ref) {
  const { largura, altura } = FORMATOS[formato];
  const Estilo = ESTILOS[dados.estilo] ?? Polaroid;
  return (
    <div ref={ref} style={{ width: largura, height: altura }} className="relative overflow-hidden">
      <Estilo dados={dados} story={formato === "story"} />
    </div>
  );
});
