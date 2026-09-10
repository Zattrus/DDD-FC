# DDD-FC

Projeto desenvolvido em TypeScript com foco nos conceitos de Domain-Driven Design (DDD), incluindo os domínios de clientes, produtos e pedidos.

## Pré-requisitos

- Node.js instalado (versão LTS recomendada)
- npm, instalado junto com o Node.js

Confira as versões instaladas:

```bash
node --version
npm --version
```

## Instalação

Clone o repositório e acesse a pasta do projeto:

```bash
git clone <URL_DO_REPOSITORIO>
cd DDD-FC
```

Instale as dependências do projeto:

```bash
npm install
```

O comando instala as dependências de execução e desenvolvimento definidas no `package.json`, incluindo TypeScript, Jest, Sequelize e SQLite.

## Testes

Execute a validação completa do projeto:

```bash
npm test
```

Esse comando:

1. Verifica os tipos TypeScript sem gerar arquivos (`tsc --noEmit`);
2. Executa os testes automatizados com Jest.

Para executar somente a verificação de tipos:

```bash
npm run tsc -- --noEmit
```

Para executar o Jest diretamente:

```bash
npx jest
```

## Estrutura principal

- `src/domain`: regras de negócio e contratos dos domínios;
- `src/domain/@shared`: componentes compartilhados, como eventos e repositórios;
- `src/infrastructure`: implementações de infraestrutura, incluindo persistência com Sequelize e SQLite;
- Arquivos `*.spec.ts`: testes automatizados do projeto.

## Tecnologias

- TypeScript
- Jest
- Sequelize e Sequelize TypeScript
- SQLite
- SWC
