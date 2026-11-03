import type { DadosCard } from "@/lib/card";
import { Foto, Marca, fonteContato, textosCard } from "./comum";

type Props = { dados: DadosCard; story: boolean };

/** Fundo claro com textura leve, foto em moldura branca inclinada, nome manuscrito, selos como etiquetas. */
export function Polaroid({ dados, story }: Props) {
  const t = textosCard(dados, { nome: 14, frase: 120, sinais: 80, selos: story ? 6 : 3 });
  const cor = dados.corTema;

  return (
    <div
      className="flex h-full w-full flex-col items-center font-sans text-neutral-800"
      style={{
        backgroundColor: "#fdf8f0",
        backgroundImage: "radial-gradient(rgba(0,0,0,0.05) 2px, transparent 2px)",
        backgroundSize: "28px 28px",
      }}
    >
      <p className={`pt-[30px] font-display font-bold leading-none ${story ? "text-[110px]" : "text-[72px]"}`} style={{ color: cor }}>
        {t.chamada}
      </p>
      <div
        className={`mt-[24px] bg-white p-[22px] pb-[14px] shadow-[0_12px_30px_rgba(0,0,0,0.18)] ${story ? "w-[860px]" : "w-[560px]"}`}
        style={{ transform: "rotate(-2.5deg)" }}
      >
        <div className={`overflow-hidden ${story ? "h-[790px]" : dados.tipo === "procura_se" ? "h-[330px]" : "h-[430px]"}`}>
          <Foto url={dados.fotoUrl} />
        </div>
        <p className={`text-center font-display font-bold leading-tight ${story ? "text-[88px]" : "text-[60px]"}`} style={{ color: cor }}>
          {t.nome}
        </p>
      </div>
      <div className={`flex min-h-0 w-full flex-1 flex-col items-center ${story ? "gap-[20px]" : "gap-[10px]"} overflow-hidden [&>*]:shrink-0 px-[60px] text-center ${story ? "pt-[50px]" : "pt-[24px]"}`}>
        {t.resumo && <p className={`font-bold leading-tight ${story ? "text-[46px]" : "text-[32px]"}`}>{t.resumo}</p>}
        {t.recompensa && (
          <p className={`rounded-xl bg-yellow-300 px-[20px] py-[4px] font-black text-black ${story ? "text-[44px]" : "text-[28px]"}`}>Recompensa: {t.recompensa}</p>
        )}
        {t.visto && <p className={`line-clamp-2 font-bold leading-tight ${story ? "text-[44px]" : "text-[30px]"}`}>{t.visto}</p>}
        {t.sinais && <p className={`line-clamp-2 leading-tight ${story ? "text-[40px]" : "text-[28px]"}`}>{t.sinais}</p>}
        {t.selos.length > 0 && (
          <div className={`flex justify-center gap-[12px] whitespace-nowrap ${story ? "flex-wrap" : "flex-nowrap"}`}>
            {t.selos.map((s, i) => (
              <span
                key={s}
                className={`border-2 border-dashed bg-white px-[18px] py-[2px] font-bold ${story ? "text-[38px]" : "text-[26px]"}`}
                style={{ borderColor: cor, color: cor, transform: `rotate(${i % 2 ? 1.5 : -1.5}deg)` }}
              >
                {s}
              </span>
            ))}
          </div>
        )}
        {t.frase && (
          <p className={`italic leading-snug ${story ? "text-[44px] line-clamp-3" : "text-[26px] line-clamp-2"}`}>“{t.frase}”</p>
        )}
      </div>
      <div className={`w-full px-[60px] text-center text-white ${story ? "py-[60px]" : "py-[28px]"}`} style={{ backgroundColor: cor }}>
        <p className={`font-bold leading-tight ${story ? "text-[48px]" : "text-[34px]"}`}>{t.cta}</p>
        <p className="whitespace-nowrap font-black leading-tight" style={{ fontSize: fonteContato(t.contato, 960, story ? 96 : 66) }}>
          {t.contato}
        </p>
        <div className={`flex items-center justify-center gap-[16px] mt-[8px] whitespace-nowrap leading-tight ${story ? "text-[36px]" : "text-[28px]"}`}>
          <span className="min-w-0 truncate">{[t.rodape, t.local].filter(Boolean).join(" · ")}</span>
        </div>
        <Marca className="mt-[8px] block text-center" />
      </div>
    </div>
  );
}
