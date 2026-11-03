export type TipoCard = "adocao" | "procura_se";
export type Especie = "cachorro" | "gato" | "outro";
export type Porte = "pequeno" | "medio" | "grande";
export type Sexo = "macho" | "femea" | "desconhecido";
export type Idade = "filhote" | "jovem" | "adulto" | "idoso";
export type Formato = "post" | "story";
export type Estilo = "destaque" | "polaroid" | "cartaz";

export type DadosCard = {
  tipo: TipoCard;
  nomeAnimal: string;
  especie: Especie;
  porte: Porte | "";
  sexo: Sexo;
  idade: Idade | ""; // só adoção
  saude: string[]; // só adoção
  jeito: string[]; // só adoção, até LIMITE_JEITO
  frase: string; // só adoção
  sinais: string; // só procura-se: sinais para reconhecer
  fotoUrl: string;
  cidade: string;
  bairro: string;
  contatoPublico: string;
  vistoPorUltimoEm: string; // AAAA-MM-DD
  localVistoPorUltimo: string;
  recompensa: string;
  corTema: string;
  estilo: Estilo;
};

export const FORMATOS: Record<Formato, { largura: number; altura: number; rotulo: string }> = {
  post: { largura: 1080, altura: 1080, rotulo: "Post" },
  story: { largura: 1080, altura: 1920, rotulo: "Story" },
};

export const SAUDE = ["Castrado", "Vacinado", "Vermifugado"];
export const JEITO = ["Carinhoso", "Brincalhão", "Calmo", "Dócil", "Bom com crianças", "Convive com outros animais"];
export const LIMITE_JEITO = 3;

export const ESTILOS: Record<Estilo, string> = { polaroid: "Polaroid", cartaz: "Cartaz", destaque: "Destaque" };
export const ESTILO_PADRAO: Record<TipoCard, Estilo> = { adocao: "polaroid", procura_se: "cartaz" };

export const ROTULO_ESPECIE: Record<Especie, string> = { cachorro: "Cachorro", gato: "Gato", outro: "Outro" };
export const ROTULO_PORTE: Record<Porte, string> = { pequeno: "Pequeno", medio: "Médio", grande: "Grande" };
export const ROTULO_IDADE: Record<Idade, string> = { filhote: "Filhote", jovem: "Jovem", adulto: "Adulto", idoso: "Idoso" };

export const CORES_TEMA = { adocao: ["#f97316", "#16a34a", "#7c3aed", "#0ea5e9"], procura_se: ["#dc2626", "#ea580c", "#1d4ed8", "#111827"] };

export const LIMITE_NOME = 20;
export const LIMITE_FRASE = 120;
export const LIMITE_SINAIS = 80;
export const LIMITE_FOTO_BYTES = 5 * 1024 * 1024;
export const TIPOS_FOTO = ["image/jpeg", "image/png", "image/webp"];

export function dadosIniciais(tipo: TipoCard = "adocao"): DadosCard {
  return {
    tipo,
    nomeAnimal: "",
    especie: "cachorro",
    porte: "",
    sexo: "desconhecido",
    idade: "",
    saude: [],
    jeito: [],
    frase: "",
    sinais: "",
    fotoUrl: "",
    cidade: "",
    bairro: "",
    contatoPublico: "",
    vistoPorUltimoEm: "",
    localVistoPorUltimo: "",
    recompensa: "",
    corTema: CORES_TEMA[tipo][0],
    estilo: ESTILO_PADRAO[tipo],
  };
}

/** Troca o tipo mantendo foto, nome, espécie, sexo, porte, cidade, bairro e contato. */
export function trocarTipo(d: DadosCard, tipo: TipoCard): DadosCard {
  const { fotoUrl, nomeAnimal, especie, sexo, porte, cidade, bairro, contatoPublico } = d;
  return { ...dadosIniciais(tipo), fotoUrl, nomeAnimal, especie, sexo, porte, cidade, bairro, contatoPublico };
}

export function rotuloSexo(sexo: Sexo, especie: Especie): string {
  if (sexo === "desconhecido") return "";
  if (especie === "gato") return sexo === "macho" ? "Gato" : "Gata";
  return sexo === "macho" ? "Macho" : "Fêmea";
}

/** "Cachorro · Fêmea · Adulto · Porte médio", sem campos vazios; sem idade no procura-se. */
export function resumoAnimal(d: DadosCard): string {
  const sexo = rotuloSexo(d.sexo, d.especie);
  return [
    d.especie === "gato" && sexo ? "" : ROTULO_ESPECIE[d.especie],
    sexo,
    d.tipo === "adocao" && d.idade ? ROTULO_IDADE[d.idade] : "",
    d.porte ? `Porte ${ROTULO_PORTE[d.porte].toLowerCase()}` : "",
  ]
    .filter(Boolean)
    .join(" · ");
}

/** Corta com "…" acima do limite (proteção; o formulário já limita). */
export function cortar(texto: string, limite: number): string {
  return texto.length > limite ? texto.slice(0, limite - 1).trimEnd() + "…" : texto;
}

/** Retorna mensagens de erro por campo; objeto vazio = válido. */
export function validarCard(d: DadosCard): Partial<Record<keyof DadosCard, string>> {
  const erros: Partial<Record<keyof DadosCard, string>> = {};
  if (!d.fotoUrl) erros.fotoUrl = "Adicione uma foto do animal.";
  if (!d.nomeAnimal.trim()) erros.nomeAnimal = "Informe o nome do animal.";
  if (d.tipo === "procura_se") {
    if (!d.vistoPorUltimoEm) erros.vistoPorUltimoEm = "Informe quando foi visto pela última vez.";
    if (!d.localVistoPorUltimo.trim()) erros.localVistoPorUltimo = "Informe onde foi visto pela última vez.";
  }
  if (!d.cidade.trim()) erros.cidade = "Informe a cidade.";
  if (!d.contatoPublico.trim()) erros.contatoPublico = "Informe um contato para o card.";
  if (d.frase.length > LIMITE_FRASE) erros.frase = `Máximo de ${LIMITE_FRASE} caracteres.`;
  if (d.sinais.length > LIMITE_SINAIS) erros.sinais = `Máximo de ${LIMITE_SINAIS} caracteres.`;
  return erros;
}

export function validarFoto(arquivo: { type: string; size: number }): string | null {
  if (!TIPOS_FOTO.includes(arquivo.type)) return "Use uma foto JPG, PNG ou WebP.";
  if (arquivo.size > LIMITE_FOTO_BYTES) return "A foto deve ter no máximo 5 MB.";
  return null;
}

/** "2026-11-03" -> "03/11/2026" */
export function formatarData(iso: string): string {
  const [a, m, d] = iso.split("-");
  return a && m && d ? `${d}/${m}/${a}` : "";
}

export function nomeArquivo(d: DadosCard, formato: Formato): string {
  const base = (d.nomeAnimal || (d.tipo === "adocao" ? "adocao" : "procura-se"))
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `${d.tipo === "adocao" ? "adote" : "procura-se"}-${base || "card"}-${formato}.png`;
}
