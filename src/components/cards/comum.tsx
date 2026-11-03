import { cortar, formatarData, resumoAnimal, LIMITE_SINAIS, type DadosCard } from "@/lib/card";

/** Fonte do contato: reduz pelo tamanho do texto para caber em `largura` px, sem cortar. */
export function fonteContato(contato: string, largura: number, maximo: number): number {
  const porLargura = Math.floor(largura / (Math.max(contato.length, 1) * 0.6));
  return Math.max(20, Math.min(maximo, porLargura));
}

/** Textos do card já montados, sem rótulos para campos vazios. */
export function textosCard(d: DadosCard, lim: { nome: number; frase: number; sinais: number; selos: number }) {
  const procura = d.tipo === "procura_se";
  const data = formatarData(d.vistoPorUltimoEm);
  const visto = [data, cortar(d.localVistoPorUltimo, 60)].filter(Boolean).join(", ");
  return {
    procura,
    nome: cortar(d.nomeAnimal.trim(), lim.nome),
    chamada: procura ? "PROCURA-SE" : "ME ADOTA?",
    resumo: resumoAnimal(d),
    selos: procura ? [] : [...d.saude, ...d.jeito].slice(0, lim.selos),
    frase: !procura && d.frase.trim() ? cortar(d.frase.trim(), lim.frase) : "",
    sinais: procura && d.sinais.trim() ? cortar(d.sinais.trim(), Math.min(lim.sinais, LIMITE_SINAIS)) : "",
    visto: procura && visto ? `Visto por último em ${visto}` : "",
    local: [d.cidade.trim(), d.bairro.trim()].filter(Boolean).join(", "),
    recompensa: procura ? d.recompensa.trim() : "",
    cta: procura ? "Viu? Avise:" : "Quer me adotar? Chame:",
    contato: d.contatoPublico.trim(),
    rodape: procura ? "Compartilhe, ajude a voltar pra casa" : "",
  };
}

export function Foto({ url, className }: { url: string; className?: string }) {
  return url ? (
    // eslint-disable-next-line @next/next/no-img-element -- precisa ser <img> para o html-to-image
    <img src={url} alt="" className={`h-full w-full object-cover ${className ?? ""}`} />
  ) : (
    <div className="flex h-full w-full items-center justify-center bg-black/10 text-[56px] font-bold text-black/50">
      Sua foto aqui
    </div>
  );
}

export function Marca({ className }: { className?: string }) {
  return <span className={`font-display text-[24px] lowercase opacity-60 ${className ?? ""}`}>amigos da adoção</span>;
}
