# Spec: cards que convertem (MVP do gerador)

Status: proposta (2026-11-03). Código atual: `src/lib/card.ts`, `src/components/Gerador.tsx`, `src/components/CardPreview.tsx`.

## Problema
O card hoje é uma ficha: mostra dados, mas não convence. Quem preenche está no celular, com pressa (protetor com vários
animais, ou dono desesperado). Quem vê o card no feed decide em 2 segundos se para, e só age se souber o que fazer.
O formulário atual tem 5 seções, selects nativos, descrição de 500 caracteres (não cabe no card) e o botão de baixar
fica no fim da página, longe do preview.

Resultado esperado: card preenchido em ~1 minuto no celular e que leve quem vê a **chamar o contato** (adoção) ou a
**compartilhar / avisar se viu** (procura-se). Hipótese, sem dado ainda (ver Métricas).

## Campos do formulário (ordem = ordem na tela)
Seleção por chips (um toque) no lugar de `<select>`. `*` = obrigatório.

### Adoção
1. Foto *
2. Nome * (30) — nome humaniza; "sem nome" não converte
3. Espécie * (Cachorro / Gato / Outro)
4. Sexo (Macho / Fêmea / Não sei)
5. Idade (chips: Filhote / Jovem / Adulto / Idoso; substitui o texto livre)
6. Porte (Pequeno / Médio / Grande)
7. Saúde (chips): Castrado, Vacinado, Vermifugado
8. Jeito (chips, até 3): Carinhoso, Brincalhão, Calmo, Dócil, Bom com crianças, Convive com outros animais
9. Frase sobre ele (opcional, **120** caracteres; ex.: "Adora colo e dorme de conchinha")
10. Cidade * e Bairro (opcional)
11. Contato que vai no card * (WhatsApp ou @)

Removidos da adoção: "Usa coleira" (não ajuda a adotar), descrição de 500.

### Procura-se
1. Foto *
2. Nome * ("atende por")
3. Espécie *, Sexo, Porte (chips)
4. Sinais para reconhecer (opcional, **80**; cor, coleira, mancha, mancando...) — substitui descrição e características
5. Visto por último: data * e local * (60)
6. Cidade * e Bairro
7. Contato * 
8. Recompensa (opcional, 30)

Removidos do procura-se: idade, saúde, jeito (não ajudam a reconhecer).

Fora do formulário principal: cor do tema e formato (post/story) vão para a etapa de prévia.

## Hierarquia do card

### Adoção (ordem de leitura)
1. **Foto** grande (mín. 55% da área no post)
2. **Chamada**: "ME ADOTA?" ou "Procuro um lar" + **nome**
3. Resumo em uma linha: espécie · sexo · idade · porte
4. **Gatilhos**: selos de saúde ("Castrado · Vacinado") em destaque; até 3 traços de jeito; a frase, entre aspas
5. **CTA** em faixa de cor: "Quer me adotar? Chame: <contato>"
6. Rodapé: cidade/bairro e marca discreta "amigos da adoção"

### Procura-se
1. Faixa **"PROCURA-SE"** (ou "DESAPARECIDO") no topo, cor forte
2. **Foto** + **nome**
3. **Onde e quando**: "Visto por último em <data>, <local> — <bairro>, <cidade>"
4. Sinais para reconhecer
5. **Recompensa** em selo, se preenchida
6. **CTA**: "Viu? Avise: <contato>" + "Compartilhe, ajude a voltar pra casa"

### Não aparece (nunca)
- E-mail da conta ou qualquer dado do usuário que ele não digitou no campo de contato
- Endereço completo (só cidade e bairro; local do procura-se é o que o usuário escreveu)
- Campo vazio: sem rótulo solto, "—" ou "undefined"; a linha some

## 3 estilos de post (1080x1080)
Valem para os dois tipos; o texto da chamada muda por tipo. Story herda o estilo com mais área de foto.

1. **Destaque** — foto em tela cheia, degradê escuro na base, texto branco sobreposto; CTA em faixa sólida da cor
   do tema. Moderno, para Instagram. Limites: nome 18, frase 80, até 3 selos, sem sinais longos (corta em 60).
2. **Polaroid** — fundo claro com textura leve, foto em moldura branca levemente inclinada, nome manuscrito embaixo,
   selos como etiquetas. Afetivo, ideal para adoção. Limites: nome 14, frase 120, até 4 selos.
3. **Cartaz** — layout de poste: faixa de título enorme no topo, foto central com borda, dados em blocos e contato
   grande em baixo. Máxima legibilidade, ideal para procura-se e WhatsApp. Limites: nome 20, sinais 80, local 60.

Padrão sugerido: Polaroid para adoção, Cartaz para procura-se. Texto acima do limite é cortado com "…" no card
(o formulário já limita; o corte é proteção). Contato nunca é cortado: fonte reduz até caber.

## Fluxo mobile
Tela única, uma coluna, largura de 360px pra cima.
1. **Tipo**: dois botões grandes no topo (Adoção / Procura-se)
2. **Foto**: área grande "Tirar ou escolher foto" (abre câmera ou galeria); mostra miniatura
3. **Dados**: campos acima, em ordem, chips com alvo de toque ≥ 44px; teclado certo (`tel` não, contato é texto livre)
4. **Prévia**: card renderizado na largura da tela; abaixo, seletor de estilo (3 miniaturas), cor e Post/Story
5. **Botão principal** fixo no rodapé da tela durante todo o fluxo: "Ver meu card" (rola até a prévia) e, na prévia,
   "Baixar card". Se o navegador suportar Web Share com arquivo, "Compartilhar" ao lado; senão só baixar.
Erros: ao tocar no botão com obrigatório faltando, rola até o primeiro erro e o destaca.
Desktop: mantém duas colunas (formulário + prévia fixa), mesmo conteúdo.

## Fora do escopo
Salvar card na conta, link público, listagem, marcar adotado/encontrado, IA para escrever a frase, mais de 3 estilos.

## Critérios de aceite
1. Em viewport 375x667, sem rolagem horizontal; botão principal sempre visível no rodapé.
2. Obrigatórios por tipo exatamente como nas listas acima; tentar baixar sem eles mostra erro no campo e rola até ele.
3. Espécie, sexo, idade, porte, saúde e jeito são chips; "jeito" aceita no máximo 3.
4. Frase limitada a 120 (adoção); sinais a 80 (procura-se); campos removidos não aparecem em nenhum tipo.
5. Trocar de tipo não apaga foto, nome, espécie, cidade e contato.
6. Os 3 estilos existem para post e story, nos dois tipos, e o PNG sai em 1080x1080 e 1080x1920.
7. Todo card de adoção mostra nome, foto e CTA com o contato; todo procura-se mostra "PROCURA-SE", data, local e CTA.
8. Selos de saúde aparecem só se marcados; recompensa só se preenchida; nenhum campo vazio deixa rótulo ou "—".
9. Com textos no limite máximo, nada sobrepõe nem sai do card em nenhum estilo (testar com nome e contato longos).
10. O card não contém nenhum dado além do digitado; e-mail da conta nunca aparece.
11. Fluxo completo (tipo, foto, obrigatórios, baixar) feito em até 1 minuto num celular, por alguém de fora do time
    (teste manual com 3 pessoas; registrar o tempo).

## Métricas (quando houver backend/analytics)
Cards baixados por tipo e por estilo; % de quem começa e baixa; tempo até o download. Sem dado hoje.
