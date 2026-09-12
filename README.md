# Vitrine Bila

Página da Emilly Graziela Candy Design, doces decorados sob encomenda pra festa.
A cliente abre no celular, escolhe os doces, põe a data da festa e o pedido chega
escrito no WhatsApp já somado.

HTML, CSS e JS na mão. Sem build, sem npm, sem dependência. Vai pro GitHub Pages
servindo da raiz.

## Arquivos

    index.html             a página
    css/style.css          estilo
    js/produtos.js         os 14 produtos e os preços
    js/app.js              catálogo, pedido e a mensagem do WhatsApp
    img/                   fotos dos produtos e a marca
    favicon.ico            ícone, tirado do monograma
    apple-touch-icon.png   ícone de 180px pra tela inicial do iPhone
    originais/             arquivos de origem, ficam fora do Git

## Rodar

Abre o index.html no navegador. Não precisa de servidor.

## Mexer nos produtos

Tudo em `js/produtos.js`. Preço fica só no campo `preco`, não tem valor em
outro arquivo.

Tabela válida: WhatsApp e áudios da Emilly, 11 e 12/09/2026. O arquivo
`originais/precos-2025-referencia.txt` é só histórico, não tirar preço de lá.

Três modos de venda, definidos por campo:

- **Por unidade.** É o padrão, `minimo: 1`. Contador comum.
- **Com mínimo.** `minimo: 50` no brigadeiro e `minimo: 30` no cake donut.
  O contador começa em 0, o primeiro toque pula direto pro mínimo e dali anda
  de 1 em 1. Descendo abaixo do mínimo volta pra 0, nunca para em quantidade
  inválida, e o envio fica bloqueado se algo passar.
- **Pacote fechado.** `fechado: true` no Cento Variado e na Torre de Donuts.
  Quantidade fixa, entra uma vez e não tem contador de unidade.

O Biscoito Decorado é `preco: null`, sob orçamento por natureza. Nunca vai ter
preço fixo e nunca entra na soma. Quem separa ele dos outros é o id.

Se algum item ficar sem preço por falta de dado, o card renderiza calado, sem
valor e sem contador. É rede de proteção, não estado esperado.

## Fotos

Uma por produto, em `img/`, nome sem acento e sem espaço, jpg ou webp, no
máximo 800px de largura. O `alt` é escrito à mão no `produtos.js` e descreve a
técnica, nunca o personagem. Sem foto, o card mostra um campo no pastel da
seção e guarda a proporção, então nada pula de lugar quando a foto entra.

## Retirada

Não tem entrega. A cliente retira ou manda buscar por conta dela. A página avisa
antes de montar o pedido e a mensagem do WhatsApp repete.
