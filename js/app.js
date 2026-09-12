// Monta o catálogo a partir do produtos.js, conta as quantidades
// e escreve a mensagem do pedido pro WhatsApp.
// O pedido só vive em memória. Recarregou, perdeu. É de propósito.

(function () {
  'use strict';

  const WHATSAPP = '5511960834829';
  const PIX = 0.05;
  const SOB_ORCAMENTO = 'biscoito-decorado';

  const quantidades = {};
  let querOrcamento = false;

  const $ = id => document.getElementById(id);
  const acharProduto = id => PRODUTOS.find(p => p.id === id);
  const link = texto => 'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(texto);

  // o biscoito é sob orçamento pela natureza dele, não porque está sem preço.
  // enquanto a tabela nova não chega o resto também está null, daí a diferença
  // ter que sair do id e não do preco
  const ehOrcamento = p => p.id === SOB_ORCAMENTO;
  const temPreco = p => typeof p.preco === 'number';

  function moeda(valor) {
    const [inteiro, centavos] = valor.toFixed(2).split('.');
    return 'R$ ' + inteiro.replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ',' + centavos;
  }

  function dataBR(iso) {
    // new Date('2026-10-12') lê como UTC e volta um dia aqui no Brasil
    const [ano, mes, dia] = iso.split('-');
    return dia + '/' + mes + '/' + ano;
  }

  function hoje() {
    const d = new Date();
    const mes = String(d.getMonth() + 1).padStart(2, '0');
    const dia = String(d.getDate()).padStart(2, '0');
    return d.getFullYear() + '-' + mes + '-' + dia;
  }

  function el(tag, classe, texto) {
    const n = document.createElement(tag);
    if (classe) n.className = classe;
    if (texto != null) n.textContent = texto;
    return n;
  }

  function foto(produto) {
    if (produto.imagem) {
      const img = el('img', 'produto-foto');
      img.src = produto.imagem;
      img.loading = 'lazy';
      img.alt = produto.nome + '. ' + produto.descricao;
      return img;
    }
    // enquanto não tem foto, o slot fica com a proporção reservada
    // pra nada pular de lugar quando as fotos entrarem
    const vazio = el('div', 'produto-foto produto-foto--vazia');
    vazio.append(el('span', 'produto-foto-aviso', 'Foto em breve'));
    return vazio;
  }

  function stepper(produto) {
    const wrap = el('div', 'stepper');
    const menos = el('button', 'stepper-botao', '−');
    const qtd = el('output', 'stepper-qtd', '0');
    const mais = el('button', 'stepper-botao', '+');

    menos.type = mais.type = 'button';
    menos.setAttribute('aria-label', 'Tirar um ' + produto.nome);
    mais.setAttribute('aria-label', 'Somar um ' + produto.nome);
    qtd.id = 'qtd-' + produto.id;

    menos.onclick = () => mudar(produto.id, -1);
    mais.onclick = () => mudar(produto.id, 1);

    wrap.append(menos, qtd, mais);
    return wrap;
  }

  function marcarOrcamento(produto) {
    const marcar = el('label', 'orcamento-marcar');
    const check = el('input');
    check.type = 'checkbox';
    check.id = 'orcamento-' + produto.id;
    check.onchange = () => {
      querOrcamento = check.checked;
      atualizar();
    };
    marcar.append(check, el('span', null, 'Quero orçamento deste'));
    return marcar;
  }

  function card(produto) {
    const li = el('li', 'produto');
    const corpo = el('div', 'produto-corpo');

    corpo.append(
      el('h3', 'produto-nome', produto.nome),
      el('p', 'produto-desc', produto.descricao)
    );

    if (ehOrcamento(produto)) {
      li.className = 'produto produto--orcamento';
      corpo.append(
        el('p', 'produto-preco produto-preco--sob', 'Sob orçamento'),
        marcarOrcamento(produto)
      );
    } else if (temPreco(produto)) {
      corpo.append(el('p', 'produto-preco', moeda(produto.preco)), stepper(produto));
    } else {
      // tabela de preço ainda não voltou: sem valor e sem stepper.
      // não invento "consulte" nem "a partir de", fica só o produto.
      li.className = 'produto produto--sem-preco';
    }

    li.append(foto(produto), corpo);
    return li;
  }

  function mudar(id, delta) {
    const novo = Math.max(0, (quantidades[id] || 0) + delta);
    if (novo === 0) {
      delete quantidades[id];
    } else {
      quantidades[id] = novo;
    }
    $('qtd-' + id).textContent = novo;
    atualizar();
  }

  function itensEscolhidos() {
    return PRODUTOS
      .filter(p => temPreco(p) && !ehOrcamento(p) && quantidades[p.id] > 0)
      .map(p => ({ produto: p, qtd: quantidades[p.id], subtotal: p.preco * quantidades[p.id] }));
  }

  const somar = itens => itens.reduce((total, i) => total + i.subtotal, 0);

  function atualizar() {
    const itens = itensEscolhidos();
    const total = somar(itens);
    const temAlgo = itens.length > 0 || querOrcamento;

    $('pedido-vazio').hidden = temAlgo;
    $('pedido-conteudo').hidden = !temAlgo;

    const resumo = $('resumo');
    resumo.textContent = '';

    itens.forEach(i => {
      const linha = el('li', 'resumo-linha');
      linha.append(
        el('span', 'resumo-nome', i.produto.nome),
        el('span', 'resumo-qtd', i.qtd + ' x ' + moeda(i.produto.preco)),
        el('span', 'resumo-sub', moeda(i.subtotal))
      );
      resumo.append(linha);
    });

    if (querOrcamento) {
      const linha = el('li', 'resumo-linha resumo-linha--orcamento');
      linha.append(
        el('span', 'resumo-nome', acharProduto(SOB_ORCAMENTO).nome),
        el('span', 'resumo-qtd', 'sob orçamento'),
        el('span', 'resumo-sub', 'fora do total')
      );
      resumo.append(linha);
    }

    // sem nada somado não faz sentido mostrar "Total R$ 0,00".
    // a conta continua a mesma, só não aparece.
    $('total-linha').hidden = total === 0;
    $('total-valor').textContent = moeda(total);

    const nota = $('total-nota');
    nota.hidden = total === 0;
    if (total > 0) {
      nota.textContent = 'No Pix à vista sai ' + moeda(total * (1 - PIX)) + ', com os 5% de desconto.';
    }

    barra(itens, total);
  }

  function barra(itens, total) {
    const caixa = $('barra');
    const pecas = itens.reduce((soma, i) => soma + i.qtd, 0);

    if (pecas === 0 && !querOrcamento) {
      caixa.hidden = true;
      return;
    }

    // conto "itens" e não "doces" porque um kit é 1 item mas vem com vários doces dentro
    let rotulo = 'Orçamento de biscoito';
    if (pecas > 0) {
      rotulo = pecas + (pecas === 1 ? ' item' : ' itens');
      if (querOrcamento) rotulo += ' mais orçamento';
    }

    $('barra-qtd').textContent = rotulo;
    $('barra-total').textContent = moeda(total);
    $('barra-total').hidden = total === 0;
    caixa.hidden = false;
  }

  function mensagem(dataFesta, observacao) {
    const itens = itensEscolhidos();
    const total = somar(itens);
    const linhas = ['Oi, Emilly! Vim pelo site.', ''];

    linhas.push('Data da festa: ' + dataBR(dataFesta));
    linhas.push('Já sei que é retirada, você não faz entrega.');
    linhas.push('');

    if (itens.length > 0) {
      linhas.push('Pedido:');
      itens.forEach(i => {
        linhas.push('- ' + i.produto.nome + ': ' + i.qtd + ' x ' +
                    moeda(i.produto.preco) + ' = ' + moeda(i.subtotal));
      });
      linhas.push('');
      linhas.push('Total: ' + moeda(total));
      linhas.push('No Pix à vista: ' + moeda(total * (1 - PIX)) + ' (5% de desconto)');
    }

    if (querOrcamento) {
      if (itens.length > 0) linhas.push('');
      linhas.push(itens.length > 0
        ? 'Biscoito decorado: queria um orçamento. Sei que não entra nesse total, te mando os modelos.'
        : 'Biscoito decorado: queria um orçamento, te mando os modelos.');
    }

    if (observacao) linhas.push('', 'Observação: ' + observacao);

    return linhas.join('\n');
  }

  const avulsos = $('lista-avulsos');
  const kits = $('lista-kits');
  PRODUTOS.forEach(p => (p.categoria === 'kit' ? kits : avulsos).append(card(p)));

  const form = $('form-pedido');
  const campoData = $('data-festa');
  const erroData = $('erro-data');

  // a encomenda é pra uma data futura, mas a antecedência mínima ela ainda
  // não me passou, então só bloqueio data que já passou
  campoData.min = hoje();

  campoData.oninput = () => {
    erroData.hidden = true;
    campoData.removeAttribute('aria-invalid');
  };

  form.onsubmit = e => {
    e.preventDefault();

    if (!campoData.value) {
      erroData.hidden = false;
      campoData.setAttribute('aria-invalid', 'true');
      campoData.focus();
      return;
    }

    window.open(link(mensagem(campoData.value, $('obs').value.trim())), '_blank');
  };

  atualizar();
})();
