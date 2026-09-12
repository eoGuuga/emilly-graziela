// Os produtos do catálogo, na ordem em que aparecem na página.
//
// preco     valor em reais, ou null quando o item é sob orçamento
// minimo    quantidade mínima, 1 quando o item não tem regra de mínimo
// unidade   o que o contador conta, quando não é unidade solta
// fotos     lista de fotos do produto. A primeira é a do card, as outras só
//           aparecem na tela cheia. Cada foto tem:
//             arquivo  nome do arquivo, que existe em img/card/ e em img/galeria/
//             alt      texto alternativo, descreve a técnica
//             foco     opcional, onde o recorte 4:5 se prende. "50% 50%" é o
//                      centro; "50% 60%" desce pra pegar o doce na mão

const PRODUTOS = [
  {
    id: 'pao-de-mel-mesa',
    nome: 'Pão de Mel de Mesa',
    descricao: 'Mini, redondo, recheado, pasta americana 2D.',
    preco: 12.00,
    categoria: 'avulso',
    minimo: 1,
    unidade: '',
    fotos: [
      { arquivo: 'pao-de-mel-mesa.jpg', alt: 'mini pães de mel redondos, com carinha de ursinho em pasta americana' }
    ]
  },
  {
    id: 'pao-de-mel-2d',
    nome: 'Pão de Mel 2D',
    descricao: 'Quadrado, recheado com doce de leite ou brigadeiro, pasta americana 2D, canudo de papel e laço de fita.',
    preco: 25.00,
    categoria: 'avulso',
    minimo: 1,
    unidade: '',
    fotos: [
      { arquivo: 'pao-de-mel-2d.jpg', alt: 'pães de mel quadrados decorados em pasta americana, com canudo de papel e laço de fita' }
    ]
  },
  {
    id: 'pao-de-mel-3d',
    nome: 'Pão de Mel 3D',
    descricao: 'De doce de leite, formato quadrado, suporte decorado, elementos em pasta americana 2D e 3D.',
    preco: 38.00,
    categoria: 'avulso',
    minimo: 1,
    unidade: '',
    fotos: [
      { arquivo: 'pao-de-mel-3d.jpg', alt: 'pão de mel 3D em formato de casinha, modelado em pasta americana', foco: '50% 40%' }
    ]
  },
  {
    id: 'paleta-pao-de-mel',
    nome: 'Paleta de Pão de Mel',
    descricao: 'Pão de mel de doce de leite ou brigadeiro, formato de sorvete, decoração 2D, laço de fita.',
    preco: 32.00,
    categoria: 'avulso',
    minimo: 1,
    unidade: '',
    fotos: [
      { arquivo: 'paleta-de-pao-de-mel.jpg', alt: 'paletas de pão de mel cobertas com chocolate, decoradas em 2D com laço de fita' }
    ]
  },
  {
    id: 'pirulito-personalizado',
    nome: 'Pirulito Personalizado',
    descricao: 'Chocolate ao leite, pasta americana 2D, canudo de papel e laço de fita.',
    preco: 22.00,
    categoria: 'avulso',
    minimo: 1,
    unidade: '',
    fotos: [
      { arquivo: 'pirulito-personalizado.jpg', alt: 'pirulitos de chocolate redondos, decorados em 2D com canudo e laço de fita' }
    ]
  },
  {
    id: 'trufa',
    nome: 'Trufa',
    descricao: 'Mini trufa de ganache, com decoração em 2D. Sabores: brigadeiro, ninho, ninho com creme de avelã, prestígio. Os sabores podem variar de acordo com a disponibilidade dos recheios no momento da produção. Caso o cliente prefira, é possível especificar um único sabor para toda a quantidade encomendada, mediante disponibilidade dos ingredientes.',
    preco: 8.00,
    categoria: 'avulso',
    minimo: 1,
    unidade: '',
    fotos: [
      { arquivo: 'trufa.jpg', alt: 'mini trufas de ganache decoradas com flor em pasta americana' }
    ]
  },
  {
    id: 'cento-variado',
    nome: 'Doces Gourmet',
    descricao: 'Todos podem ser finalizados com confeitos belgas, raspas de chocolate ou outros acabamentos especiais. Alguns sabores também recebem creme de avelã ou doce de leite. Sabores a consultar.',
    preco: 3.00,
    categoria: 'avulso',
    minimo: 25,
    unidade: '',
    fotos: [
      { arquivo: 'doces-gourmet.jpg', alt: 'docinhos gourmet variados em forminhas' }
    ]
  },
  {
    id: 'cento-brigadeiro-personalizado',
    nome: 'Doces Gourmet Personalizados',
    descricao: 'Doces produzidos com chocolates de alta qualidade e ingredientes selecionados, cuidadosamente preparados para combinar com a identidade de cada evento. Podem ser finalizados com confeitos belgas, formatos diferenciados e cores variadas, além de receber diferentes tipos de acabamento, como carimbo personalizado, glitter, papel arroz e detalhes em pasta americana.',
    preco: 3.80,
    categoria: 'avulso',
    minimo: 50,
    unidade: '',
    fotos: [
      { arquivo: 'doces-gourmet-personalizados.jpg', alt: 'docinhos com carinha de bichinho modelada em pasta americana', foco: '50% 60%' }
    ]
  },
  {
    id: 'cake-donut',
    nome: 'Cake Donut',
    descricao: 'Um delicioso bolo macio e fofinho, assado no formato de donuts e finalizado com uma cobertura de chocolate. Sabores da massa: baunilha ou chocolate. A decoração pode ser personalizada de acordo com o tema e o gosto do cliente, podendo incluir pasta americana, confeitos, pós decorativos, brilho e outros detalhes.',
    preco: 4.00,
    categoria: 'avulso',
    minimo: 30,
    unidade: '',
    fotos: [
      { arquivo: 'cake-donut.jpg', alt: 'mini donuts cobertos com chocolate colorido e confeitos', foco: '50% 60%' }
    ]
  },
  {
    id: 'torre-de-donuts',
    nome: 'Torre de Cake Donuts',
    descricao: 'Torre com 30 Cake Donuts, montada com aproximadamente 24 cm de altura. Inclui topo personalizado e decoração em alguns dos donuts, seguindo o tema escolhido pelo cliente. O pratinho vai junto e fica com você, não precisa devolver.',
    preco: 150.00,
    categoria: 'avulso',
    minimo: 1,
    unidade: 'torre',
    fotos: [
      { arquivo: 'torre-de-cake-donuts.jpg', alt: 'torre de donuts decorada com laços de fita' }
    ]
  },
  {
    id: 'biscoito-decorado',
    nome: 'Biscoito Decorado',
    descricao: 'Você me manda os modelos que quer, ou só o tema, e eu te passo o orçamento.',
    preco: null,
    categoria: 'avulso',
    minimo: 1,
    unidade: '',
    fotos: [
      { arquivo: 'biscoito-decorado.jpg', alt: 'biscoitos decorados em glacê real, com laço de fita e embalagem' }
    ]
  },
  {
    id: 'kit-festa-p',
    nome: 'Kit Festa P',
    descricao: '20 doces: 4 Pães de Mel 2D, 6 Pães de Mel de Mesa, 6 Trufas, 4 Pirulitos.',
    preco: 300.00,
    categoria: 'kit',
    minimo: 1,
    unidade: '',
    fotos: [
      { arquivo: 'kit-festa-p.jpg', alt: 'doces variados de um kit de festa, decorados no mesmo tema' }
    ]
  },
  {
    id: 'kit-festa-m',
    nome: 'Kit Festa M',
    descricao: '36 doces: 8 Pães de Mel 2D, 8 Pirulitos, 10 Pães de Mel de Mesa, 10 Trufas.',
    preco: 570.00,
    categoria: 'kit',
    minimo: 1,
    unidade: '',
    fotos: []
  },
  {
    id: 'kit-festa-g',
    nome: 'Kit Festa G',
    descricao: '62 doces: 6 Pães de Mel 2D, 6 Pirulitos, 4 Pães de Mel 3D, 10 Trufas, 6 Paletas de Pão de Mel, 30 Cake Donuts.',
    preco: 820.00,
    categoria: 'kit',
    minimo: 1,
    unidade: '',
    fotos: []
  }
];

