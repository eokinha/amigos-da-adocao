"use client";

import { useEffect, useRef, useState } from "react";
import { toPng } from "html-to-image";
import { CardPreview } from "./CardPreview";
import {
  CORES_TEMA,
  ESTILOS,
  FORMATOS,
  JEITO,
  LIMITE_FRASE,
  LIMITE_JEITO,
  LIMITE_NOME,
  LIMITE_SINAIS,
  ROTULO_IDADE,
  ROTULO_PORTE,
  SAUDE,
  dadosIniciais,
  nomeArquivo,
  trocarTipo,
  validarCard,
  validarFoto,
  type DadosCard,
  type Estilo,
  type Formato,
  type TipoCard,
} from "@/lib/card";

type Erros = ReturnType<typeof validarCard>;

export function Gerador() {
  const [dados, setDados] = useState<DadosCard>(() => dadosIniciais());
  const [formato, setFormato] = useState<Formato>("post");
  const [erros, setErros] = useState<Erros>({});
  const [erroFoto, setErroFoto] = useState<string | null>(null);
  const [gerando, setGerando] = useState(false);
  const [naPrevia, setNaPrevia] = useState(false);
  const [podeCompartilhar, setPodeCompartilhar] = useState(false);
  const [larguraPrevia, setLarguraPrevia] = useState(340);
  const cardRef = useRef<HTMLDivElement>(null);
  const previaRef = useRef<HTMLDivElement>(null);
  const caixaRef = useRef<HTMLDivElement>(null);

  const procura = dados.tipo === "procura_se";
  const { largura, altura } = FORMATOS[formato];
  const escala = larguraPrevia / largura;

  // Largura da prévia acompanha a tela; botão principal muda quando a prévia aparece.
  useEffect(() => {
    const caixa = caixaRef.current;
    const previa = previaRef.current;
    if (!caixa || !previa) return;
    const ro = new ResizeObserver(([e]) => setLarguraPrevia(Math.min(e.contentRect.width, 420)));
    ro.observe(caixa);
    const io = new IntersectionObserver(([e]) => setNaPrevia(e.isIntersecting), { threshold: 0.3 });
    io.observe(previa);
    setPodeCompartilhar(typeof navigator.canShare === "function");
    return () => (ro.disconnect(), io.disconnect());
  }, []);

  function set<K extends keyof DadosCard>(campo: K, valor: DadosCard[K]) {
    setDados((d) => ({ ...d, [campo]: valor }));
    setErros((e) => ({ ...e, [campo]: undefined }));
  }

  function mudarTipo(tipo: TipoCard) {
    setDados((d) => trocarTipo(d, tipo));
    setErros({});
  }

  function aoEscolherFoto(arquivo: File | undefined) {
    if (!arquivo) return;
    const erro = validarFoto(arquivo);
    setErroFoto(erro);
    if (erro) return;
    const leitor = new FileReader();
    leitor.onload = () => set("fotoUrl", String(leitor.result));
    leitor.readAsDataURL(arquivo);
  }

  function alternar(campo: "saude" | "jeito", valor: string, limite = Infinity) {
    setDados((d) => {
      const lista = d[campo];
      if (lista.includes(valor)) return { ...d, [campo]: lista.filter((x) => x !== valor) };
      return lista.length < limite ? { ...d, [campo]: [...lista, valor] } : d;
    });
  }

  /** Valida; se faltar algo, rola até o primeiro campo com erro. */
  function validar(): boolean {
    const encontrados = validarCard(dados);
    setErros(encontrados);
    const primeiro = Object.keys(encontrados)[0];
    if (primeiro) {
      const el = document.getElementById(`campo-${primeiro}`);
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
      el?.querySelector<HTMLElement>("input,textarea")?.focus({ preventScroll: true });
      return false;
    }
    return true;
  }

  function verCard() {
    if (validar()) previaRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function gerar(): Promise<string | null> {
    if (!validar() || !cardRef.current) return null;
    setGerando(true);
    try {
      return await toPng(cardRef.current, { width: largura, height: altura, pixelRatio: 1, cacheBust: true });
    } catch {
      alert("Não foi possível gerar a imagem. Tente outra foto ou outro navegador.");
      return null;
    } finally {
      setGerando(false);
    }
  }

  async function baixar() {
    const url = await gerar();
    if (!url) return;
    const a = document.createElement("a");
    a.href = url;
    a.download = nomeArquivo(dados, formato);
    a.click();
  }

  async function compartilhar() {
    const url = await gerar();
    if (!url) return;
    const blob = await (await fetch(url)).blob();
    const arquivo = new File([blob], nomeArquivo(dados, formato), { type: "image/png" });
    if (!navigator.canShare?.({ files: [arquivo] })) return baixar();
    try {
      await navigator.share({ files: [arquivo] });
    } catch {
      // usuário cancelou
    }
  }

  const temErro = Object.values(erros).some(Boolean);

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_420px] lg:pb-0">
      <form className="flex flex-col gap-6" onSubmit={(e) => (e.preventDefault(), verCard())} noValidate>
        {/* 1. Tipo */}
        <div className="grid grid-cols-2 gap-2 rounded-2xl bg-stone-100 p-1.5">
          {(["adocao", "procura_se"] as const).map((t) => (
            <button
              key={t}
              type="button"
              aria-pressed={dados.tipo === t}
              onClick={() => mudarTipo(t)}
              className={`min-h-14 rounded-xl font-bold transition ${dados.tipo === t ? "bg-white text-stone-900 shadow" : "text-stone-500"}`}
            >
              {t === "adocao" ? "🏠 Para adoção" : "🔎 Animal perdido"}
            </button>
          ))}
        </div>

        {/* 2. Foto */}
        <div id="campo-fotoUrl">
          <label
            className={`flex cursor-pointer items-center gap-4 rounded-2xl border-2 border-dashed p-4 ${erros.fotoUrl || erroFoto ? "border-red-400 bg-red-50" : "border-stone-300 bg-white"}`}
          >
            {dados.fotoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element -- miniatura local (data URL)
              <img src={dados.fotoUrl} alt="" className="h-20 w-20 shrink-0 rounded-xl object-cover" />
            ) : (
              <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-stone-100 text-3xl">📷</span>
            )}
            <span>
              <span className="block font-bold text-stone-900">{dados.fotoUrl ? "Trocar foto" : "Tirar ou escolher foto *"}</span>
              <span className="text-sm text-stone-500">Uma foto nítida, de frente, convence mais.</span>
            </span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="sr-only"
              onChange={(e) => aoEscolherFoto(e.target.files?.[0])}
            />
          </label>
          <Erro msg={erroFoto ?? erros.fotoUrl} />
        </div>

        {/* 3. Dados */}
        <Bloco titulo={procura ? "Quem está perdido" : "Quem procura um lar"}>
          <Campo id="nomeAnimal" rotulo={procura ? "Nome (atende por) *" : "Nome *"} erro={erros.nomeAnimal}>
            <input className={inp} value={dados.nomeAnimal} onChange={(e) => set("nomeAnimal", e.target.value)} maxLength={LIMITE_NOME} autoComplete="off" />
          </Campo>
          <Chips
            rotulo="Espécie *"
            opcoes={{ cachorro: "Cachorro", gato: "Gato", outro: "Outro" }}
            valor={dados.especie}
            aoMudar={(v) => set("especie", v as DadosCard["especie"])}
          />
          <Chips
            rotulo="Sexo"
            opcoes={{ macho: "Macho", femea: "Fêmea", desconhecido: "Não sei" }}
            valor={dados.sexo}
            aoMudar={(v) => set("sexo", v as DadosCard["sexo"])}
          />
          {!procura && (
            <Chips rotulo="Idade" opcoes={ROTULO_IDADE} valor={dados.idade} aoMudar={(v) => set("idade", v as DadosCard["idade"])} opcional />
          )}
          <Chips rotulo="Porte" opcoes={ROTULO_PORTE} valor={dados.porte} aoMudar={(v) => set("porte", v as DadosCard["porte"])} opcional />
        </Bloco>

        {procura ? (
          <Bloco titulo="Onde e quando foi visto">
            <div className="grid grid-cols-[auto_1fr] gap-3">
              <Campo id="vistoPorUltimoEm" rotulo="Data *" erro={erros.vistoPorUltimoEm}>
                <input type="date" className={inp} value={dados.vistoPorUltimoEm} onChange={(e) => set("vistoPorUltimoEm", e.target.value)} />
              </Campo>
              <Campo id="localVistoPorUltimo" rotulo="Local *" erro={erros.localVistoPorUltimo}>
                <input className={inp} placeholder="ex.: Praça Central" value={dados.localVistoPorUltimo} onChange={(e) => set("localVistoPorUltimo", e.target.value)} maxLength={60} />
              </Campo>
            </div>
            <Campo id="sinais" rotulo={`Sinais para reconhecer (${dados.sinais.length}/${LIMITE_SINAIS})`} erro={erros.sinais}>
              <input className={inp} placeholder="ex.: coleira vermelha, mancha no olho" value={dados.sinais} onChange={(e) => set("sinais", e.target.value)} maxLength={LIMITE_SINAIS} />
            </Campo>
            <Campo id="recompensa" rotulo="Recompensa (opcional)">
              <input className={inp} placeholder="ex.: R$ 500" value={dados.recompensa} onChange={(e) => set("recompensa", e.target.value)} maxLength={30} />
            </Campo>
          </Bloco>
        ) : (
          <Bloco titulo="Por que adotar">
            <Multi rotulo="Saúde" opcoes={SAUDE} valores={dados.saude} aoAlternar={(v) => alternar("saude", v)} />
            <Multi
              rotulo={`Jeito (até ${LIMITE_JEITO})`}
              opcoes={JEITO}
              valores={dados.jeito}
              aoAlternar={(v) => alternar("jeito", v, LIMITE_JEITO)}
              limite={LIMITE_JEITO}
            />
            <Campo id="frase" rotulo={`Uma frase sobre ele (${dados.frase.length}/${LIMITE_FRASE})`} erro={erros.frase}>
              <textarea className={inp} rows={2} placeholder="ex.: Adora colo e dorme de conchinha" value={dados.frase} onChange={(e) => set("frase", e.target.value)} maxLength={LIMITE_FRASE} />
            </Campo>
          </Bloco>
        )}

        <Bloco titulo="Contato">
          <div className="grid grid-cols-2 gap-3">
            <Campo id="cidade" rotulo="Cidade *" erro={erros.cidade}>
              <input className={inp} value={dados.cidade} onChange={(e) => set("cidade", e.target.value)} maxLength={40} autoComplete="address-level2" />
            </Campo>
            <Campo id="bairro" rotulo="Bairro">
              <input className={inp} value={dados.bairro} onChange={(e) => set("bairro", e.target.value)} maxLength={40} />
            </Campo>
          </div>
          <Campo id="contatoPublico" rotulo="Contato que vai no card *" erro={erros.contatoPublico}>
            <input className={inp} placeholder="WhatsApp ou @instagram" value={dados.contatoPublico} onChange={(e) => set("contatoPublico", e.target.value)} maxLength={40} />
          </Campo>
          <p className="-mt-2 text-xs text-stone-500">Só esse contato aparece no card. Nunca mostramos seu e-mail.</p>
        </Bloco>
      </form>

      {/* 4. Prévia */}
      <div ref={previaRef} id="previa" className="scroll-mt-4 lg:sticky lg:top-6 lg:self-start">
        <h2 className="mb-3 font-display text-xl font-bold text-stone-900">Seu card</h2>
        <div ref={caixaRef} className="w-full">
          <div className="mx-auto overflow-hidden rounded-2xl shadow-xl" style={{ width: larguraPrevia, height: altura * escala }}>
            <div style={{ transform: `scale(${escala})`, transformOrigin: "top left" }}>
              <CardPreview ref={cardRef} dados={dados} formato={formato} />
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-4">
          <Chips
            rotulo="Estilo"
            opcoes={ESTILOS}
            valor={dados.estilo}
            aoMudar={(v) => set("estilo", v as Estilo)}
          />
          <Chips
            rotulo="Formato"
            opcoes={{ post: "Post (quadrado)", story: "Story (vertical)" }}
            valor={formato}
            aoMudar={(v) => setFormato(v as Formato)}
          />
          <div>
            <p className={rot}>Cor</p>
            <div className="flex gap-3">
              {CORES_TEMA[dados.tipo].map((cor) => (
                <button
                  key={cor}
                  type="button"
                  aria-label={`Cor ${cor}`}
                  aria-pressed={dados.corTema === cor}
                  onClick={() => set("corTema", cor)}
                  className={`h-11 w-11 rounded-full ring-offset-2 ${dados.corTema === cor ? "ring-2 ring-stone-900" : ""}`}
                  style={{ backgroundColor: cor }}
                />
              ))}
            </div>
          </div>
          <div className="hidden gap-2 lg:flex">
            <BotaoPrincipal onClick={baixar} disabled={gerando}>{gerando ? "Gerando…" : "Baixar card"}</BotaoPrincipal>
          </div>
          {temErro && <p className="text-center text-sm text-red-600">Confira os campos destacados.</p>}
        </div>
      </div>

      {/* 5. Botão principal fixo (celular) */}
      <div className="fixed inset-x-0 bottom-0 z-10 border-t border-stone-200 bg-white/95 p-3 backdrop-blur lg:hidden" style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}>
        <div className="mx-auto flex max-w-xl gap-2">
          {naPrevia ? (
            <>
              <BotaoPrincipal onClick={baixar} disabled={gerando}>{gerando ? "Gerando…" : "Baixar card"}</BotaoPrincipal>
              {podeCompartilhar && (
                <button type="button" onClick={compartilhar} disabled={gerando} className="min-h-14 rounded-2xl border-2 border-stone-900 px-5 font-bold text-stone-900 disabled:opacity-60">
                  Compartilhar
                </button>
              )}
            </>
          ) : (
            <BotaoPrincipal onClick={verCard}>Ver meu card</BotaoPrincipal>
          )}
        </div>
      </div>
    </div>
  );
}

