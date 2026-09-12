# Vitrine Bila

Página da Emilly Graziela Candy Design, doces decorados sob encomenda para festa.
A cliente abre no celular, escolhe os doces, informa a data da festa e o pedido
chega escrito no WhatsApp já somado.

HTML, CSS e JS na mão. Sem build, sem npm, sem dependência externa. Vai para o
GitHub Pages servindo da raiz.

## Arquivos

    index.html             a página
    css/style.css          estilo
    js/produtos.js         os 14 produtos, os preços e a tabela de bolos
    js/app.js              catálogo, tela cheia, pedido e a mensagem do WhatsApp
    fonts/                 a fonte de título, um arquivo, com a licença ao lado
    img/card/              foto de cada produto a 720px, a que o card carrega
    img/galeria/           a mesma foto a 1200px, só carrega quem abre a tela cheia
    img/logotipo.webp      a marca
    favicon.ico            ícone, tirado do monograma
    apple-touch-icon.png   ícone de 180px para a tela inicial do iPhone

## Rodar

Abrir o `index.html` no navegador. Não precisa de servidor.

## Mexer nos produtos

Tudo em `js/produtos.js`. O preço fica só no campo `preco`, não há valor escrito
em nenhum outro arquivo. A ordem do array é a ordem da página.

Dois campos definem como o item é vendido:

- `minimo` é a quantidade mínima, `1` quando não há regra. O botão "Adicionar"
  vira o contador no primeiro toque, já no mínimo, e dali anda de 1 em 1.
  Descendo abaixo do mínimo volta para 0 e o botão reaparece. O envio trava se
  algo escapar.
- `unidade` nomeia o que o contador conta, quando não é unidade solta. A Torre de
  Cake Donuts usa `unidade: 'torre'`, porque ali o contador conta torres e não
  donuts.

`preco: null` marca o item sob orçamento: ele não entra na soma do total e vai para
a conversa como pedido de orçamento. Quem define isso é o `id`, em `SOB_ORCAMENTO`
no `app.js`, e não o `null` em si.

Renomear um produto mexe só no campo `nome`. Os `id` são identificadores internos e
não precisam acompanhar o nome.

## Fotos

Cada produto tem uma lista `fotos`. A primeira é a do card; as outras aparecem
arrastando a foto do card de lado (ou tocando nos pontos embaixo dela) e na tela
cheia, que abre ao tocar na foto. Cada foto tem `arquivo`, `alt` e um
`foco` opcional, que diz onde o recorte 4:5 se prende quando a foto é mais alta
que o quadro.

Cada arquivo existe em dois tamanhos, `img/card/` a 720px e `img/galeria/` a 1200px
(ou a largura do original, quando é menor). Nome sem acento e sem espaço, jpg,
salvo sem EXIF.

O peso é controlado por construção: o card cria um único `<img>`, o da primeira
foto, com `loading="lazy"` em todos menos o primeiro da página. As fotos seguintes
de cada produto não existem no HTML nem no DOM: o card tem um único `<img>`, a
troca muda o `src`, e as vizinhas só começam a baixar no primeiro toque na foto.
Na tela cheia só a atual e as duas vizinhas são carregadas. Um produto com vinte
fotos custa uma foto até alguém mexer nela.

## Bolos

Seção própria, depois dos kits. É tabela de preço por quilo e um caminho para o
WhatsApp, sem contador e sem soma: sabor, peso e tema são combinados na conversa.
Os dados ficam em `BOLOS`, no `js/produtos.js`.

## Prazo

O prazo ideal de encomenda é de 15 dias. A página avisa em vez de bloquear: data com
menos de 15 dias mostra um recado perto do campo convidando a consultar
disponibilidade, e a mensagem do WhatsApp sai com uma linha pedindo confirmação. O
campo de data só bloqueia data que já passou.

A conta de dias é feita em data local com as duas pontas fixadas ao meio-dia. Montar
em UTC ou na meia-noite faz virada de fuso empurrar o resultado um dia.

## Retirada

Não há entrega. A página informa isso antes de a pessoa montar o pedido e a mensagem
do WhatsApp repete.
