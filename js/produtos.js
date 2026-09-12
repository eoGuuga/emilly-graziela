// Tabela válida: WhatsApp e áudios da Emilly, 11 e 12/09/2026.
// O originais/precos-2025-referencia.txt é só histórico, não tirar preço de lá.
// Pra mexer em preço é só o campo preco aqui, não tem valor em outro arquivo.
//
// minimo      quantidade mínima, 1 quando o item não tem regra
// unidade     o que o contador conta, quando não é unidade solta. a Torre conta
//             torres e não donuts, por isso unidade: 'torre'. vazio é o normal
// preco       null só no biscoito, que é sob orçamento por natureza. se outro
//             item ficar null, o card sai sem preço e sem contador, em silêncio
// alt         escrito à mão, descreve a técnica e nunca o personagem
// observacao  recado meu, não aparece na página
//
// A ordem daqui é a ordem da página. Doces Gourmet e Doces Gourmet Personalizados
// ficam colados de propósito: nome parecido, preço e mínimo diferentes, então a
// comparação precisa ser lado a lado.
//
// Atenção: as descrições do Pão de Mel de Mesa, 2D, 3D, Paleta e Pirulito ainda
// são as do cardápio de 2025. Ela já revisou a Trufa e veio com correção, então
// essas cinco provavelmente também mudam.

