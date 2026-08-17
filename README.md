# Parceria AEA Contabilidade × Money Brokers

Página de convite/venda da parceria entre a **AEA Contabilidade Consultiva** e os
mentorados da **Money Brokers Brasil**. Site estático: HTML, CSS e um arquivo de
JavaScript sem dependências, sem build e sem framework.

## Antes de publicar

O link do WhatsApp está com um placeholder. Troque em `index.html`:

```
https://wa.me/55DDDNUMERO?text=...
              ^^^^^^^^^^
```

por o número real no formato internacional sem símbolos — por exemplo
`5511999999999`.

## Estrutura

```
wrangler.toml                configuração de deploy na Cloudflare
package.json                 scripts de dev e deploy
public/                      tudo que vai para o ar — e só isto
  index.html                 marcação da página inteira (uma única página, sem rotas)
  css/parceria.css           tokens de cor, tema claro/escuro e todos os componentes
  js/parceria.js             simulador, overlay de convite, animações de entrada
  assets/prisma.png          logo do selo, da barra do topo e do favicon
```

O site inteiro mora em `public/`. O que está acima dessa pasta (README,
configuração) fica de fora do que é servido.

## Rodando localmente

```sh
npm run dev          # wrangler, igual ao ambiente da Cloudflare
npm run dev:static   # qualquer servidor estático, sem wrangler
```

## Deploy na Cloudflare

O projeto é só de assets estáticos — não existe script de Worker, e por isso o
`wrangler.toml` não tem a chave `main`.

**Workers** (o padrão ao importar um repositório hoje). No painel:

| Campo             | Valor                |
| ----------------- | -------------------- |
| Root directory    | `/`                  |
| Build command     | *(vazio)*            |
| Deploy command    | `npx wrangler deploy` |

O `wrangler.toml` na raiz já aponta para `public/`, então não há nada a
configurar além disso. Para deployar da sua máquina: `npm run deploy`.

**Pages**, se preferir: build command vazio e **output directory `public`**.

> Sem o `wrangler.toml` o build falha — um projeto Workers não tem como
> adivinhar o que servir. Foi exatamente esse o motivo da primeira versão
> deste repositório não subir.

## Como a página se comporta

**Overlay de convite** — abre sozinho no carregamento e trava o scroll. Fecha
pelo botão "Abrir meu convite" (que rola até a primeira seção), pelo ×, clicando
no fundo ou com `Esc`.

**Simulador de comissão** — dois sliders (clientes indicados, honorário médio) e
três faixas de comissão (10%, 15%, 20%). O valor mensal é animado a cada troca de
faixa e o total de 12 meses é recalculado junto. Os limites ficam nos próprios
atributos `min`/`max`/`step` dos inputs em `index.html`.

**Barra do topo** — detecta, a cada scroll, se a seção sob ela é escura
(`data-nav="dark"` no `<section>`) e inverte as cores para manter o contraste.
Para adicionar uma seção navy nova, basta pôr esse atributo nela.

**Animações** — entrada dos blocos (`.reveal-up`) e contagem dos números da
seção de estatísticas (`.stat .num`, com o valor final em `data-target`) usam
`IntersectionObserver`. Tudo respeita `prefers-reduced-motion: reduce`.

## Temas

O tema segue o `prefers-color-scheme` do sistema. As cores de marca (navy, azul,
dourado) são fixas nos dois temas; só os tokens de superfície e texto trocam.

O CSS também responde a `data-theme="light"` / `data-theme="dark"` no elemento
raiz, então dá para plugar um seletor manual de tema depois sem mexer no CSS —
basta escrever o atributo no `<html>`.

## Origem

A página nasceu como um Artifact do Claude e foi convertida para código: o
runtime do Artifact foi removido, o CSS e o JS saíram do HTML para arquivos
próprios, e a imagem que estava embutida em base64 virou um arquivo em `assets/`.
