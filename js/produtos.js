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
// Atenção: as descrições do Pão de Mel de Mesa, 2D, 3D, Paleta, Pirulito e Trufa
// ainda são as do cardápio de 2025. Ela reconfirmou só os preços e vai revisar.

const PRODUTOS = [
  {
    id: 'pao-de-mel-mesa',
    nome: 'Pão de Mel de Mesa',
    descricao: 'Mini, redondo, recheado, pasta americana 2D.',
    preco: 12.00,
    imagem: '',
    alt: '',
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
    imagem: '',
    alt: '',
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
    alt: 'pães de mel 3D decorados em pasta americana, com canudo e laço de fita',
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
    imagem: '',
    alt: '',
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
    imagem: '',
    alt: '',
    categoria: 'avulso',
    minimo: 1,
    unidade: '',
    observacao: 'Ela renomeou, antes era só "Pirulito".'
  },
  {
    id: 'trufa',
    nome: 'Trufa',
    descricao: 'Mini trufa de ganache, com decoração em 2D.',
    preco: 8.00,
    imagem: '',
    alt: '',
    categoria: 'avulso',
    minimo: 1,
    unidade: '',
    observacao: `Ela tirou a forma de pétalas transparente da descrição em 12/09/2026, porque nem sempre acha e não quer prometer.

Mandou também estes dois trechos por escrito, transcritos literal, mas ainda NÃO confirmou de qual produto são:
"Os sabores podem variar de acordo com a disponibilidade dos recheios no momento da produção."
"Caso o cliente prefira, é possível especificar um único sabor para toda a quantidade encomendada, mediante disponibilidade dos ingredientes."
Veio junto uma lista encabeçada pela palavra "Trufas" com brigadeiro, ninho, ninho com creme de avelã e prestígio. Provavelmente é daqui, mas nada disso entra na página até ela confirmar.`
  },
  {
    id: 'cento-brigadeiro-personalizado',
    nome: 'Cento de Brigadeiro Personalizado',
    descricao: '',
    preco: 3.80,
    imagem: 'brigadeiro-personalizado.jpg',
    alt: 'brigadeiros com carinha de bichinho modelada em pasta americana',
    categoria: 'avulso',
    minimo: 50,
    unidade: '',
    observacao: `Sem descrição ainda. O nome pode mudar, porque não exige 100 e briga com o mínimo no mesmo card. Trocar só aqui no nome.

PENDENTE: apareceu um R$ 3,50 pra conferir contra o R$ 3,80 que está aqui. Não sei de onde saiu o 3,50, ela nunca me passou esse número. Mantido 3,80 até ela confirmar.`
  },
  {
    id: 'cake-donut',
    nome: 'Cake Donut',
    descricao: '',
    preco: 4.00,
    imagem: 'cake-donut.jpg',
    alt: 'mini donuts cobertos com chocolate rosa e branco, decorados com confeitos',
    categoria: 'avulso',
    minimo: 30,
    unidade: '',
    observacao: 'Sem descrição ainda, ela ficou de mandar uma frase. Não confundir com o antigo Donuts no Palito, que saiu do catálogo.'
  },
  {
    id: 'cento-variado',
    nome: 'Cento Variado',
    descricao: 'Sabores a consultar.',
    preco: 3.00,
    imagem: 'cento-variado.jpg',
    alt: 'docinhos variados de brigadeiro gourmet em forminhas',
    categoria: 'avulso',
    minimo: 25,
    unidade: '',
    observacao: `R$ 3,00 x 100 fecha nos R$ 300,00 do cento. O nome pode mudar, porque o mínimo é 25 e não 100. Trocar só aqui no nome.

Este é o produto que ela chama de "Doces Gourmet", que no cardápio de 2025 era "Cento de Doces Gourmet". O "sabores a consultar" segue em aberto, ela ainda não disse quais são.

Mandou estes dois trechos por escrito, transcritos literal, mas ainda NÃO confirmou de qual produto são:
"Os sabores podem variar de acordo com a disponibilidade dos recheios no momento da produção."
"Caso o cliente prefira, é possível especificar um único sabor para toda a quantidade encomendada, mediante disponibilidade dos ingredientes."
A lista que veio junto estava encabeçada pela palavra "Trufas", então pode ser de lá e não daqui. Nada entra na página até ela confirmar.`
  },
  {
    id: 'torre-de-donuts',
    nome: 'Torre de Donuts',
    descricao: '24 cm, com 30 donuts. Vai montada no pratinho, que fica com você e não é devolvido.',
    preco: 150.00,
    imagem: '',
    alt: '',
    categoria: 'avulso',
    minimo: 1,
    unidade: 'torre',
    observacao: 'O contador conta torres, não donuts. Os 30 donuts por torre são fixos.'
  },
  {
    id: 'biscoito-decorado',
    nome: 'Biscoito Decorado',
    descricao: 'Você manda os modelos que quer, ou só o tema, e recebe o orçamento.',
    preco: null,
    imagem: '',
    alt: '',
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
    imagem: '',
    alt: '',
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
    observacao: ''
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
    observacao: ''
  }
];