const inp =
  "w-full min-h-12 rounded-xl border border-stone-300 bg-white px-3 py-2 text-base outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200";
const rot = "mb-2 text-sm font-semibold text-stone-700";

function BotaoPrincipal(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      {...props}
      className="min-h-14 flex-1 rounded-2xl bg-orange-500 text-lg font-bold text-white hover:bg-orange-600 disabled:opacity-60"
    />
  );
}

function Bloco({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-5 rounded-2xl border border-stone-200 bg-white p-4 sm:p-5">
      <h2 className="font-display text-lg font-bold text-stone-900">{titulo}</h2>
      {children}
    </section>
  );
}

function Campo({ id, rotulo, erro, children }: { id: string; rotulo: string; erro?: string; children: React.ReactNode }) {
  return (
    <label id={`campo-${id}`} className={`flex flex-col gap-1 text-sm font-semibold text-stone-700 ${erro ? "[&_input]:border-red-400 [&_textarea]:border-red-400" : ""}`}>
      {rotulo}
      {children}
      <Erro msg={erro} />
    </label>
  );
}

const chip = (ativo: boolean) =>
  `min-h-11 rounded-full border px-4 text-sm font-semibold transition ${ativo ? "border-orange-500 bg-orange-50 text-orange-700" : "border-stone-300 bg-white text-stone-600"}`;

