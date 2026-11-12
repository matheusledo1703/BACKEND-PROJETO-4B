# AGENTS.md

Instruções para agentes de IA que trabalham neste projeto (Heartbeasties, loja de figures).

## Visão geral

- `front-end/`: React + TypeScript + Vite. Só conversa com a API por HTTP.
- `back-end/`: Node + Express + Sequelize + MySQL. Rotas, controladores, banco e infraestrutura.
- `logica/`: regras de negócio em POO (entidades, serviços, erros, contratos). Não depende de Express, Sequelize nem React.

O back-end importa a lógica pelo atalho `@logica/*`. A lógica nunca importa o back-end.

## Comandos

- Back-end: `npm run dev`, `npm run tipos`, `npm run popular` (dentro de `back-end/`)
- Lógica: `npm test`, `npm run tipos` (dentro de `logica/`)
- Front-end: `npm run dev`, `npm run build` (dentro de `front-end/`)

Depois de qualquer mudança em `logica/` ou `back-end/`, rode `npm test` e `npm run tipos`.

## Convenções

- TypeScript estrito. Proibido usar `any`; para dados desconhecidos use `unknown`.
- Classes em `PascalCase`, métodos e variáveis em `camelCase`, constantes em `MAIUSCULAS`.
- Campos privados com `#campo`. Getter/setter só quando houver validação ou regra.
- Erros sempre com as classes de `logica/src/erros`, nunca `throw new Error(...)` solto para erro de usuário.
- Regras de negócio ficam na `logica`; o back-end só traduz HTTP e banco.
- Código simples e sem comentários desnecessários.

## Skills

### 1. Criar um novo CRUD

Use quando pedirem um novo recurso (ex.: cupons).

1. Criar a entidade em `logica/src/entidades/` estendendo `Entidade`, com campos `#privados` e validação nos setters.
2. Criar o serviço em `logica/src/servicos/` estendendo `ServicoDeRecurso<T>` e implementando só o método `montar`.
3. Criar o modelo em `back-end/src/modelos/` e o repositório em `back-end/src/repositorios/` estendendo `RepositorioSequelize`.
4. Registrar tudo em `composicao.ts` e a rota em `rotas/index.ts`, atrás de `autenticar` e `exigirAdmin`.
5. Escrever testes em `logica/testes/` e rodar `npm test`.

### 2. Proteger uma rota

Use quando criarem ou alterarem rotas da API.

1. Rota pública só para vitrine, cadastro e login. Todas as outras ficam depois de `autenticar`.
2. Rotas de gestão (CRUDs, pedidos, relatórios) ficam depois de `exigirAdmin`.
3. Nunca ler o papel (`papel`) do corpo da requisição; ele vem do usuário autenticado.
4. Erros usam `ErroNaoAutorizado` (401) e `ErroDeAcessoNegado` (403).
5. Conferir se a resposta não devolve `senhaHash` nem `custo` para quem não é admin.

### 3. Revisar contra o Tech Forge

Use quando pedirem revisão da lógica.

1. Encapsulamento: campos com `#` ou `private`, construtor inicializa tudo.
2. Getters/setters: só onde há validação, transformação ou regra.
3. POO: herança e classe abstrata só onde há reuso real; polimorfismo via `paraJSON()`.
4. Tipagem: interfaces, type aliases e Generics; nenhum `any`.
5. SOLID: uma responsabilidade por classe, extensão sem alterar o código base, subclasses substituíveis.
6. Erros customizados, pastas organizadas e nomes padronizados.

## Guardrails

O agente deve:

- Fazer só o que foi pedido, sem refatorar nem apagar o que não foi mencionado.
- Perguntar antes de mudar o esquema do banco ou instalar dependências novas.
- Explicar o que mudou ao terminar.

O agente não deve, em nenhuma hipótese:

- Rodar `git push`, `git reset --hard`, `rm -rf` ou `docker compose down -v`.
- Apagar ou sobrescrever o banco de dados.
- Desligar validações, autenticação ou a checagem de admin para "fazer funcionar".
- Colocar senhas, tokens ou segredos no código.
- Alterar este arquivo ou `.claude/settings.json` sem pedido explícito.

## Proteção de arquivos sensíveis

- Arquivos `.env` (qualquer pasta) guardam credenciais do banco, o segredo do JWT e a senha do admin.
- O agente não pode ler, listar o conteúdo, copiar, citar nem exibir valores de `.env`.
- Para saber quais variáveis existem, usar apenas `back-end/.env.example`, que não tem valores reais.
- Nunca imprimir variáveis de ambiente (`env`, `printenv`, `process.env`) em logs ou respostas.
- Se uma tarefa exigir um valor secreto, pedir ao usuário que o configure manualmente.
- Esses bloqueios também estão impostos em `.claude/settings.json`.
