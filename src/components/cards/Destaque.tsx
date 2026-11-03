import type { DadosCard } from "@/lib/card";
import { Foto, Marca, fonteContato, textosCard } from "./comum";

type Props = { dados: DadosCard; story: boolean };

/** Foto em tela cheia, degradê escuro na base, texto branco; CTA em faixa sólida da cor do tema. */
export function Destaque({ dados, story }: Props) {
  const t = textosCard(dados, { nome: 18, frase: 80, sinais: 60, selos: 3 });
  const cor = dados.corTema;

  return (
    <div className="relative flex h-full w-full flex-col bg-neutral-900 font-sans text-white">
      <div className="absolute inset-0">
        <Foto url={dados.fotoUrl} />
      </div>
      {t.procura && (
        <div className="relative py-[22px] text-center font-display text-[84px] font-bold leading-none" style={{ backgroundColor: cor }}>
          PROCURA-SE
        </div>
      )}
      <div className="relative flex flex-1 flex-col justify-end">
        <div
          className={`flex flex-col gap-[14px] px-[60px] pb-[34px] ${story ? "pt-[360px]" : "pt-[200px]"}`}
          style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,0.85))" }}
        >
          {!t.procura && <p className="font-display text-[56px] font-bold leading-none">{t.chamada}</p>}
          {t.nome && <p className="font-display text-[110px] font-bold leading-none">{t.nome}</p>}
          {t.resumo && <p className="text-[38px] font-semibold leading-tight">{t.resumo}</p>}
          {t.visto && <p className="line-clamp-2 text-[36px] font-bold leading-tight">{t.visto}</p>}
          {t.sinais && <p className="line-clamp-1 text-[32px] leading-tight">{t.sinais}</p>}
          {t.selos.length > 0 && (
            <div className="flex flex-wrap gap-[12px]">
              {t.selos.map((s) => (
                <span key={s} className="rounded-full bg-white px-[24px] py-[6px] text-[30px] font-bold" style={{ color: cor }}>
                  {s}
                </span>
              ))}
            </div>
          )}
          {t.frase && <p className="line-clamp-2 text-[34px] italic leading-snug">“{t.frase}”</p>}
          {t.recompensa && (
            <p className="self-start rounded-2xl bg-yellow-300 px-[24px] py-[6px] text-[34px] font-black text-black">
              Recompensa: {t.recompensa}
            </p>
          )}
        </div>
      </div>
      <div className="relative px-[60px] py-[24px]" style={{ backgroundColor: cor }}>
        <p className="text-[32px] font-bold leading-tight">{t.cta}</p>
        <p className="whitespace-nowrap font-black leading-tight" style={{ fontSize: fonteContato(t.contato, 960, 64) }}>
          {t.contato}
        </p>
        <div className="mt-[6px] flex gap-[20px] text-[26px] leading-tight">
          <span className="truncate">{[t.rodape, t.local].filter(Boolean).join(" · ")}</span>
        </div>
        <Marca className="mt-[8px] block text-center" />
      </div>
    </div>
  );
}
