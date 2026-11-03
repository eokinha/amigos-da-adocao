# Registro de decisões

Mais recente no topo. Formato: data, status (proposta | aceita | substituída), decisão, contexto, alternativas, consequências.

## 2026-11-03 · proposta · Card como conversor: menos campos, CTA e 3 estilos
- **Contexto**: revisão do MVP pedida por Lucas; card atual é ficha sem chamada para ação e o form é longo no celular.
- **Decisão**: campos enxutos por tipo, com chips; frase de 120 no lugar da descrição de 500; CTA fixo por tipo;
  3 estilos de post (Destaque, Polaroid, Cartaz); fluxo mobile com botão fixo no rodapé. Detalhes em `specs/cards-conversao.md`.
- **Alternativas**: manter o form e só trocar o visual (não resolve tempo de preenchimento); um estilo só (menos escolha).
- **Consequências**: muda `DadosCard` (idade vira categoria; novos campos saúde/jeito/sinais); sem migração, pois o card ainda não é salvo.

## 2026-11-03 · aceita · Banco em projeto Supabase próprio
- **Decisão**: projeto `amigos-da-adocao` (ref `rizylkzosytemnfrzrht`) em organização própria; tabelas no schema `amigos_adocao`, fotos no bucket `amigos-adocao`.
- **Contexto**: Lucas criou o projeto dedicado; isolamento total do Mercadinho (auth e dados separados).
- **Consequências**: o schema `amigos_adocao` precisa estar em "Exposed schemas" na API do Supabase.

## 2026-11-03 · substituída · Banco em schema próprio no Supabase do Mercadinho Universitário
- **Contexto**: evitar o custo de um projeto Supabase novo no início.
- **Decisão**: schema `amigos_adocao` + bucket `amigos-adocao`, isolados do Mercadinho.
- **Alternativas**: projeto Supabase dedicado (isolamento total, mais custo).
- **Consequências**: `auth.users` é compartilhado com o Mercadinho; migrar para projeto próprio se o produto crescer.

## 2026-11-03 · aceita · Card gerado no navegador (HTML → PNG)
- **Decisão**: gerar a imagem no cliente no MVP, sem custo de servidor.
- **Alternativas**: geração no servidor (Satori/`@vercel/og`), que permite preview em link, mas custa execução.