/** Escolha única. `opcional` permite desmarcar tocando de novo. */
function Chips({ rotulo, opcoes, valor, aoMudar, opcional }: { rotulo: string; opcoes: Record<string, string>; valor: string; aoMudar: (v: string) => void; opcional?: boolean }) {
  return (
    <div role="radiogroup" aria-label={rotulo}>
      <p className={rot}>{rotulo}</p>
      <div className="flex flex-wrap gap-2">
        {Object.entries(opcoes).map(([v, r]) => (
          <button key={v} type="button" role="radio" aria-checked={valor === v} onClick={() => aoMudar(opcional && valor === v ? "" : v)} className={chip(valor === v)}>
            {r}
          </button>
        ))}
      </div>
    </div>
  );
}

/** Escolha múltipla, com limite opcional. */
function Multi({ rotulo, opcoes, valores, aoAlternar, limite }: { rotulo: string; opcoes: string[]; valores: string[]; aoAlternar: (v: string) => void; limite?: number }) {
  const cheio = limite !== undefined && valores.length >= limite;
  return (
    <div role="group" aria-label={rotulo}>
      <p className={rot}>{rotulo}</p>
      <div className="flex flex-wrap gap-2">
        {opcoes.map((o) => {
          const ativo = valores.includes(o);
          return (
            <button key={o} type="button" aria-pressed={ativo} disabled={cheio && !ativo} onClick={() => aoAlternar(o)} className={`${chip(ativo)} disabled:opacity-40`}>
              {o}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Erro({ msg }: { msg?: string | null }) {
  return msg ? <span className="mt-1 block text-sm font-normal text-red-600">{msg}</span> : null;
}
