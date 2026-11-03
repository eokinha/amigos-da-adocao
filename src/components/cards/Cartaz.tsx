import type { DadosCard } from "@/lib/card";
import { Foto, Marca, fonteContato, textosCard } from "./comum";

type Props = { dados: DadosCard; story: boolean };

/** Cartaz de poste: faixa de título enorme, foto central com borda, dados em blocos, contato grande embaixo. */
export function Cartaz({ dados, story }: Props) {
  const t = textosCard(dados, { nome: 20, frase: story ? 120 : 75, sinais: 80, selos: 6 });
  const cor = dados.corTema;

  return (
    <div className="flex h-full w-full flex-col bg-white font-sans text-neutral-900">
      <div className="py-[16px] text-center font-display font-bold leading-none text-white" style={{ backgroundColor: cor }}>
        <p className={story ? "text-[150px]" : "text-[110px]"}>{t.chamada}</p>
      </div>
      <div className={`flex min-h-0 flex-1 gap-[34px] px-[50px] py-[30px] ${story ? "flex-col items-center" : ""}`}>
        <div
          className={`shrink-0 overflow-hidden border-[10px] ${story ? "h-[790px] w-[980px]" : "h-full w-[520px]"}`}
          style={{ borderColor: cor }}
        >
          <Foto url={dados.fotoUrl} />
        </div>
        <div className={`flex min-h-0 min-w-0 flex-1 flex-col gap-[16px] overflow-hidden ${story ? "w-full justify-start" : "justify-center"}`}>
          {t.nome && (
            <p className={`break-words font-display font-bold leading-none ${story ? "text-[100px]" : "text-[64px]"}`} style={{ color: cor }}>
              {t.nome}
            </p>
          )}
          {t.resumo && <p className={`font-bold leading-tight ${story ? "text-[46px]" : "text-[30px]"}`}>{t.resumo}</p>}
          {t.recompensa && (
            <p className={`self-start rounded-xl bg-yellow-300 px-[20px] py-[4px] ${story ? "text-[44px]" : "text-[32px]"} font-black`}>Recompensa: {t.recompensa}</p>
          )}
          {t.visto && (
            <p className={`border-l-[8px] pl-[16px] font-bold leading-tight ${story ? "text-[40px]" : "text-[30px]"}`} style={{ borderColor: cor }}>
              {t.visto}
            </p>
          )}
          {t.sinais && <p className={`leading-tight ${story ? "text-[36px]" : "text-[28px]"}`}>{t.sinais}</p>}
          {t.selos.length > 0 && (
            <p className={`font-bold leading-tight ${story ? "text-[36px]" : "text-[28px]"}`} style={{ color: cor }}>
              {t.selos.join(" · ")}
            </p>
          )}
          {t.frase && <p className={`line-clamp-3 italic leading-snug ${story ? "text-[36px]" : "text-[26px]"}`}>“{t.frase}”</p>}
          {t.local && <p className={`leading-tight opacity-80 ${story ? "text-[34px]" : "text-[26px]"}`}>{t.local}</p>}
        </div>
      </div>
      <div className={`px-[50px] text-center text-white ${story ? "py-[56px]" : "py-[22px]"}`} style={{ backgroundColor: cor }}>
        <p className={`font-bold leading-tight ${story ? "text-[48px]" : "text-[34px]"}`}>{t.cta}</p>
        <p className="whitespace-nowrap font-black leading-tight" style={{ fontSize: fonteContato(t.contato, 980, story ? 100 : 80) }}>
          {t.contato}
        </p>
        {t.rodape && <p className={`font-semibold leading-tight ${story ? "text-[38px]" : "text-[28px]"}`}>{t.rodape}</p>}
        <Marca />
      </div>
    </div>
  );
}
