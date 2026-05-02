# AV2 - Sistema Aerocode

Sistema de gestao de producao de aeronaves feito em React + TypeScript.

---

## Como rodar

Precisa do Node.js instalado.

```
npm install
npm run dev
```

Abre em http://localhost:5173

Roda no Windows e no Ubuntu.

---

## Primeiro acesso

Quando abrir pela primeira vez, vai aparecer a tela de configuracao inicial. Cria um usuario admin e depois faz login.

Se precisar resetar, limpa o localStorage do navegador.

---

## Permissoes

Tem 3 niveis:

- Administrador - acesso total
- Engenheiro - gerencia pecas, etapas e testes
- Operador - so visualiza

---

## O que da pra fazer

- Cadastrar aeronave (codigo gerado automatico)
- Adicionar pecas, etapas e testes em cada aeronave
- Gerenciar status das pecas e etapas
- Vincular funcionarios nas etapas
- Gerar relatorio de entrega (so admin)
- Cadastrar novos funcionarios (so admin)

### Regras das etapas

- Nao pode iniciar uma etapa se a anterior nao foi concluida
- Nao pode finalizar etapa sem funcionario vinculado

---

## Seguranca

- Senhas salvas com hash (SHA-256)
- IDs gerados automaticamente (UUID)
- Nao tem senha no codigo
- Rotas protegidas por permissao

---

## Estrutura

```
src/
  context/   -> AuthContext e AppContext (logica do sistema)
  pages/     -> todas as telas (13 paginas)
  types/     -> enums e interfaces
  utils/     -> hash de senha
  App.tsx    -> rotas
  App.css    -> estilos
```

---

## Melhorias em relacao a AV1

- IDs sao gerados automaticos, nao digitados
- Etapa nao finaliza sem funcionario
- CRUD completo (da pra editar e excluir tudo)