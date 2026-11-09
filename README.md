# Heartbeasties

Projeto dividido em duas partes que conversam pela API:

```
heartbeasties/
├── front-end/        ← SUA parte (React + TypeScript + Vite)
├── back-end/         ← parte da Ana (Node + Express + Sequelize + MySQL) + rotas novas (veja abaixo)
├── logica/           ← regras de negócio da Ana (POO), usadas pelo back-end + serviços novos
└── docker-compose.yml
```

O front **não depende** das pastas `back-end` e `logica`: ele só chama a API por HTTP.
Dá para levar a pasta `front-end` sozinha para o seu repositório.

## Como rodar tudo (Docker)

Com o Docker Desktop ligado, na pasta onde está o `docker-compose.yml`:

```
docker compose up --build
```

| O quê | Endereço |
|---|---|
| Site (seu front) | http://localhost:8080 |
| API da Ana | http://localhost:3000/api |
| Banco (DBeaver) | `localhost`, porta `3307`, usuário `root`, senha `heartbeasties123` |

A página **Estatísticas** precisa de vendas. Com os containers ligados, em outro terminal:

```
docker compose exec back-end npm run popular
```

`docker compose down` desliga tudo e mantém o banco. `docker compose down -v` apaga o banco.

## Como rodar sem Docker (XAMPP)

1. Ligue o MySQL no XAMPP (usuário `root`, sem senha).
2. Back-end:
   ```
   cd back-end
   npm install
   copy .env.example .env      (no Linux/Mac: cp .env.example .env)
   npm run start
   npm run popular             (em outro terminal, uma vez só)
   ```
3. Front-end:
   ```
   cd front-end
   npm install
   npm run dev
   ```
   Abra http://localhost:5173

Se a API estiver em outro endereço, copie `front-end/.env.example` para `.env` e mude `VITE_URL_DA_API`.

## Como entrar no site

1. Abra http://localhost:8080 (Docker) ou http://localhost:5173 (sem Docker) e crie uma conta em **Cadastro**.
2. Entre em **Entrar** com o e-mail e a senha cadastrados.
3. Pronto: o menu mostra Painel, Pedidos, Produtos, Categorias e Clientes. Sem login, essas páginas mandam para o login.

## Rotas da API que o front usa

| Tela | Chamada | Precisa de login |
|---|---|---|
| Cadastro | `POST /api/usuarios` com `{ nome, email, cpf, senha }` | não |
| Login | `POST /api/login` com `{ email, senha }` → `{ token, usuario }` | não |
| Perfil | `PUT /api/usuarios/:id` com `{ nome, cpf, senha }` | sim (só o próprio) |
| Categorias, Produtos, Clientes, Pedidos | `GET/POST /api/<recurso>`, `GET/PUT/DELETE /api/<recurso>/:id` | sim |
| Listas | `GET /api/<recurso>?pagina=1&limite=10` → `{ itens, total, pagina, limite, totalDePaginas }` | sim |
| Painel de estatísticas | `GET /api/relatorios/vendas` | sim |

O token vai em `Authorization: Bearer <token>`. Erros da API chegam como `{ "erro": "mensagem", "campo": "email" }`; quando vem `campo`, a mensagem aparece embaixo do campo certo.

## O que foi acrescentado no back-end da Ana

O que já existia (cadastro, entidades, repositórios Sequelize, relatório) **não foi reescrito**. Foram criados serviços, controladores e rotas no mesmo estilo dela, porque o front precisa deles para a rubrica (login, edição de usuário e 4 CRUDs). **Combine com a Ana antes de juntar**, pois ela também pode ter feito essas partes.

Arquivos novos:

- `logica/src/servicos/`: `ServicoDeAutenticacao`, `ServicoDeRecurso` (CRUD genérico), `ServicoDeCategorias`, `ServicoDeProdutos`, `ServicoDeClientes`, `ServicoDePedidos`
- `logica/src/erros/`: `ErroNaoAutorizado` (401) e `ErroDeAcessoNegado` (403)
- `back-end/src/infra/EmissorDeTokenJwt.ts`, `back-end/src/middlewares/autenticar.ts`
- `back-end/src/controladores/`: `ControladorDeAutenticacao`, `ControladorDeRecurso`, `idDaRota`
- `logica/testes/autenticacao.test.ts` e `logica/testes/recursos.test.ts`

Arquivos alterados:

- `logica/src/servicos/ServicoUsuario.ts` (métodos `buscar` e `atualizar`) e os `index.ts` de erros, contratos e serviços
- `back-end/src/composicao.ts`, `rotas/index.ts`, `app.ts`, `config/ambiente.ts`
- `back-end/package.json` (`jsonwebtoken`), `back-end/.env.example` e `docker-compose.yml` (`JWT_SEGREDO`)
- `GET /api/relatorios/vendas` agora exige login

## Como o front está organizado (poucos arquivos)

```
front-end/src/
├── main.tsx                 rotas, contexto e avisos (toast)
├── index.css                todo o visual
├── utils.ts                 CPF, senha, formatação e validações (zod)
├── recursos.ts              configuração dos 4 CRUDs (colunas, campos e validações)
├── api/axios.ts             conexão com a API, envio do token e tratamento de erros
├── types/index.ts           tipos
├── contexto/AuthContext.tsx usuário logado para o app todo + rota protegida
├── componentes/             Header.tsx, Campo.tsx (input ou select)
└── pages/
    ├── CadastroPage.tsx, LoginPage.tsx, PerfilPage.tsx
    ├── ListaPage.tsx        lista paginada de qualquer CRUD
    ├── FormPage.tsx         cadastro/edição de qualquer CRUD
    ├── EstatisticasPage.tsx painel com gráficos e métricas
    └── NotFoundPage.tsx
```

Para criar um CRUD novo, basta acrescentar um item em `recursos.ts`: a lista, o formulário e as rotas já funcionam.

## O que o front cobre da rubrica

| Item | Onde |
|---|---|
| Autenticação: e-mail e senha, regex, token no localStorage, erro amigável, redireciona | `LoginPage.tsx`, `AuthContext.tsx`, `api/axios.ts` |
| Cadastro: obrigatórios, senha dupla, CPF, e-mail, redireciona ao login, erros da API | `CadastroPage.tsx`, `utils.ts` |
| Edição de usuário: contexto global, CPF, nível e confirmação da senha, e-mail bloqueado | `PerfilPage.tsx`, `AuthContext.tsx` |
| 4 CRUDs: paginação, validação, lista e formulário em telas separadas, relacionamentos | `ListaPage.tsx`, `FormPage.tsx`, `recursos.ts` |
| Componentização: genéricos reutilizáveis, páginas em pasta própria | `componentes/`, `pages/` (as páginas de lista e formulário servem os 4 recursos) |
| Análise descritiva: gráficos e métricas de negócio | `EstatisticasPage.tsx` |

Relacionamentos: produto → categoria e pedido → cliente + produto (escolhidos em listas).

## Testes (do back)

```
cd logica && npm install && npm test        (regras e serviços do back)
```
