// Monta o catálogo a partir do produtos.js, conta as quantidades
// e escreve a mensagem do pedido pro WhatsApp.
// O pedido só vive em memória. Recarregou, perdeu. É de propósito.

(function () {
  'use strict';

  const WHATSAPP = '5511960834829';
  const PIX = 0.05;
  const SOB_ORCAMENTO = 'biscoito-decorado';
  const DIAS_MINIMOS = 15;

  const quantidades = {};
  let querOrcamento = false;

  const $ = id => document.getElementById(id);
  const acharProduto = id => PRODUTOS.find(p => p.id === id);
  const link = texto => 'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(texto);

  // o biscoito é sob orçamento pela natureza dele, não por falta de preço
  const ehOrcamento = p => p.id === SOB_ORCAMENTO;
  const temPreco = p => typeof p.preco === 'number';
  const minimoDe = p => p.minimo || 1;

  // plural ingênuo, dá conta das palavras que a gente usa aqui
  const plural = (palavra, n) => (n === 1 ? palavra : palavra + 's');

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

  // conta os dias em data local, com as duas pontas fixadas ao meio-dia.
  // é a mesma armadilha do new Date: montar em UTC ou na meia-noite faz
  // virada de fuso e horário de verão empurrarem o resultado um dia
  function diasAte(iso) {
    const [ano, mes, dia] = iso.split('-').map(Number);
    const agora = new Date();
    const alvo = new Date(ano, mes - 1, dia, 12);
    const inicio = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate(), 12);
    return Math.round((alvo - inicio) / 86400000);
  }

  const foraDoPrazo = iso => Boolean(iso) && diasAte(iso) < DIAS_MINIMOS;

  function textoPrazo(dias) {
    if (dias <= 0) return 'a festa é hoje';
    if (dias === 1) return 'falta 1 dia';
    return 'faltam ' + dias + ' dias';
  }

  function el(tag, classe, texto) {
    const n = document.createElement(tag);
    if (classe) n.className = classe;
    if (texto != null) n.textContent = texto;
    return n;
  }

  function slotVazio() {
    const vazio = el('div', 'produto-foto produto-foto--vazia');
    vazio.append(el('span', 'produto-foto-aviso', 'Foto em breve'));
    return vazio;
  }

  function foto(produto) {
    if (!produto.imagem) return slotVazio();

    const img = el('img', 'produto-foto');
    img.src = 'img/' + produto.imagem;
    img.loading = 'lazy';
    img.alt = produto.alt;
    // se o arquivo ainda não estiver em img/, cai no slot vazio em vez
    // de deixar o ícone de imagem quebrada estourando o card
    img.onerror = () => img.replaceWith(slotVazio());
    return img;
  }

  // "Por unidade." no normal, "Por torre." na Torre, mais o mínimo quando tem
  function regraDeVenda(produto) {
    const un = produto.unidade || 'unidade';
    const min = minimoDe(produto);
    return min > 1
      ? 'Por ' + un + ', pedido mínimo de ' + min + ' ' + plural(un, min) + '.'
      : 'Por ' + un + '.';
  }

  // a Torre conta torres e não donuts, então a quantidade sai nomeada
  function textoQtd(item) {
    const un = item.produto.unidade;
    const contagem = un ? item.qtd + ' ' + plural(un, item.qtd) : String(item.qtd);
    return contagem + ' x ' + moeda(item.produto.preco);
  }

  function stepper(produto) {
    const wrap = el('div', 'stepper');
    const menos = el('button', 'stepper-botao', '−');
    const qtd = el('output', 'stepper-qtd', '0');
    const mais = el('button', 'stepper-botao', '+');

    menos.type = mais.type = 'button';
    menos.setAttribute('aria-label', 'Tirar de ' + produto.nome);
    mais.setAttribute('aria-label', 'Somar em ' + produto.nome);
    qtd.id = 'qtd-' + produto.id;

    menos.onclick = () => mudar(produto.id, -1);
    mais.onclick = () => mudar(produto.id, 1);

    wrap.append(menos, qtd, mais);
    return wrap;
  }

  function marcarOrcamento(produto) {
    const marcar = el('label', 'marcar');
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

    corpo.append(el('h3', 'produto-nome', produto.nome));
    if (produto.descricao) corpo.append(el('p', 'produto-desc', produto.descricao));

    if (ehOrcamento(produto)) {
      li.className = 'produto produto--orcamento';
      corpo.append(
        el('p', 'produto-preco produto-preco--sob', 'Sob orçamento'),
        marcarOrcamento(produto)
      );
    } else if (temPreco(produto)) {
      corpo.append(el('p', 'produto-preco', moeda(produto.preco)));
      // no kit o preço é do kit inteiro, não cabe "por unidade"
      if (produto.categoria !== 'kit') {
        corpo.append(el('p', 'produto-regra', regraDeVenda(produto)));
      }
      corpo.append(stepper(produto));
    } else {
      // rede de proteção pra preço que faltou: sem valor e sem contador,
      // calado. nada de "consulte" nem "a partir de"
      li.className = 'produto produto--sem-preco';
    }

    li.append(foto(produto), corpo);
    return li;
  }

  function mudar(id, delta) {
    const min = minimoDe(acharProduto(id));
    const atual = quantidades[id] || 0;
    let novo;

    if (delta > 0) {
      // o primeiro toque pula direto pro mínimo, dali em diante anda de 1 em 1
      novo = atual === 0 ? min : atual + 1;
    } else {
      novo = atual - 1;
      // abaixo do mínimo não existe quantidade válida, então volta pra zero
      if (novo < min) novo = 0;
    }

    if (novo === 0) delete quantidades[id];
    else quantidades[id] = novo;

    $('qtd-' + id).textContent = novo;
    atualizar();
  }

  function itensEscolhidos() {
    return PRODUTOS
      .filter(p => temPreco(p) && !ehOrcamento(p) && quantidades[p.id] > 0)
      .map(p => ({ produto: p, qtd: quantidades[p.id], subtotal: p.preco * quantidades[p.id] }));
  }

  const somar = itens => itens.reduce((total, i) => total + i.subtotal, 0);

  // o contador já não deixa chegar aqui, mas se chegar o envio para
  const abaixoDoMinimo = () =>
    itensEscolhidos().filter(i => i.qtd < minimoDe(i.produto));

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
        el('span', 'resumo-qtd', textoQtd(i)),
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

    // sem nada somado não faz sentido mostrar "Total R$ 0,00"
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
      // "item" tem plural irregular, não passa pelo helper
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

    // os 15 dias são pra ela organizar a agenda, não são regra rígida.
    // aqui é sinalizar e perguntar disponibilidade, nunca falar em taxa
    if (foraDoPrazo(dataFesta)) {
      linhas.push('Atenção: ' + textoPrazo(diasAte(dataFesta)) +
                  ', menos que os 15 dias de antecedência. Você consegue confirmar se tem disponibilidade?');
    }

    linhas.push('');

    if (itens.length > 0) {
      linhas.push('Pedido:');
      itens.forEach(i => {
        linhas.push('- ' + i.produto.nome + ': ' + textoQtd(i) + ' = ' + moeda(i.subtotal));
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
  const erroMinimo = $('erro-minimo');
  const avisoPrazo = $('aviso-prazo');

  // só bloqueia data que já passou. menos de 15 dias ela aceita, então
  // ali é aviso e não trava
  campoData.min = hoje();

  campoData.oninput = () => {
    erroData.hidden = true;
    campoData.removeAttribute('aria-invalid');
    avisoPrazo.hidden = !foraDoPrazo(campoData.value);
  };

  form.onsubmit = e => {
    e.preventDefault();

    const faltando = abaixoDoMinimo();
    if (faltando.length > 0) {
      erroMinimo.textContent = faltando
        .map(i => i.produto.nome + ' precisa de no mínimo ' + minimoDe(i.produto) + ' ' +
                  plural(i.produto.unidade || 'unidade', minimoDe(i.produto)) + '.')
        .join(' ');
      erroMinimo.hidden = false;
      return;
    }
    erroMinimo.hidden = true;

    if (!campoData.value) {
      erroData.hidden = false;
      campoData.setAttribute('aria-invalid', 'true');
      campoData.focus();
      return;
    }

    // alguns navegadores devolvem \r\n do textarea, e o \r vira quebra
    // sobrando na mensagem da WhatsApp
    const obs = $('obs').value.replace(/\r\n/g, '\n').trim();
    window.open(link(mensagem(campoData.value, obs)), '_blank');
  };

  atualizar();
})();
