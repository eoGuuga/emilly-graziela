// A Emilly confirmou em 11/09/2026 que a tabela de janeiro de 2025 está velha
// e pediu pra tirar os preços até mandar a nova. Por isso está tudo com preco null.
// A tabela antiga ficou em originais/precos-2025-referencia.txt, fora do Git.
// Sem preço a página não vai ao ar.
//
// Quando a nova chegar é só preencher o preco aqui, não tem valor em outro arquivo.
// Cuidado: null hoje quer dizer duas coisas. No biscoito é sob orçamento de verdade,
// nos outros é só preço que ainda não voltou. Quem separa é o id, lá no app.js.
//
// observacao é recado meu, não aparece na página.

const PRODUTOS = [
  {
    id: 'paleta-pao-de-mel',
    nome: 'Paleta de Pão de Mel',
    descricao: 'Pão de mel de doce de leite ou brigadeiro, formato de sorvete, decoração 2D, laço de fita.',
    preco: null,
    imagem: '',
    categoria: 'avulso',
    observacao: ''
  },
  {
    id: 'pao-de-mel-3d',
    nome: 'Pão de Mel 3D',
    descricao: 'De doce de leite, formato quadrado, suporte decorado, elementos em pasta americana 2D e 3D.',
    preco: null,
    imagem: '',
    categoria: 'avulso',
    observacao: ''
  },
  {
    id: 'pao-de-mel-2d',
    nome: 'Pão de Mel 2D',
    descricao: 'Quadrado, recheado com doce de leite ou brigadeiro, pasta americana 2D, canudo de papel e laço de fita.',
    preco: null,
    imagem: '',
    categoria: 'avulso',
    observacao: ''
  },
  {
    id: 'pao-de-mel-mesa',
    nome: 'Pão de Mel Mesa',
    descricao: 'Mini, redondo, recheado, pasta americana 2D.',
    preco: null,
    imagem: '',
    categoria: 'avulso',
    observacao: ''
  },
  {
    id: 'pirulito',
    nome: 'Pirulito',
    descricao: 'Chocolate ao leite, pasta americana 2D, canudo de papel e laço de fita.',
    preco: null,
    imagem: '',
    categoria: 'avulso',
    observacao: ''
  },
  {
    id: 'trufa',
    nome: 'Trufa',
    descricao: 'Mini trufa de ganache, decoração 2D, acompanha forma de pétalas transparente.',
    preco: null,
    imagem: '',
    categoria: 'avulso',
    observacao: ''
  },
  {
    id: 'cento-doces-gourmet',
    nome: 'Cento de Doces Gourmet',
    descricao: '100 docinhos variados de 16g, confeitos Callebaut, sabores a consultar.',
    preco: null,
    imagem: '',
    categoria: 'avulso',
    observacao: ''
  },
  {
    id: 'biscoito-decorado',
    nome: 'Biscoito Decorado',
    descricao: 'Você manda os modelos que quer, ou só o tema, e recebe o orçamento.',
    preco: null,
    imagem: '',
    categoria: 'avulso',
    observacao: 'Esse aqui é sob orçamento de verdade, não é a tabela que saiu. Nunca vai ter preço fixo e nunca entra na soma.'
  },
  {
    id: 'kit-festa-p',
    nome: 'Kit Festa P',
    descricao: '20 doces: 4 Pães de Mel 2D, 4 Pirulitos, 6 Pães de Mel Mesa, 6 Trufas.',
    preco: null,
    imagem: '',
    categoria: 'kit',
    observacao: ''
  },
  {
    id: 'kit-festa-m',
    nome: 'Kit Festa M',
    descricao: '6 Pães de Mel 2D, 6 Pirulitos, 10 Pães de Mel Mesa, 10 Trufas, 25 Brigadeiros/Beijinhos.',
    preco: null,
    imagem: '',
    categoria: 'kit',
    observacao: 'O PDF fala em 32 doces mas a lista soma 57. Não mostro total nenhum enquanto ela não confirmar.'
  },
  {
    id: 'kit-festa-g',
    nome: 'Kit Festa G',
    descricao: '6 Pães de Mel 2D, 6 Pirulitos, 4 Pães de Mel 3D, 10 Trufas, 6 Paletas, 50 Brigadeiros/Beijinhos.',
    preco: null,
    imagem: '',
    categoria: 'kit',
    observacao: 'Mesma coisa do M. O PDF fala 32, a lista soma 82.'
  }
];
