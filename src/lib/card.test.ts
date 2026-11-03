import { describe, expect, it } from "vitest";
import { cortar, dadosIniciais, resumoAnimal, trocarTipo, formatarData, nomeArquivo, rotuloSexo, validarCard, validarFoto } from "./card";

describe("validarCard", () => {
  const valido = { ...dadosIniciais(), fotoUrl: "data:x", nomeAnimal: "Bolinha", cidade: "Curitiba", contatoPublico: "(41) 99999-0000" };

  it("aceita card de adoção completo", () => {
    expect(validarCard(valido)).toEqual({});
  });

  it("exige foto, nome, cidade e contato", () => {
    expect(Object.keys(validarCard(dadosIniciais()))).toEqual(["fotoUrl", "nomeAnimal", "cidade", "contatoPublico"]);
  });

  it("procura-se exige data e local visto por último", () => {
    const erros = validarCard({ ...valido, tipo: "procura_se" });
    expect(erros.vistoPorUltimoEm).toBeDefined();
    expect(erros.localVistoPorUltimo).toBeDefined();
  });

  it("limita frase a 120 e sinais a 80", () => {
    expect(validarCard({ ...valido, frase: "a".repeat(121) }).frase).toBeDefined();
    expect(validarCard({ ...valido, sinais: "a".repeat(81) }).sinais).toBeDefined();
  });
});

describe("validarFoto", () => {
  it("recusa tipo e tamanho inválidos", () => {
    expect(validarFoto({ type: "image/gif", size: 10 })).not.toBeNull();
    expect(validarFoto({ type: "image/png", size: 6 * 1024 * 1024 })).not.toBeNull();
    expect(validarFoto({ type: "image/jpeg", size: 1000 })).toBeNull();
  });
});

describe("helpers", () => {
  it("formata data", () => expect(formatarData("2026-11-03")).toBe("03/11/2026"));
  it("rótulo de sexo por espécie", () => {
    expect(rotuloSexo("femea", "gato")).toBe("Gata");
    expect(rotuloSexo("macho", "cachorro")).toBe("Macho");
    expect(rotuloSexo("desconhecido", "gato")).toBe("");
  });
  it("gera nome de arquivo sem acentos", () => {
    expect(nomeArquivo({ ...dadosIniciais("procura_se"), nomeAnimal: "Pão de Mel" }, "story")).toBe(
      "procura-se-pao-de-mel-story.png",
    );
  });
});

describe("conversão", () => {
  it("resumo omite campos vazios e idade no procura-se", () => {
    expect(resumoAnimal(dadosIniciais())).toBe("Cachorro");
    const d = { ...dadosIniciais(), sexo: "femea" as const, idade: "adulto" as const, porte: "medio" as const };
    expect(resumoAnimal(d)).toBe("Cachorro · Fêmea · Adulto · Porte médio");
    expect(resumoAnimal({ ...d, tipo: "procura_se" })).toBe("Cachorro · Fêmea · Porte médio");
    expect(resumoAnimal({ ...d, especie: "gato" })).toBe("Gata · Adulto · Porte médio");
  });
  it("corta com reticências", () => {
    expect(cortar("abcdef", 4)).toBe("abc…");
    expect(cortar("abc", 4)).toBe("abc");
  });
  it("trocar tipo mantém dados comuns e aplica estilo padrão", () => {
    const d = { ...dadosIniciais(), nomeAnimal: "Bolinha", cidade: "X", contatoPublico: "@y", frase: "oi" };
    const n = trocarTipo(d, "procura_se");
    expect([n.nomeAnimal, n.cidade, n.contatoPublico, n.frase, n.estilo]).toEqual(["Bolinha", "X", "@y", "", "cartaz"]);
  });
});
