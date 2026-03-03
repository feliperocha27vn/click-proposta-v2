# Tarefas: Click Proposta Bot

Este documento lista as tarefas necessárias para a construção do bot de WhatsApp.

## Fase 1: Preparação do Backend (click-proposta-v2)
- [x] 1. Criar middleware de autenticação `verifyServiceToken` para proteger rotas exclusivas do bot.
- [x] 2. Criar rota `GET /bot/verify-phone` no backend para buscar usuário pelo número de telefone (usando o `users-repository`).
- [x] 3. Atualizar as rotas existentes (civil/produtos) de geração de PDF (`/pdf/generate` e `/pdf/generate-product`) para aceitarem tanto o JWT quanto o `ServiceToken`.

## Fase 2: Construção do Bot (click-proposta-bot)
- [x] 4. Inicializar projeto Node.js (Fastify, TypeScript, Axios, Redis).
- [x] 5. Criar a máquina de estados (State Machine) usando Redis para gerenciar as sessões por número de telefone.
- [x] 6. Integrar webhook da Evolution API (`POST /webhook`) para receber e interpretar mensagens recebidas no WhatsApp.
- [x] 7. Implementar a integração com o backend (buscar usuário no passo inicial via `verify-phone`).
- [x] 8. Implementar a extração de dados usando Google Gemini (Structured Outputs) para formatar os itens do orçamento a partir da mensagem em texto livre do usuário.
- [ ] 9. Construir o fluxo de confirmação do orçamento com o usuário no chat.
- [x] 10. Implementar chamada final às rotas de conversão de PDF do backend principal e o respectivo envio do documento gerado (buffer) pelo WhatsApp da Evolution API.
