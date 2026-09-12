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
  Brigadeiro Personalizado, 30 no Cake Donut e 25 no Cento Variado. O contador
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

Os nomes "Cento Variado" e "Cento de Brigadeiro Personalizado" podem mudar, já que
nenhum dos dois exige 100 unidades. Trocar só o campo `nome`, nada mais depende dele.

## Prazo

15 dias de antecedência para doces personalizados. Prazo menor ela aceita, então a
página avisa em vez de bloquear: data com menos de 15 dias mostra um recado perto do
campo, e a mensagem do WhatsApp sai com uma linha sinalizando, pra ela ver antes de
responder. Nenhum valor de taxa de urgência aparece em lugar nenhum, ela não passou
número.

A conta de dias é feita em data local com as duas pontas fixadas ao meio-dia. Montar
em UTC ou na meia-noite faz virada de fuso empurrar o resultado um dia.

## Fotos

Uma por produto, em `img/`, nome sem acento e sem espaço, jpg ou webp, no
máximo 800px de largura. O `alt` é escrito à mão no `produtos.js` e descreve a
técnica, nunca o personagem. Sem foto, o card mostra um campo no pastel da
seção e guarda a proporção, então nada pula de lugar quando a foto entra.

## Retirada

Não tem entrega. A cliente retira ou manda buscar por conta dela. A página avisa
antes de montar o pedido e a mensagem do WhatsApp repete.
