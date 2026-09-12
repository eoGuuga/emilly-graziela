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

Dois campos definem como o item é vendido:

- `minimo` é a quantidade mínima, 1 quando não tem regra. Hoje são três: 50 no
  Doces Gourmet Personalizados, 30 no Cake Donut e 25 no Doces Gourmet. O contador
  começa em 0, o primeiro toque pula direto pro mínimo e dali anda de 1 em 1.
  Descendo abaixo do mínimo volta pra 0, nunca para em quantidade inválida, e o
  envio trava se algo escapar.
- `unidade` nomeia o que o contador conta, quando não é unidade solta. Só a Torre
  de Donuts usa, com `unidade: 'torre'`, porque ali o contador conta torres e não
  donuts. Os 30 donuts por torre são fixos e não editáveis.

O Biscoito Decorado é `preco: null`, sob orçamento por natureza. Nunca vai ter
preço fixo e nunca entra na soma. Quem separa ele dos outros é o id.

Se algum item ficar sem preço por falta de dado, o card renderiza calado, sem
valor e sem contador. É rede de proteção, não estado esperado.

A ordem do array é a ordem da página. Doces Gourmet e Doces Gourmet Personalizados
ficam colados de propósito: os nomes são parecidos e o preço e o mínimo são
diferentes, então a comparação precisa ser lado a lado.

Renomear um produto mexe só no campo `nome`. Os `id` continuam os antigos
(`cento-variado`, `cento-brigadeiro-personalizado`, `torre-de-donuts`) porque nada
externo depende deles.

## Prazo

O ideal é 15 dias de antecedência, que é o prazo que ela usa pra organizar a agenda.
Não é regra rígida: tendo disponibilidade ela faz de um dia pro outro. Por isso a
página avisa em vez de bloquear. Data com menos de 15 dias mostra um recado perto do
campo convidando a consultar disponibilidade, e a mensagem do WhatsApp sai com uma
linha sinalizando e pedindo confirmação. Nenhum valor aparece em lugar nenhum, e a
palavra "taxa" não existe no site.

A conta de dias é feita em data local com as duas pontas fixadas ao meio-dia. Montar
em UTC ou na meia-noite faz virada de fuso empurrar o resultado um dia.

## Fotos

Uma por produto, em `img/`, nome sem acento e sem espaço, jpg ou webp, no
máximo 800px de largura. O `alt` é escrito à mão no `produtos.js` e descreve a
técnica, nunca o personagem.

12 dos 14 produtos têm foto. Kit Festa M e Kit Festa G ficam sem, de propósito:
a composição dos dois mudou e não existe foto que corresponda, então a lista
escrita é o que explica o produto. Sem foto, o card mostra um campo no pastel da
seção e guarda a proporção, então nada pula de lugar.

Os arquivos que ela mandou ficam em `originais/fotos/`, fora do Git. As versões
do site saem de lá redimensionadas para 800px, comprimidas em JPEG progressivo e
com o EXIF removido, que é onde vem parar GPS de foto de celular.

## Retirada

Não tem entrega. A cliente retira ou manda buscar por conta dela. A página avisa
antes de montar o pedido e a mensagem do WhatsApp repete.
