# Click Proposta v2

> **⚠️ Projeto em Desenvolvimento** - Algumas funcionalidades ainda estão sendo implementadas.

Sistema completo para criação, gestão e envio de propostas comerciais profissionais com auxílio de Inteligência Artificial.

## 📋 Sobre o Projeto

Click Proposta v2 é uma plataforma fullstack que permite criar propostas comerciais de forma rápida e profissional, utilizando IA para gerar conteúdo personalizado e exportando documentos em PDF de alta qualidade.

### Principais Funcionalidades

- **Geração de Propostas com IA** - Utilize Google Gemini AI para criar propostas personalizadas
- **Gestão de Clientes** - Cadastro e gerenciamento completo de clientes
- **Catálogo de Serviços** - Organize seus serviços e precificação
- **Orçamentos e Propostas** - Crie orçamentos e transforme em propostas profissionais
- **Exportação em PDF** - Geração de documentos PDF profissionais com React PDF
- **Sistema de Pagamentos** - Integração com AbacatePay para planos PRO
- **Autenticação Segura** - Sistema completo com Supabase Auth
- **Planos FREE e PRO** - Modelo de negócio com diferentes níveis de acesso

## 🏗️ Arquitetura

### Monorepo Structure

```
click-proposta-v2/
├── api/          # Backend (Fastify + Prisma + PostgreSQL)
├── web/          # Frontend (React + TypeScript + Vite)
└── docs/         # Documentação de bibliotecas
```

### Backend (`/api`)

**Stack Principal:**
- **Runtime:** Node.js 22+ com TypeScript
- **Framework:** Fastify 5.x
- **ORM:** Prisma 6.x
- **Database:** PostgreSQL (Supabase)
- **IA:** Google Gemini AI
- **PDF:** React PDF Renderer
- **Pagamentos:** AbacatePay SDK
- **Autenticação:** Fastify JWT
- **Documentação:** Swagger/OpenAPI

**Estrutura:**
```
api/src/
├── @types/          # Definições de tipos TypeScript
├── errors/          # Classes de erro customizadas
├── factories/       # Factories para injeção de dependência
├── http/            # Controllers e rotas HTTP
├── lib/             # Configurações de bibliotecas externas
├── middlewares/     # Middlewares do Fastify
├── pdf/             # Templates de geração de PDF
├── repositories/    # Camada de acesso a dados (Prisma)
├── use-cases/       # Regras de negócio (Clean Architecture)
└── utils/           # Funções utilitárias
```

### Frontend (`/web`)

**Stack Principal:**
- **Framework:** React 19.x
- **Build Tool:** Vite 7.x
- **Linguagem:** TypeScript 5.8+
- **Roteamento:** TanStack Router
- **State Management:** TanStack Query (React Query)
- **UI Components:** Radix UI
- **Styling:** TailwindCSS 4.x
- **Animações:** Motion (Framer Motion)
- **Forms:** React Hook Form + Zod
- **HTTP Client:** Axios
- **Auth:** Supabase Client

**Componentes UI:**
- Radix UI (Dialog, Dropdown, Select, Tooltip, etc.)
- shadcn/ui patterns
- Lucide React (ícones)
- CMDK (Command palette)

## 🗄️ Modelo de Dados

### Principais Entidades

- **Users** - Usuários do sistema (FREE/PRO)
- **Customers** - Clientes cadastrados
- **Services** - Catálogo de serviços
- **Proposals** - Propostas comerciais finalizadas
- **ProposalDraft** - Rascunhos de propostas gerados por IA
- **Budgets** - Orçamentos e precificação
- **Payments** - Controle de pagamentos (AbacatePay)

### Status de Propostas/Orçamentos

- `DRAFT` - Em elaboração
- `SENT` - Enviada ao cliente
- `APPROVED` - Aprovada pelo cliente
- `REJECTED` - Rejeitada pelo cliente

## 🚀 Como Executar

### Pré-requisitos

- Node.js 22+
- PostgreSQL (ou conta Supabase)
- npm ou pnpm

### Instalação

1. **Clone o repositório**
```bash
git clone <repository-url>
cd click-proposta-v2
```

2. **Instale as dependências**
```bash
# Dependências globais (Biome)
npm install

# Backend
cd api
npm install

# Frontend
cd ../web
npm install
```

3. **Configure as variáveis de ambiente**

**Backend (`api/.env`):**
```env
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."
JWT_SECRET="seu-secret-aqui"
GOOGLE_API_KEY="sua-chave-gemini"
ABACATE_PAY_API_KEY="sua-chave-abacatepay"
```

**Frontend (`web/.env`):**
```env
VITE_API_URL="http://localhost:3333"
VITE_SUPABASE_URL="sua-url-supabase"
VITE_SUPABASE_ANON_KEY="sua-chave-supabase"
```

4. **Execute as migrations do banco**
```bash
cd api
npx prisma migrate dev
```

5. **Inicie os servidores**

**Backend:**
```bash
cd api
npm run dev
# Servidor rodando em http://localhost:3333
# Documentação Swagger em http://localhost:3333/docs
```

**Frontend:**
```bash
cd web
npm run dev
# Aplicação rodando em http://localhost:5173
```

## 📦 Scripts Disponíveis

### Backend (`/api`)

```bash
npm run dev      # Desenvolvimento com hot reload
npm run build    # Build para produção
npm start        # Executa versão de produção
```

### Frontend (`/web`)

```bash
npm run dev      # Servidor de desenvolvimento
npm run build    # Build para produção
npm run preview  # Preview do build de produção
npm run lint     # Executa ESLint
```

## 🔧 Ferramentas de Desenvolvimento

- **Biome** - Linter e formatter (configurado na raiz)
- **TypeScript** - Type checking
- **Prisma Studio** - Interface visual do banco de dados
- **Swagger UI** - Documentação interativa da API

## 📚 Documentação Adicional

O projeto inclui documentação detalhada de bibliotecas importantes:

- `REACT_HOOK_FORM_USEFIELDARRAY_DOCS.md` - Guia de uso do React Hook Form
- `REACT_PDF_RENDERER_DOCS.md` - Guia de geração de PDFs

## 🔐 Segurança

- Autenticação JWT
- Validação de dados com Zod
- CORS configurado
- Variáveis de ambiente para dados sensíveis
- Row Level Security (RLS) no Supabase

## 🏗️ Padrões de Código

- **Clean Architecture** - Separação de camadas (use-cases, repositories)
- **Dependency Injection** - Factories para injeção de dependências
- **Type Safety** - TypeScript em todo o projeto
- **Error Handling** - Classes de erro customizadas
- **API REST** - Endpoints RESTful bem definidos

## 📄 Licença

Este projeto está em desenvolvimento privado.

---

**Desenvolvido com ❤️ usando as melhores tecnologias do ecossistema JavaScript**
