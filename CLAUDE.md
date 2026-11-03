# Amigos da Adoção

**Amigos da Adoção** — SaaS que gera cards de adoção e de "procura-se" (animal perdido) prontos para compartilhar nas redes sociais.

## Stack

- Next.js (App Router) + TypeScript + Tailwind · Supabase (Postgres, Auth, Storage) em projeto próprio (`amigos-da-adocao`, ref `rizylkzosytemnfrzrht`), schema `amigos_adocao` · Deploy: Vercel (a confirmar)

## Comandos

- Dev: `npm run dev` · Testes: `npm test` (Vitest) · Lint: `npm run lint` · Tipos: `npx next typegen && npx tsc --noEmit`
- Next.js 16: ler `AGENTS.md` e a doc em `node_modules/next/dist/docs/` antes de escrever código Next
- Imagem do card gerada no navegador com `html-to-image` (MVP, sem servidor)
- MCPs do projeto em `.mcp.json` (supabase, vercel, context7); env em `.env.local` (modelo: `.env.example`)

---

## Regras de negócio

<!-- Mantidas pelo product-manager. Texto curto, uma regra por item. -->
- Dois tipos de card: **adoção** (animal disponível) e **procura-se** (animal perdido)
- O usuário preenche um formulário (foto, nome, espécie, porte, sexo, idade, características, cidade/bairro, contato)
  e recebe uma imagem pronta para redes sociais (post 1080x1080 e story 1080x1920)
- Procura-se tem campos próprios: data e local onde foi visto pela última vez, recompensa (opcional)
- Card pode ser marcado como **adotado** / **encontrado**: sai da listagem pública, fica no histórico do dono
- O contato no card é só o que o usuário escolher publicar; nunca expor o e-mail da conta automaticamente
- Banco: projeto Supabase próprio `amigos-da-adocao`; tabelas no schema `amigos_adocao` (não usar `public`)

---

## Regras de desenvolvimento

- Não instalar novas dependências sem perguntar
- Não criar abstrações desnecessárias — código simples e direto
- Toda mudança de schema vira um arquivo novo numerado em `db/migrations/`

---

## Agentes e orquestração

Este arquivo prevalece sobre qualquer outra instrução de equipe.
Lucas é o dono do produto e decide escopo, visão e tudo que for irreversível.

### Quando delegar (do mais barato ao mais caro)
1. **Sessão única** (padrão): bug, ajuste de tela, migração pequena, texto. Não delegar o que dá para fazer direto.
2. **Subagente na própria sessão**:
   - `Explore` (embutido) para busca ampla só leitura, quando só a conclusão importa
   - `product-manager` (`.claude/agents/`): dono do produto. Define problema, escopo e critérios de aceite antes de
     feature média ou grande, analisa decisões e mantém `docs/produto/` (decisões, roadmap, specs, métricas) e as
     Regras de negócio deste arquivo. Ao fim de uma entrega que muda o produto, chamar para registrar
   - `tech-lead` (`.claude/agents/`) para uma parte técnica isolada, em arquivos que a sessão principal não está editando
   - `qa-engineer` (Sonnet) para validar mudança de risco: permissões, migração, auth, dados pessoais
3. **Worker do Orca** (skill `orchestration`; ler a skill antes, sem inventar flags): só quando precisar de outro
   agente (ex.: Codex revisando o que o Claude fez), de worktree próprio para implementar em paralelo, ou de tarefa longa
   que não cabe na sessão. Para entregar sem esperar retorno, usar `orca-cli` (handoff)
- `code-review` em nível `low`/`medium` por padrão; `max`/`ultra` só a pedido de Lucas

### Economia
- No máximo **2 workers** ao mesmo tempo; 3 só com tarefas grandes e independentes. Nunca dois no mesmo arquivo
- Tarefa delegada é curta: objetivo, arquivos permitidos, critério de aceite e o que não fazer. Aponte arquivos
  e seções deste `CLAUDE.md` em vez de colar conteúdo (o worker já carrega este arquivo)
- Entrega do agente em poucas linhas: arquivos, verificações e resultado, riscos. Sem diffs nem logs inteiros
- Revisão cruzada (QA ou outro agente) só onde o risco justifica, não em toda tarefa
- Não declarar delegação que não aconteceu: se fez direto, diga que fez direto

### Banco de produção
- Schema sempre por arquivo em `db/migrations/`, conferindo advisors/checagens depois.
  `product-manager` só lê (`SELECT` agregado); `qa-engineer` não acessa
- Exige ok de Lucas: apagar ou sobrescrever dado sem volta que a tarefa não pediu com todas as letras

### Exige autorização explícita de Lucas
- Deploy/merge em `main`, push, mudança em painéis de infraestrutura (hospedagem, DNS, e-mail, banco)
- E-mail, mensagem ou publicação para terceiros; gasto ou serviço novo; dependência nova
- Expor, copiar ou girar segredos (`.env*`, chaves de API)
- **Dados pessoais (LGPD)**: nada de dados pessoais de usuários reais em mensagens entre agentes, memória, testes,
  prints ou relatórios. Consulta a esses dados, só agregada e com motivo
