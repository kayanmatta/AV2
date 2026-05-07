# AV2 — AEROCODE: Sistema de Gestão de Produção de Aeronaves

AV2 — Professor Gerson Penha

Sistema desenvolvido em React + TypeScript + Vite para gestão visual da produção de aeronaves, migrando da interface CLI legada para uma GUI web moderna.

---

## Como rodar

Precisa do Node.js 18+ instalado.

```bash
npm install
npm run dev
```

---

## Primeiro acesso

1. Na primeira execução, a tela de **Configuração Inicial** aparece automaticamente
2. Cadastre o administrador (nome, usuário, senha)
3. Faça login com as credenciais criadas
4. O sistema redireciona para o Dashboard

> Para resetar os dados, limpe o `localStorage` e `sessionStorage` do navegador.

---

## Níveis de Permissão

| Nível | Acesso |
|---|---|
| **ADMINISTRADOR** | Acesso total: cadastra/edita/exclui aeronaves, gerencia funcionários, gera relatórios |
| **ENGENHEIRO** | Gerencia produção: adiciona peças, etapas, testes, vincula funcionários às etapas |
| **OPERADOR** | Visualização: dashboard, lista de aeronaves, detalhes (não modifica) |

---

## Funcionalidades

- ✅ Configuração inicial do primeiro administrador
- ✅ Login com senha hash SHA-256
- ✅ Dashboard com cards de resumo (aeronaves, etapas em andamento, concluídas, testes)
- ✅ CRUD completo de aeronaves (código gerado automaticamente: EMB + 4 dígitos)
- ✅ Adicionar peças com tipo, fornecedor e status
- ✅ Adicionar etapas com ordem sequencial e prazo
- ✅ Executar testes com tipo e resultado (aprovado/reprovado)
- ✅ Gerenciar status de peças (dropdown inline)
- ✅ Iniciar e finalizar etapas
- ✅ Vincular funcionários às etapas
- ✅ Gerar relatório de entrega e baixar como .txt
- ✅ Cadastrar novos funcionários (admin)
- ✅ Sessão persistente (F5 não derruba o login)
- ✅ Rotas protegidas por permissão
- ✅ Design responsivo (desktop e mobile)

### Regras de negócio

- Não pode iniciar uma etapa se a anterior não foi concluída
- Não pode finalizar etapa sem pelo menos um funcionário vinculado
- Botões de ação só aparecem para usuários com permissão adequada

---

## Segurança

- Senhas com hash **SHA-256** (Web Crypto API) — nunca em texto plano
- Sessão em `sessionStorage` **sem o hash da senha**
- Rotas protegidas com `RotaProtegida` (verifica login + permissão)
- Hierarquia de permissões: ADMIN(3) > ENGENHEIRO(2) > OPERADOR(1)
- IDs gerados automaticamente (UUID v4)

---

## Estrutura

```
src/
├── context/
│   ├── AuthContext.tsx    → Autenticação, sessão, permissões
│   └── AppContext.tsx     → CRUD de aeronaves, peças, etapas, testes
├── pages/
│   ├── Login.tsx          → Tela de login
│   ├── ConfiguracaoInicial.tsx → Primeiro admin
│   ├── Dashboard.tsx      → Painel principal com KPIs
│   ├── ListaAeronaves.tsx → Tabela de aeronaves
│   ├── DetalhesAeronave.tsx → Detalhes + peças + etapas + testes
│   ├── FormAeronave.tsx   → Nova / Editar aeronave
│   ├── GerenciarEtapas.tsx → Status e controle de produção
│   ├── FormPeca.tsx       → Adicionar peça
│   ├── FormEtapa.tsx      → Adicionar etapa
│   ├── FormTeste.tsx      → Executar teste
│   ├── AssociarFuncionarios.tsx → Vincular funcionários
│   ├── ListaFuncionarios.tsx → Lista + cadastro de funcionários
│   └── Relatorio.tsx      → Gerar / baixar relatório .txt
├── types/index.ts         → Enums e interfaces TypeScript
├── utils/auth.ts          → Hash SHA-256 e verificação de senha
├── App.tsx                → Rotas SPA (react-router-dom)
└── App.css                → Estilos com design responsivo
```

---

## Tecnologias

| Tecnologia | Finalidade |
|---|---|
| React  | Biblioteca SPA |
| TypeScript  | Tipagem estática |
| Vite | Build tool / dev server |
| react-router-dom  | Roteamento |
| uuid | IDs únicos |
| Web Crypto API | Hash SHA-256 |
| localStorage | Persistência de dados |
| sessionStorage | Persistência de sessão |

---

## Melhorias em relação à AV1

- IDs gerados automaticamente (UUID), não digitados pelo usuário
- Etapa não finaliza sem funcionário vinculado
- CRUD completo (editar e excluir tudo)
- Interface gráfica (GUI) em vez de CLI
- Três níveis de permissão com acesso diferenciado
- Sessão persistente (F5 não derruba)
- Design responsivo para mobile
- Wireframes documentados

---

**Aluno: Kayan dos Santos da Matta | AV2 — 2026**