// Bolos ficam fora do pedido da página: sabor, peso e tema são conversa.
// A seção mostra a tabela e leva pro WhatsApp. precoKg é o valor por quilo.

const BOLOS = {
  linhas: [
    { tipo: 'Bolos tradicionais', precoKg: 110.00, sabores: 'prestígio, brigadeiro, ninho, doce de leite' },
    { tipo: 'Bolos com frutas', precoKg: 140.00, sabores: 'abacaxi com doce de leite, chocolate com morango, maracujá com brigadeiro, ameixa com doce de leite, morango com ninho, abacaxi com coco e doce de leite' },
    { tipo: 'Bolo especial', precoKg: 150.00, sabores: 'limão siciliano com geleia de frutas vermelhas' },
    { tipo: 'Bolos trufados', precoKg: 160.00, sabores: 'ganache de chocolate ao leite, chocolate amargo, chocolate branco' }
  ],
  topo: 'Topo de bolo: a partir de R$ 35,00, com papel em camadas.',
  extras: 'Bolos com glitter, fitas, pó decorativo diferenciado, pérolas e outros detalhes especiais: acréscimo de valores, consultar.',
  rendimento: [
    { kg: 1, fatias: '7 a 8' },
    { kg: 2, fatias: '18 a 20' },
    { kg: 3, fatias: '28 a 30' },
    { kg: 4, fatias: '38 a 40' }
  ],
  corte: 'A partir de 4 kg, eu sugiro o bolo quadrado, que é bolo de corte.'
};
