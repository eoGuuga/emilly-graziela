# Vitrine Bila

Página da Emilly Graziela Candy Design, doces decorados sob encomenda pra festa.
A cliente abre no celular, escolhe os doces, põe a data da festa e o pedido chega
escrito no WhatsApp já somado.

HTML, CSS e JS na mão. Sem build, sem npm, sem dependência. Vai pro GitHub Pages
servindo da raiz.

## Arquivos

    index.html       a página
    css/style.css    estilo
    js/produtos.js   os 11 produtos
    js/app.js        catálogo, pedido e a mensagem do WhatsApp
    img/             imagens do site
    favicon.ico      ícone, tirado do monograma da marca
    originais/       arquivos de origem, ficam fora do Git

## Rodar

Abre o index.html no navegador. Não precisa de servidor.

## Preço

Mexe só no campo `preco` do `js/produtos.js`. Não tem valor escrito em outro lugar.

Hoje está tudo com `preco: null`. A Emilly confirmou que a tabela de janeiro de 2025
está velha e pediu pra tirar até mandar a nova, então os cards saem sem valor e sem
contador de quantidade. A soma, o total e o desconto de 5% do Pix continuam
funcionando, só estão sem dado pra calcular. **Não publicar sem preço.**

No Biscoito Decorado o `null` é permanente. Esse item é sob orçamento por natureza,
nunca vai ter preço fixo e nunca entra na soma. Quem separa ele dos outros é o id,
não o `null`.

## Retirada

Não tem entrega. A cliente retira ou manda buscar por conta dela. A página avisa isso
antes de montar o pedido e a mensagem do WhatsApp repete.
