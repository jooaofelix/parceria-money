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
index.html            marcação da página inteira (uma única página, sem rotas)
css/parceria.css      tokens de cor, tema claro/escuro e todos os componentes
js/parceria.js        simulador, overlay de convite, animações de entrada
assets/prisma.png     logo usado no selo do convite, na barra do topo e no favicon
```

## Rodando localmente

Qualquer servidor estático serve. Abrir o `index.html` direto pelo `file://`
também funciona, mas um servidor evita surpresas com caminhos relativos:

```sh
npx http-server -p 8080 .
# ou
python3 -m http.server 8080
```

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