const PRODUTOS = [
  {
    id: 'pao-de-mel-mesa',
    nome: 'Pão de Mel de Mesa',
    descricao: 'Mini, redondo, recheado, pasta americana 2D.',
    preco: 12.00,
    imagem: 'pao-de-mel-mesa.jpg',
    alt: 'mini pães de mel redondos, com carinha de ursinho em pasta americana',
    categoria: 'avulso',
    minimo: 1,
    unidade: '',
    observacao: ''
  },
  {
    id: 'pao-de-mel-2d',
    nome: 'Pão de Mel 2D',
    descricao: 'Quadrado, recheado com doce de leite ou brigadeiro, pasta americana 2D, canudo de papel e laço de fita.',
    preco: 25.00,
    imagem: 'pao-de-mel-2d.jpg',
    alt: 'pães de mel quadrados decorados em pasta americana, com canudo de papel e laço de fita',
    categoria: 'avulso',
    minimo: 1,
    unidade: '',
    observacao: ''
  },
  {
    id: 'pao-de-mel-3d',
    nome: 'Pão de Mel 3D',
    descricao: 'De doce de leite, formato quadrado, suporte decorado, elementos em pasta americana 2D e 3D.',
    preco: 38.00,
    imagem: 'pao-de-mel-3d.jpg',
    alt: 'pão de mel 3D em formato de casinha, modelado em pasta americana',
    categoria: 'avulso',
    minimo: 1,
    unidade: '',
    observacao: ''
  },
  {
    id: 'paleta-pao-de-mel',
    nome: 'Paleta de Pão de Mel',
    descricao: 'Pão de mel de doce de leite ou brigadeiro, formato de sorvete, decoração 2D, laço de fita.',
    preco: 32.00,
    imagem: 'paleta-de-pao-de-mel.jpg',
    alt: 'paletas de pão de mel cobertas com chocolate, decoradas em 2D com laço de fita',
    categoria: 'avulso',
    minimo: 1,
    unidade: '',
    observacao: ''
  },
  {
    id: 'pirulito-personalizado',
    nome: 'Pirulito Personalizado',
    descricao: 'Chocolate ao leite, pasta americana 2D, canudo de papel e laço de fita.',
    preco: 22.00,
    imagem: 'pirulito-personalizado.jpg',
    alt: 'pirulitos de chocolate redondos, decorados em 2D com canudo e laço de fita',
    categoria: 'avulso',
    minimo: 1,
    unidade: '',
    observacao: 'Ela renomeou, antes era só "Pirulito".'
  },
  {
    id: 'trufa',
    nome: 'Trufa',
    descricao: 'Mini trufa de ganache, com decoração em 2D. Sabores: brigadeiro, ninho, ninho com creme de avelã, prestígio. Os sabores podem variar de acordo com a disponibilidade dos recheios no momento da produção. Caso o cliente prefira, é possível especificar um único sabor para toda a quantidade encomendada, mediante disponibilidade dos ingredientes.',
    preco: 8.00,
    imagem: 'trufa.jpg',
    alt: 'mini trufas de ganache decoradas com flor em pasta americana',
    categoria: 'avulso',
    minimo: 1,
    unidade: '',
    observacao: 'A forma de pétalas transparente saiu da descrição em 12/09/2026, nem sempre ela acha e não quer prometer. Os dois trechos sobre variação de sabor e sabor único são dela, transcritos literal, e valem só aqui.'
  },
  {
    id: 'cento-variado',
    nome: 'Doces Gourmet',
    descricao: 'Todos podem ser finalizados com confeitos belgas, raspas de chocolate ou outros acabamentos especiais. Alguns sabores também recebem creme de avelã ou doce de leite. Sabores a consultar.',
    preco: 3.00,
    imagem: 'doces-gourmet.jpg',
    alt: 'docinhos gourmet variados em forminhas',
    categoria: 'avulso',
    minimo: 25,
    unidade: '',
    observacao: 'Renomeado em 12/09/2026, era "Cento Variado" e antes disso "Cento de Doces Gourmet". R$ 3,00 x 100 fecha nos R$ 300,00 do cento. Descrição transcrita literal dela, e o "sabores a consultar" mora dentro dela por decisão dela. O id segue cento-variado, nada externo depende dele.'
  },
  {
    id: 'cento-brigadeiro-personalizado',
    nome: 'Doces Gourmet Personalizados',
    descricao: 'Doces produzidos com chocolates de alta qualidade e ingredientes selecionados, cuidadosamente preparados para combinar com a identidade de cada evento. Podem ser finalizados com confeitos belgas, formatos diferenciados e cores variadas, além de receber diferentes tipos de acabamento, como carimbo personalizado, glitter, papel arroz e detalhes em pasta americana.',
    preco: 3.80,
    imagem: 'doces-gourmet-personalizados.jpg',
    alt: 'docinhos com carinha de bichinho modelada em pasta americana',
    categoria: 'avulso',
    minimo: 50,
    unidade: '',
    observacao: 'Renomeado em 12/09/2026, era "Cento de Brigadeiro Personalizado". Descrição transcrita literal dela. O R$ 3,50 que tinha aparecido era erro dela numa mensagem, ela mesma corrigiu: é R$ 3,80. O id segue cento-brigadeiro-personalizado, nada externo depende dele.'
  },
  {
    id: 'cake-donut',
    nome: 'Cake Donut',
    descricao: 'Um delicioso bolo macio e fofinho, assado no formato de donuts e finalizado com uma cobertura de chocolate. Sabores da massa: baunilha ou chocolate. A decoração pode ser personalizada de acordo com o tema e o gosto do cliente, podendo incluir pasta americana, confeitos, pós decorativos, brilho e outros detalhes.',
    preco: 4.00,
    imagem: 'cake-donut.jpg',
    alt: 'mini donuts cobertos com chocolate colorido e confeitos',
    categoria: 'avulso',
    minimo: 30,
    unidade: '',
    observacao: 'Descrição transcrita literal do WhatsApp dela, 12/09/2026. Preço e mínimo reconfirmados na mesma conversa. Não confundir com o antigo Donuts no Palito, que saiu do catálogo.'
  },
  {
    id: 'torre-de-donuts',
    nome: 'Torre de Cake Donuts',
    descricao: 'Torre com 30 Cake Donuts, montada com aproximadamente 24 cm de altura. Inclui topo personalizado e decoração em alguns dos donuts, seguindo o tema escolhido pelo cliente. O pratinho vai junto e fica com você, não precisa devolver.',
    preco: 150.00,
    imagem: 'torre-de-cake-donuts.jpg',
    alt: 'torre de donuts decorada com laços de fita',
    categoria: 'avulso',
    minimo: 1,
    unidade: 'torre',
    observacao: 'Renomeada de "Torre de Donuts" em 12/09/2026. As duas primeiras frases são transcrição literal dela, a do pratinho é a regra antiga que ela confirmou antes e que o texto novo não cobria. O contador conta torres, não donuts, e os 30 por torre são fixos. A foto foi cortada no topo pra tirar o nome da cliente que aparecia no topo de bolo; o original inteiro está em originais/fotos/. Esta é a única foto que usa 1:1 no card, ver FOTO_ALTA no app.js. O id segue torre-de-donuts.'
  },
  {
    id: 'biscoito-decorado',
    nome: 'Biscoito Decorado',
    descricao: 'Você manda os modelos que quer, ou só o tema, e recebe o orçamento.',
    preco: null,
    imagem: 'biscoito-decorado.jpg',
    alt: 'biscoitos decorados em glacê real, com laço de fita e embalagem',
    categoria: 'avulso',
    minimo: 1,
    unidade: '',
    observacao: 'Sob orçamento de verdade, nunca vai ter preço fixo e nunca entra na soma.'
  },
  {
    id: 'kit-festa-p',
    nome: 'Kit Festa P',
    descricao: '20 doces: 4 Pães de Mel 2D, 6 Pães de Mel de Mesa, 6 Trufas, 4 Pirulitos.',
    preco: 300.00,
    imagem: 'kit-festa-p.jpg',
    alt: 'doces variados de um kit de festa, decorados no mesmo tema',
    categoria: 'kit',
    minimo: 1,
    unidade: '',
    observacao: ''
  },
  {
    id: 'kit-festa-m',
    nome: 'Kit Festa M',
    descricao: '36 doces: 8 Pães de Mel 2D, 8 Pirulitos, 10 Pães de Mel de Mesa, 10 Trufas.',
    preco: 570.00,
    imagem: '',
    alt: '',
    categoria: 'kit',
    minimo: 1,
    unidade: '',
    observacao: 'Sem foto de propósito: ela mudou a composição e não tem foto que corresponda. A lista escrita é o que explica o produto.'
  },
  {
    id: 'kit-festa-g',
    nome: 'Kit Festa G',
    descricao: '62 doces: 6 Pães de Mel 2D, 6 Pirulitos, 4 Pães de Mel 3D, 10 Trufas, 6 Paletas de Pão de Mel, 30 Cake Donuts.',
    preco: 820.00,
    imagem: '',
    alt: '',
    categoria: 'kit',
    minimo: 1,
    unidade: '',
    observacao: 'Sem foto de propósito: ela mudou a composição e não tem foto que corresponda. A lista escrita é o que explica o produto.'
  }
];
