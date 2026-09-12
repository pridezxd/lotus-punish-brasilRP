# Lotus Punish — Infrações + Medal

Sistema web de registro de punições para Brasil Roleplay, com histórico local e integração com clipes públicos do Medal.

## Estrutura

```text
.
├── index.html
├── vercel.json
├── api/
│   ├── medal.js
│   └── medal-download.js
├── .gitignore
└── README.md
```

## Publicar no GitHub

1. Crie um repositório novo no GitHub.
2. Extraia este ZIP.
3. Envie **todos os arquivos e pastas desta pasta** para a raiz do repositório.
4. Faça o commit.

> O GitHub armazena o código, mas as funções `/api/*` precisam de um ambiente como a Vercel para funcionar.

## Publicar o site

A forma mais simples é conectar o repositório à Vercel:

1. Entre na Vercel e faça login com o GitHub.
2. Importe o repositório `Lotus Punish`.
3. Não é necessário configurar framework ou comando de build.
4. Clique em **Deploy**.
5. A URL gerada será o endereço público do sistema.

O arquivo `vercel.json` já está incluído e configura as funções serverless.

## Integração com Medal

- Ao colar um link público do Medal, o front-end identifica o ID do clipe.
- `/api/medal` consulta os dados públicos do clipe.
- `/api/medal-download` faz o streaming do MP4 público quando o Medal disponibiliza o arquivo.
- O sistema não tenta acessar clipes privados, DRM, Premium ou contornar controles de acesso.
- O navegador pode bloquear um download automático iniciado após uma requisição. Nesse caso, use o botão **Baixar MP4 agora**.

## Dados das punições

O histórico da interface é salvo no `localStorage` do navegador. Isso significa que os registros não ficam automaticamente sincronizados entre computadores ou usuários.

Use a opção de exportação disponível no sistema para gerar um backup JSON.

## Desenvolvimento local

Não é necessário `npm install`.

Para testar a interface estática:

```bash
python -m http.server 8080
```

Porém, para testar as funções `/api/medal` e `/api/medal-download`, recomenda-se executar o projeto pela Vercel ou por um ambiente compatível com Vercel Serverless Functions.

## Importante

Este projeto depende de endpoints públicos do Medal, que podem mudar sem aviso. Se o Medal alterar sua API ou a forma de disponibilizar os vídeos, a integração poderá precisar de atualização.


## Atualização 2026-09-12
- Status: Aplicado / Aguardando.
- Tempo e punição preenchidos automaticamente pela infração.
- Hacker: banimento permanente.
- RDM Ilha: 7 dias + wipe da conta.
- O texto da punição não inclui campo de provas.
