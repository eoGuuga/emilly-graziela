# Vitrine Bila

Página da Emilly Graziela Candy Design, doces decorados sob encomenda para festa.
A cliente abre no celular, escolhe os doces, informa a data da festa e o pedido
chega escrito no WhatsApp já somado.

HTML, CSS e JS na mão. Sem build, sem npm, sem dependência externa. Vai para o
GitHub Pages servindo da raiz.

## Arquivos

    index.html             a página
    css/style.css          estilo
    js/produtos.js         os 14 produtos e os preços
    js/app.js              catálogo, pedido e a mensagem do WhatsApp
    img/                   fotos dos produtos e a marca
    favicon.ico            ícone, tirado do monograma
    apple-touch-icon.png   ícone de 180px para a tela inicial do iPhone

## Rodar

Abrir o `index.html` no navegador. Não precisa de servidor.

## Mexer nos produtos

Tudo em `js/produtos.js`. O preço fica só no campo `preco`, não há valor escrito
em nenhum outro arquivo. A ordem do array é a ordem da página.

Dois campos definem como o item é vendido:

- `minimo` é a quantidade mínima, `1` quando não há regra. O contador começa em 0,
  o primeiro toque pula direto para o mínimo e dali anda de 1 em 1. Descendo abaixo
  do mínimo volta para 0, nunca para em quantidade inválida, e o envio trava se
  algo escapar.
- `unidade` nomeia o que o contador conta, quando não é unidade solta. A Torre de
  Cake Donuts usa `unidade: 'torre'`, porque ali o contador conta torres e não
  donuts.

`preco: null` marca o item sob orçamento: ele não entra na soma do total e vai para
a conversa como pedido de orçamento. Quem define isso é o `id`, em `SOB_ORCAMENTO`
no `app.js`, e não o `null` em si.

Se um item ficar sem preço, o card renderiza sem valor e sem contador, em silêncio.
É rede de proteção, não estado esperado.

Renomear um produto mexe só no campo `nome`. Os `id` são identificadores internos e
não precisam acompanhar o nome.

## Prazo

O prazo ideal de encomenda é de 15 dias. A página avisa em vez de bloquear: data com
menos de 15 dias mostra um recado perto do campo convidando a consultar
disponibilidade, e a mensagem do WhatsApp sai com uma linha pedindo confirmação. O
campo de data só bloqueia data que já passou.

A conta de dias é feita em data local com as duas pontas fixadas ao meio-dia. Montar
em UTC ou na meia-noite faz virada de fuso empurrar o resultado um dia.

## Fotos

Uma por produto, em `img/`, nome sem acento e sem espaço, jpg ou webp, no máximo
800px de largura, salvas sem EXIF. O `alt` é escrito à mão no `produtos.js` e
descreve a técnica do doce.

O card usa proporção 3:2, com exceção dos ids listados em `FOTO_ALTA` no `app.js`,
que usam 1:1. Produto sem foto mostra um campo no pastel da seção e guarda a
proporção, então nada pula de lugar.

## Retirada

Não há entrega. A página informa isso antes de a pessoa montar o pedido e a mensagem
do WhatsApp repete.
