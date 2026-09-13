// Monta o catálogo a partir do produtos.js, conta as quantidades
// e escreve a mensagem do pedido pro WhatsApp.
// O pedido só vive em memória. Recarregou, perdeu. É de propósito.

(function () {
  'use strict';

  const WHATSAPP = '5511960834829';
  const PIX = 0.05;
  const SOB_ORCAMENTO = 'biscoito-decorado';
  const DIAS_MINIMOS = 15;
  const LIMITE_OBS = 300;
  const AVISA_OBS = 200;

  const quantidades = {};
  let querOrcamento = false;

  const $ = id => document.getElementById(id);
  const acharProduto = id => PRODUTOS.find(p => p.id === id);
  const link = texto => 'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(texto);

  // quem é sob orçamento vem do id, não do preco null
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

  // a frase muda quando a festa é hoje ou amanhã; "a festa é hoje, menos que
  // os 15 dias" não é frase
  function fraseDoPrazo(dias) {
    if (dias <= 0) return 'a festa é hoje, então não tem os 15 dias de antecedência.';
    if (dias === 1) return 'a festa é amanhã, então não tem os 15 dias de antecedência.';
    return 'faltam ' + dias + ' dias, menos que os 15 dias de antecedência.';
  }

  function el(tag, classe, texto) {
    const n = document.createElement(tag);
    if (classe) n.className = classe;
    if (texto != null) n.textContent = texto;
    return n;
  }

  // preço como forma: o R$ menor, o número em serifa
  function precoEl(valor, classe) {
    const p = el('p', 'preco' + (classe ? ' ' + classe : ''));
    const texto = moeda(valor);
    p.append(el('span', 'moeda', 'R$'), texto.slice(3));
    return p;
  }

  /* ---- fotos ----
     O card cria um único <img>, a primeira foto do produto. As outras não
     existem no DOM até a pessoa abrir a tela cheia: é o que segura o peso
     num produto com dez ou vinte fotos. */

  const caminhoCard = f => 'img/card/' + f.arquivo;
  const caminhoGaleria = f => 'img/galeria/' + f.arquivo;

  function slotVazio() {
    const vazio = el('div', 'foto foto--vazia');
    vazio.append(el('span', null, 'Foto em breve'));
    return vazio;
  }

  function foto(produto, primeira) {
    const fotos = produto.fotos || [];
    if (!fotos.length) return slotVazio();

    const img = novaImg(fotos[0]);
    // o primeiro card está na dobra: lazy nele só atrasa a foto principal
    if (primeira) img.fetchPriority = 'high';
    else img.loading = 'lazy';

    const abrir = el('button', 'foto-abrir');
    abrir.type = 'button';
    abrir.setAttribute('aria-label', 'Ver ' + (fotos.length > 1 ? 'as ' + fotos.length + ' fotos' : 'a foto') + ' de ' + produto.nome);
    abrir.append(img);

    if (fotos.length < 2) {
      abrir.onclick = () => abrirTela(produto, 0, abrir);
      // se o arquivo não vier, cai no slot vazio em vez do ícone quebrado
      img.onerror = () => abrir.replaceWith(slotVazio());
      return abrir;
    }

    // várias fotos: o botão vira a superfície de arrasto e ganha os pontos embaixo
    abrir.classList.add('foto-abrir--varias');
    const caixa = el('div', 'foto-caixa');
    caixa.append(abrir, carrossel(produto, img, abrir));
    img.onerror = () => caixa.replaceWith(slotVazio());
    return caixa;
  }

  /* ---- carrossel do card ----
     Um <img> por card, sempre. As outras fotos do produto não existem no DOM:
     a troca muda o src, e cada foto só começa a baixar no gesto (as vizinhas
     no primeiro toque, a escolhida antes de aparecer). O índice é o mesmo da
     tela cheia: fechou na foto 3, o card fica na foto 3. */

  const fotoAtual = {};        // id do produto -> índice da foto que o card mostra
  const sincronizarCard = {};  // id do produto -> função que leva o card a um índice
  const LIMIAR_ARRASTO = 50;   // px de arrasto lateral que trocam a foto
  const MAX_PONTOS = 7;        // do oitavo em diante os pontos viram "n de N" em texto:
                               // oito pontos de 44px não cabem em 320px de coluna sem encolher

  // o foco é por foto: a mão dela, o topo da torre, onde o produto está
  function pintarFoto(img, f) {
    img.src = caminhoCard(f);
    img.alt = f.alt;
    img.style.objectPosition = f.foco || '';
  }

  function novaImg(f) {
    const img = el('img', 'foto');
    pintarFoto(img, f);
    img.width = 720;
    img.height = 900;
    img.decoding = 'async';
    return img;
  }

  function carrossel(produto, img, abrir) {
    const fotos = produto.fotos;
    const n = fotos.length;
    const id = produto.id;
    const vira = j => (j + n) % n;
    const indice = () => fotoAtual[id] || 0;
    const baixadas = new Set([caminhoCard(fotos[0])]);

    // os pontos do anel: um botão de 44px por foto, com o ponto de 7px no meio
    const pontos = el(n > MAX_PONTOS ? 'button' : 'div', n > MAX_PONTOS ? 'foto-conta' : 'foto-pontos');
    if (n > MAX_PONTOS) { pontos.type = 'button'; pontos.onclick = () => irPara(0); }
    const botoes = n > MAX_PONTOS ? [] : fotos.map((f, j) => {
      const b = el('button', 'ponto');
      b.type = 'button';
      b.setAttribute('aria-label', 'Foto ' + (j + 1) + ' de ' + n + ' de ' + produto.nome);
      b.onclick = () => irPara(j);
      return b;
    });
    pontos.append(...botoes);

    function marcar() {
      const i = indice();
      if (botoes.length) botoes.forEach((b, j) => j === i ? b.setAttribute('aria-current', 'true') : b.removeAttribute('aria-current'));
      else {
        pontos.textContent = (i + 1) + ' de ' + n;
        pontos.setAttribute('aria-label', 'Foto ' + (i + 1) + ' de ' + n + ' de ' + produto.nome + '. Voltar pra primeira');
      }
    }

    function baixar(j) {
      const src = caminhoCard(fotos[vira(j)]);
      if (baixadas.has(src)) return;
      baixadas.add(src);
      const pre = new Image();
      pre.src = src;
    }
    const vizinhas = () => { baixar(indice() - 1); baixar(indice() + 1); };

    // troca sem gesto (ponto, tela cheia): a escolhida baixa antes de aparecer
    function irPara(j) {
      const i = vira(j);
      const anterior = indice();
      if (i === anterior || animando) return;
      fotoAtual[id] = i;
      img.classList.add('foto--trocando');
      const pre = new Image();
      pre.onload = () => {
        img.classList.remove('foto--trocando');
        pintarFoto(img, fotos[indice()]);
        marcar();
        vizinhas();
      };
      pre.onerror = () => { fotoAtual[id] = anterior; img.classList.remove('foto--trocando'); marcar(); };
      pre.src = caminhoCard(fotos[i]);
      baixadas.add(pre.src);
    }

    // arrasto: a vizinha nasce ao lado da foto, desliza junto com o dedo e
    // morre quando o gesto termina. Em repouso o card tem um <img> só; durante
    // o gesto, dois. A moldura (o botão) fica parada: o que anda é o conteúdo.
    let toque = null;          // o dedo: {x, y, dx, lateral}
    let vizinha = null;        // o segundo <img>, só durante o gesto
    let lado = 0;              // 1: vizinha à direita (a próxima), -1: à esquerda (a anterior)
    let animando = false;      // entre soltar e a animação terminar
    let ignorarClique = false;
    const mover = dx => abrir.style.setProperty('--dx', dx);

    function porLado(l) {
      if (vizinha && lado === l) return;
      if (vizinha) vizinha.remove();
      lado = l;
      vizinha = novaImg(fotos[vira(indice() + l)]);
      vizinha.classList.add('foto--vizinha');
      vizinha.style.setProperty('--lado', String(l));
      abrir.append(vizinha);
    }

    // fim da animação: a vizinha vira a foto do card, ou some
    function terminar(concluiu) {
      if (!animando) return;
      animando = false;
      abrir.classList.remove('foto-abrir--solta');
      if (concluiu) {
        fotoAtual[id] = vira(indice() + lado);
        vizinha.classList.remove('foto--vizinha');
        vizinha.style.removeProperty('--lado');
        img.remove();
        img = vizinha;
      } else {
        vizinha.remove();
      }
      vizinha = null;
      lado = 0;
      mover('0px');
      marcar();
      if (concluiu) vizinhas();
    }

    function soltar(dx) {
      if (!vizinha) { mover('0px'); return; }
      const concluiu = Math.abs(dx) >= LIMIAR_ARRASTO;
      animando = true;
      abrir.classList.add('foto-abrir--solta');
      mover(concluiu ? (lado > 0 ? '-100%' : '100%') : '0px');
      vizinha.ontransitionend = () => terminar(concluiu);
      setTimeout(() => terminar(concluiu), 260);   // se a transição não disparar (movimento reduzido)
    }

    abrir.ontouchstart = e => {
      if (animando) { toque = null; return; }
      ignorarClique = false;
      toque = e.touches.length === 1 ? { x: e.touches[0].clientX, y: e.touches[0].clientY, dx: 0, lateral: false } : null;
      vizinhas();
    };
    abrir.ontouchmove = e => {
      if (!toque) return;
      const dx = e.touches[0].clientX - toque.x;
      const dy = e.touches[0].clientY - toque.y;
      if (!toque.lateral) {
        if (Math.abs(dx) < 10 || Math.abs(dx) <= Math.abs(dy)) return;
        toque.lateral = true;
      }
      toque.dx = dx;
      if (dx !== 0) porLado(dx < 0 ? 1 : -1);
      mover(dx + 'px');
    };
    abrir.ontouchend = () => {
      if (!toque) return;
      const { dx, lateral } = toque;
      toque = null;
      if (!lateral) return;
      // o browser pode sintetizar um clique depois do arrasto; esse não abre nada
      ignorarClique = true;
      soltar(dx);
    };
    // a rolagem vertical assumiu o toque: as duas voltam juntas e nada troca
    abrir.ontouchcancel = () => {
      if (!toque) return;
      const { lateral } = toque;
      toque = null;
      if (lateral) soltar(0);
    };

    abrir.onclick = () => {
      if (ignorarClique) { ignorarClique = false; return; }
      abrirTela(produto, indice(), abrir);
    };

    sincronizarCard[id] = irPara;
    marcar();
    return pontos;
  }

  /* ---- tela cheia ----
     Um <dialog> só, reaproveitado. Renderiza a foto atual e pré-carrega só a
     vizinha de cada lado, o resto entra no arrasto. */

  const tela = $('tela');
  let telaFoto = $('tela-foto');
  const quadro = $('tela-quadro');
  let galeria = { produto: null, i: 0, origem: null };

  function pintarTela() {
    const fotos = galeria.produto.fotos;
    const f = fotos[galeria.i];
    telaFoto.src = caminhoGaleria(f);
    telaFoto.alt = f.alt;
    $('tela-nome').textContent = galeria.produto.nome;
    $('tela-conta').textContent = fotos.length > 1 ? (galeria.i + 1) + ' de ' + fotos.length : '';

    const pontos = $('tela-pontos');
    pontos.textContent = '';
    // até sete fotos, pontos clicáveis de 44px como no card; acima, só o contador
    if (fotos.length > 1 && fotos.length <= MAX_PONTOS) {
      fotos.forEach((_, j) => {
        const b = el('button', 'tela-ponto');
        b.type = 'button';
        b.setAttribute('aria-label', 'Foto ' + (j + 1) + ' de ' + fotos.length);
        if (j === galeria.i) b.setAttribute('aria-current', 'true');
        b.onclick = () => { galeria.i = j; pintarTela(); };
        pontos.append(b);
      });
    }
    const conta = $('tela-conta');
    conta.hidden = fotos.length < 2;
    conta.setAttribute('aria-label', 'Foto ' + (galeria.i + 1) + ' de ' + fotos.length + '. Voltar pra primeira');
    $('tela-ant').hidden = $('tela-prox').hidden = fotos.length < 2;

    [galeria.i - 1, galeria.i + 1].forEach(j => {
      if (fotos[j]) { const pre = new Image(); pre.src = caminhoGaleria(fotos[j]); }
    });
  }

  // tocar no "3 de 13" volta pra primeira: treze arrastos pra voltar é o mesmo problema dos 350 toques
  $('tela-conta').onclick = () => { if (galeria.produto && galeria.i !== 0) { galeria.i = 0; pintarTela(); } };

  function abrirTela(produto, i, origem) {
    galeria = { produto, i, origem };
    pintarTela();
    tela.showModal();
    // o voltar do navegador fecha a tela em vez de sair do site
    history.pushState({ tela: true }, '');
  }
  window.onpopstate = () => { if (tela.open) tela.close(); };
  // recarregou com a entrada da tela no histórico: limpa, senão o próximo voltar não anda
  if (history.state && history.state.tela) history.replaceState(null, '');

  function trocarFoto(delta) {
    const n = galeria.produto.fotos.length;
    if (n < 2) return;
    galeria.i = (galeria.i + delta + n) % n;
    pintarTela();
  }

  $('tela-fechar').onclick = () => tela.close();
  $('tela-ant').onclick = () => trocarFoto(-1);
  $('tela-prox').onclick = () => trocarFoto(1);

  tela.onclose = () => {
    // gesto pela metade quando fechou: a vizinha some e o trilho zera
    if (vizinhaTela) { vizinhaTela.remove(); vizinhaTela = null; }
    animandoTela = false;
    ladoTela = 0;
    quadro.classList.remove('tela-quadro--solta');
    moverTela('0px');
    telaFoto.removeAttribute('src');
    // o card acompanha a foto onde a pessoa parou
    if (galeria.produto && sincronizarCard[galeria.produto.id]) sincronizarCard[galeria.produto.id](galeria.i);
    if (galeria.origem) galeria.origem.focus();
    // fechou pelo X, Esc ou arrasto: consome a entrada que abrir empilhou
    if (history.state && history.state.tela) history.back();
  };

  tela.onkeydown = e => {
    if (e.key === 'ArrowRight') trocarFoto(1);
    if (e.key === 'ArrowLeft') trocarFoto(-1);
  };

  // arrasto: de lado a foto acompanha o dedo e a vizinha entra pela borda,
  // como no card; pra baixo fecha; pinça fica com o sistema. Em repouso o
  // quadro tem um <img> só; durante o gesto, dois.
  let toqueTela = null;
  let vizinhaTela = null;
  let ladoTela = 0;
  let animandoTela = false;
  const moverTela = dx => quadro.style.setProperty('--dx', dx);

  function vizinhaPorLado(l) {
    if (vizinhaTela && ladoTela === l) return;
    if (vizinhaTela) vizinhaTela.remove();
    ladoTela = l;
    const fotos = galeria.produto.fotos;
    const f = fotos[(galeria.i + l + fotos.length) % fotos.length];
    vizinhaTela = el('img', 'tela-foto tela-foto--vizinha');
    vizinhaTela.src = caminhoGaleria(f);
    vizinhaTela.alt = f.alt;
    vizinhaTela.style.setProperty('--lado', String(l));
    quadro.append(vizinhaTela);
  }

  // fim da animação: a vizinha vira a foto da tela, ou some
  function terminarTela(concluiu) {
    if (!animandoTela) return;
    animandoTela = false;
    quadro.classList.remove('tela-quadro--solta');
    if (concluiu) {
      const fotos = galeria.produto.fotos;
      galeria.i = (galeria.i + ladoTela + fotos.length) % fotos.length;
      vizinhaTela.classList.remove('tela-foto--vizinha');
      vizinhaTela.style.removeProperty('--lado');
      telaFoto.remove();
      telaFoto = vizinhaTela;
      telaFoto.id = 'tela-foto';
    } else {
      vizinhaTela.remove();
    }
    vizinhaTela = null;
    ladoTela = 0;
    moverTela('0px');
    if (concluiu) pintarTela();
  }

  function soltarTela(dx) {
    if (!vizinhaTela) { moverTela('0px'); return; }
    const concluiu = Math.abs(dx) >= LIMIAR_ARRASTO;
    animandoTela = true;
    quadro.classList.add('tela-quadro--solta');
    // aqui o trilho anda a largura do quadro, não a da foto, que pode ser mais estreita
    const largura = quadro.clientWidth || 0;
    moverTela(concluiu ? (ladoTela > 0 ? -largura : largura) + 'px' : '0px');
    vizinhaTela.ontransitionend = () => terminarTela(concluiu);
    setTimeout(() => terminarTela(concluiu), 260);
  }

  tela.ontouchstart = e => {
    if (animandoTela) { toqueTela = null; return; }
    toqueTela = e.touches.length === 1 ? { x: e.touches[0].clientX, y: e.touches[0].clientY, dx: 0, dy: 0, lateral: false } : null;
  };
  tela.ontouchmove = e => {
    if (!toqueTela) return;
    const dx = e.touches[0].clientX - toqueTela.x;
    const dy = e.touches[0].clientY - toqueTela.y;
    toqueTela.dx = dx;
    toqueTela.dy = dy;
    if (!toqueTela.lateral) {
      if (Math.abs(dx) < 10 || Math.abs(dx) <= Math.abs(dy) || galeria.produto.fotos.length < 2) return;
      toqueTela.lateral = true;
    }
    if (dx !== 0) vizinhaPorLado(dx < 0 ? 1 : -1);
    moverTela(dx + 'px');
  };
  tela.ontouchend = () => {
    if (!toqueTela) return;
    const { dx, dy, lateral } = toqueTela;
    toqueTela = null;
    if (lateral) soltarTela(dx);
    else if (dy > 80 && dy > Math.abs(dx)) tela.close();
  };
  tela.ontouchcancel = () => {
    if (toqueTela && toqueTela.lateral) soltarTela(0);
    toqueTela = null;
  };

  /* ---- cards ---- */

  // "Por unidade." no normal, "Por torre." na Torre, mais o mínimo quando tem
  function regraDeVenda(produto) {
    const un = produto.unidade || 'unidade';
    const min = minimoDe(produto);
    return min > 1
      ? 'Por ' + un + ', pedido mínimo de ' + min + ' ' + plural(un, min) + '.'
      : 'Por ' + un + '.';
  }

  // item com unidade própria tem a quantidade nomeada: "2 torres" e não "2"
  function textoQtd(item) {
    const un = item.produto.unidade;
    const contagem = un ? item.qtd + ' ' + plural(un, item.qtd) : String(item.qtd);
    return contagem + ' x ' + moeda(item.produto.preco);
  }

  function stepper(produto) {
    const wrap = el('div', 'stepper');
    const menos = el('button', 'stepper-botao', '−');
    const qtd = campoQuantidade(produto, () => $('aviso-qtd-' + produto.id));
    const mais = el('button', 'stepper-botao', '+');

    menos.type = mais.type = 'button';
    menos.setAttribute('aria-label', 'Tirar de ' + produto.nome);
    mais.setAttribute('aria-label', 'Somar em ' + produto.nome);
    qtd.id = 'qtd-' + produto.id;
    mais.id = 'mais-' + produto.id;

    menos.onclick = () => mudar(produto.id, -1);
    mais.onclick = () => mudar(produto.id, 1);

    wrap.append(menos, qtd, mais);
    return wrap;
  }

  // o número escrevível, como na comanda: o mesmo campo no card e na linha do
  // resumo, com as mesmas regras (teclado numérico, só dígito, quatro no máximo
  // ou dois em quem conta pacote, mínimo com aviso, vazio ou zero sai). Uma
  // fonte de verdade: quantidades, por definir().
  let campoAtivo = null;
  function campoQuantidade(produto, avisoDe) {
    const qtd = el('input', 'stepper-qtd');
    qtd.type = 'text';
    qtd.inputMode = 'numeric';
    qtd.setAttribute('pattern', '[0-9]*');
    qtd.setAttribute('maxlength', tetoDe(produto));
    qtd.setAttribute('autocomplete', 'off');
    qtd.setAttribute('aria-label', 'Quantidade de ' + produto.nome);
    qtd.value = String(quantidades[produto.id] || 0);
    ajustarLargura(qtd);

    // ao tocar, o número já vem selecionado: digitar substitui em vez de emendar.
    // Guarda o que havia, porque Esc volta pra isso mesmo que já tenha valido na hora
    let antesDeEditar = 0;
    qtd.onfocus = () => { antesDeEditar = quantidades[produto.id] || 0; campoAtivo = qtd; setTimeout(() => qtd.select(), 0); };
    // o que já é válido vale na hora, sem esperar sair do campo; o resto espera
    qtd.oninput = () => {
      qtd.value = qtd.value.replace(/\D/g, '').slice(0, tetoDe(produto));
      ajustarLargura(qtd);
      esconderAviso(produto.id);
      const n = Number(qtd.value);
      if (qtd.value && n >= minimoDe(produto)) definir(produto.id, n, false);
    };
    qtd.onkeydown = e => {
      if (e.key === 'Enter') qtd.blur();
      if (e.key === 'Escape') { qtd.value = String(antesDeEditar); qtd.blur(); }
    };
    // saiu do campo: vazio ou zero sai do pedido, abaixo do mínimo fica no mínimo
    qtd.onblur = () => {
      campoAtivo = null;
      const n = Number(qtd.value.replace(/\D/g, '')) || 0;
      const min = minimoDe(produto);
      const curto = n > 0 && n < min;
      definir(produto.id, curto ? min : n, true);
      if (curto) avisarMinimo(produto, avisoDe());
    };
    return qtd;
  }

  // quantos dígitos cabem: quatro no normal, dois em quem conta pacote
  const tetoDe = p => (p.unidade ? 2 : 4);

  // a largura do campo acompanha os dígitos
  function ajustarLargura(campo) {
    campo.style.width = 'calc(' + Math.max(2, campo.value.length) + 'ch + 10px)';
  }

  // fixa a quantidade: zero tira do pedido e a pílula volta a "Adicionar"
  function definir(id, n, pintar) {
    if (n === 0) delete quantidades[id];
    else quantidades[id] = n;
    if (pintar) {
      const campo = $('qtd-' + id);
      campo.value = String(n);
      ajustarLargura(campo);
    }
    $('acao-' + id).classList.toggle('acao--aberta', n > 0);
    atualizar();
  }

  // "O mínimo é 25, deixei 25.", com o número do produto, por três segundos
  const avisos = {};
  function avisarMinimo(produto, aviso) {
    const min = minimoDe(produto);
    if (!aviso) return;
    aviso.textContent = 'O mínimo é ' + min + ', deixei ' + min + '.';
    aviso.hidden = false;
    clearTimeout(avisos[produto.id]);
    avisos[produto.id] = setTimeout(() => { aviso.hidden = true; }, 3000);
  }
  function esconderAviso(id) {
    const aviso = $('aviso-qtd-' + id);
    if (aviso) aviso.hidden = true;
    if (linhasResumo[id] && linhasResumo[id].aviso) linhasResumo[id].aviso.hidden = true;
  }
  function avisoQtd(produto) {
    const p = el('p', 'stepper-aviso');
    p.id = 'aviso-qtd-' + produto.id;
    p.setAttribute('role', 'status');
    p.hidden = true;
    return p;
  }

  // "Adicionar" entra; quando a quantidade passa de zero ele vira o contador
  function acao(produto) {
    const wrap = el('div', 'acao');
    wrap.id = 'acao-' + produto.id;
    const add = el('button', 'adicionar', 'Adicionar');
    add.type = 'button';
    add.id = 'adicionar-' + produto.id;
    add.setAttribute('aria-label', 'Adicionar ' + produto.nome);
    add.onclick = () => mudar(produto.id, 1);
    wrap.append(add, stepper(produto));
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

  function card(produto, primeira) {
    const li = el('li', 'produto');
    li.id = 'produto-' + produto.id;
    const corpo = el('div', 'produto-corpo');

    corpo.append(el('h3', 'produto-nome', produto.nome));
    if (produto.descricao) corpo.append(el('p', 'produto-desc', produto.descricao));

    if (ehOrcamento(produto)) {
      li.className = 'produto produto--orcamento';
      const linha = el('div', 'produto-linha');
      linha.append(el('p', 'preco preco--sob', 'Sob orçamento'), marcarOrcamento(produto));
      corpo.append(linha);
    } else if (temPreco(produto)) {
      const linha = el('div', 'produto-linha');
      linha.append(precoEl(produto.preco), acao(produto));
      corpo.append(linha, avisoQtd(produto));
      // no kit o preço é do kit inteiro, não cabe "por unidade"
      if (produto.categoria !== 'kit') corpo.append(el('p', 'produto-regra', regraDeVenda(produto)));
    } else {
      // sem preço: card sem valor e sem contador
      li.className = 'produto produto--sem-preco';
    }

    li.append(foto(produto, primeira), corpo);
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

    esconderAviso(id);
    definir(id, novo, true);
    // o botão tocado some: ao abrir o foco vai pro "+", ao fechar volta pro "Adicionar"
    // (sem rolar a página, e sem cair no campo, que abriria o teclado)
    if (delta > 0 && atual === 0) $('mais-' + id).focus({ preventScroll: true });
    if (delta < 0 && novo === 0) $('adicionar-' + id).focus({ preventScroll: true });
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

  /* ---- o resumo é a comanda ----
     Cada linha reaproveita o mesmo <li> enquanto o produto estiver no pedido,
     senão digitar no campo da linha apagaria o próprio campo a cada tecla. Quem
     foi tirado fica riscado, com "voltar", enquanto o resumo estiver na tela:
     some quando a linha rola pra fora ou quando o pedido é enviado. */

  const riscadas = {};       // id do produto -> { qtd } ou { orcamento: true }
  const linhasResumo = {};   // id do produto -> li

  function pintarResumo(itens) {
    const resumo = $('resumo');
    const porId = {};
    itens.forEach(i => { porId[i.produto.id] = i; });
    const ordem = [];
    PRODUTOS.forEach(p => {
      const item = porId[p.id];
      const tipo = item ? 'item' : (p.id === SOB_ORCAMENTO && querOrcamento) ? 'orcamento' : riscadas[p.id] ? 'riscada' : null;
      if (!tipo) return;
      let li = linhasResumo[p.id];
      if (li && li.tipo !== tipo) { li.remove(); li = null; }
      if (!li) {
        li = tipo === 'item' ? linhaItem(p) : tipo === 'orcamento' ? linhaOrcamento(p) : linhaRiscada(p);
        li.tipo = tipo;
        li.idProduto = p.id;
        linhasResumo[p.id] = li;
      }
      if (tipo === 'item') {
        li.sub.textContent = moeda(item.subtotal);
        li.vezes.textContent = (p.unidade ? ' ' + plural(p.unidade, item.qtd) : '') + ' x ' + moeda(p.preco);
        // quem está digitando na linha não tem o campo reescrito por baixo dos dedos
        if (li.campo !== campoAtivo) { li.campo.value = String(item.qtd); ajustarLargura(li.campo); }
      }
      ordem.push(li);
    });
    Object.keys(linhasResumo).forEach(id => {
      if (!ordem.includes(linhasResumo[id])) { linhasResumo[id].remove(); delete linhasResumo[id]; }
    });
    // só remonta a lista quando a ordem mudou, pra não tirar o foco de quem digita
    const atual = resumo.children;
    const igual = atual.length === ordem.length && ordem.every((li, k) => atual[k] === li);
    if (!igual) { resumo.textContent = ''; ordem.forEach(li => resumo.append(li)); }
    // a linha riscada só é vigiada depois de estar na página
    ordem.forEach(li => { if (li.tipo === 'riscada' && !li.vigiada) { li.vigiada = true; observarSaida(li, li.idProduto); } });
  }

  function linhaItem(p) {
    const li = el('li', 'resumo-linha');
    const nome = el('a', 'resumo-nome', p.nome);
    nome.href = '#produto-' + p.id;
    const qtd = el('span', 'resumo-qtd');
    const campo = campoQuantidade(p, () => li.aviso);
    campo.classList.add('resumo-campo');
    const vezes = el('span', 'resumo-vezes');
    qtd.append(campo, vezes);
    const sub = el('span', 'resumo-sub');
    const tirar = el('button', 'resumo-tirar', 'tirar');
    tirar.type = 'button';
    tirar.setAttribute('aria-label', 'Tirar ' + p.nome + ' do pedido');
    tirar.onclick = () => riscar(p.id);
    const aviso = el('p', 'stepper-aviso resumo-aviso');
    aviso.setAttribute('role', 'status');
    aviso.hidden = true;
    li.append(nome, sub, qtd, tirar, aviso);
    li.campo = campo; li.vezes = vezes; li.sub = sub; li.aviso = aviso;
    return li;
  }

  function linhaOrcamento(p) {
    const li = el('li', 'resumo-linha resumo-linha--orcamento');
    const nome = el('a', 'resumo-nome', p.nome);
    nome.href = '#produto-' + p.id;
    const tirar = el('button', 'resumo-tirar', 'tirar');
    tirar.type = 'button';
    tirar.setAttribute('aria-label', 'Tirar o orçamento de ' + p.nome + ' do pedido');
    tirar.onclick = () => riscar(p.id);
    li.append(nome, el('span', 'resumo-sub', 'fora do total'), el('span', 'resumo-qtd', 'sob orçamento'), tirar);
    return li;
  }

  // riscada como na comanda de papel: fica no lugar, com "voltar"
  function linhaRiscada(p) {
    const li = el('li', 'resumo-linha resumo-linha--riscada');
    const voltar = el('button', 'resumo-voltar', 'voltar');
    voltar.type = 'button';
    voltar.setAttribute('aria-label', 'Voltar com ' + p.nome + ' pro pedido');
    voltar.onclick = () => desriscar(p.id);
    li.append(el('span', 'resumo-nome', p.nome), el('span', 'resumo-qtd', 'tirei.'), voltar);
    return li;
  }

  // a linha riscada some quando rola pra fora da tela (sem relógio: a pessoa
  // olha o total, confere, decide, e isso não tem prazo)
  function observarSaida(li, id) {
    if (typeof IntersectionObserver === 'undefined') return;
    // só some depois de ter sido vista: a linha pode nascer fora da tela (tirada
    // por um toque na beirada, ou a lista remontou) e nesse caso espera a pessoa
    // chegar nela e depois sair
    let vista = false;
    const io = new IntersectionObserver(entradas => {
      entradas.forEach(e => {
        if (e.isIntersecting) { vista = true; return; }
        if (vista && riscadas[id]) { io.disconnect(); esquecer(id); }
      });
    });
    io.observe(li);
  }

  function riscar(id) {
    if (id === SOB_ORCAMENTO) {
      riscadas[id] = { orcamento: true };
      querOrcamento = false;
      $('orcamento-' + id).checked = false;
      atualizar();
      return;
    }
    riscadas[id] = { qtd: quantidades[id] || 0 };
    definir(id, 0, true);
  }
  function desriscar(id) {
    const r = riscadas[id];
    delete riscadas[id];
    if (!r) return;
    if (r.orcamento) { querOrcamento = true; $('orcamento-' + id).checked = true; atualizar(); return; }
    definir(id, r.qtd, true);
  }
  function esquecer(id) { delete riscadas[id]; atualizar(); }
  function esquecerTudo() { Object.keys(riscadas).forEach(id => delete riscadas[id]); atualizar(); }

  function atualizar() {
    const itens = itensEscolhidos();
    const total = somar(itens);
    // as linhas riscadas seguram o resumo aberto, senão "voltar" some junto com o último item
    const temAlgo = itens.length > 0 || querOrcamento || Object.keys(riscadas).length > 0;

    $('pedido-vazio').hidden = temAlgo;
    $('pedido-conteudo').hidden = !temAlgo;

    pintarResumo(itens);

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
    // só orçamento: sem valor na pílula, senão R$ 0,00 parece grátis
    $('barra-total').hidden = total === 0;
    caixa.hidden = false;
  }

  function mensagem(dataFesta, observacao) {
    const itens = itensEscolhidos();
    const total = somar(itens);
    const linhas = ['Oi, Emilly! Vim pelo site.', ''];

    linhas.push('Data da festa: ' + dataBR(dataFesta));
    linhas.push('Já sei que é retirada, você não faz entrega.');

    // abaixo do prazo ideal: sinaliza e pergunta disponibilidade
    if (foraDoPrazo(dataFesta)) {
      linhas.push('Atenção: ' + fraseDoPrazo(diasAte(dataFesta)) + ' Você consegue confirmar se tem disponibilidade?');
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

  /* ---- bolos: tabela e caminho pra conversa, sem contador ---- */

  function montarBolos() {
    // a foto da seção: o mesmo carrossel do card, sem nome nem preço embaixo
    if (BOLOS.fotos && BOLOS.fotos.length) {
      $('bolos-foto').append(foto({ id: 'bolos', nome: 'Bolos', fotos: BOLOS.fotos }, false));
    }

    const linhas = $('bolos-linhas');
    BOLOS.linhas.forEach(b => {
      const tr = el('tr');
      const th = el('th', null, b.tipo);
      th.setAttribute('scope', 'row');
      const td = el('td');
      td.append(precoEl(b.precoKg));
      tr.append(th, td, el('td', null, b.sabores));
      linhas.append(tr);
    });

    $('bolos-topo').textContent = BOLOS.topo;
    $('bolos-extras').textContent = BOLOS.extras;
    $('bolos-corte').textContent = BOLOS.corte;

    const rend = $('bolos-rendimento');
    BOLOS.rendimento.forEach(r => {
      const tr = el('tr');
      const th = el('th', null, r.kg + ' kg');
      th.setAttribute('scope', 'row');
      tr.append(th, el('td', null, 'em torno de ' + r.fatias + ' fatias'));
      rend.append(tr);
    });
  }

  /* ---- monta tudo ---- */

  const avulsos = $('lista-avulsos');
  const kits = $('lista-kits');
  PRODUTOS.forEach((p, i) => (p.categoria === 'kit' ? kits : avulsos).append(card(p, i === 0)));
  montarBolos();

  const form = $('form-pedido');
  const campoData = $('data-festa');
  const erroData = $('erro-data');
  const erroMinimo = $('erro-minimo');
  const avisoPrazo = $('aviso-prazo');

  // só bloqueia data que já passou; prazo curto é aviso, não trava
  campoData.min = hoje();

  // data passada é conferida na hora da escolha, não só no envio: o seletor do
  // iOS ignora o min (WebKit 225639), então a pessoa consegue marcar ontem e
  // precisa ver o erro ali mesmo. Android e desktop travam no seletor.
  const dataPassada = () => Boolean(campoData.value) && campoData.value < hoje();
  campoData.oninput = () => {
    if (dataPassada()) {
      erroData.textContent = 'Essa data já passou. Confere a data da festa.';
      erroData.hidden = false;
      campoData.setAttribute('aria-invalid', 'true');
      avisoPrazo.hidden = true;
      return;
    }
    erroData.hidden = true;
    campoData.removeAttribute('aria-invalid');
    avisoPrazo.hidden = !foraDoPrazo(campoData.value);
  };
  campoData.onchange = campoData.oninput;

  // o maxlength do campo já corta em LIMITE_OBS. o contador só aparece
  // perto do fim, pra não ficar barulhento enquanto sobra espaço
  const campoObs = $('obs');
  const contadorObs = $('obs-contador');

  campoObs.oninput = () => {
    const faltam = LIMITE_OBS - campoObs.value.length;
    contadorObs.hidden = campoObs.value.length < AVISA_OBS;
    contadorObs.textContent = faltam === 1
      ? 'falta 1 caractere'
      : 'faltam ' + faltam + ' caracteres';
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

    // sem data, ou data que já passou: o min trava o seletor, mas data digitada passa por ele
    if (!campoData.value || dataPassada()) {
      erroData.textContent = campoData.value
        ? 'Essa data já passou. Confere a data da festa.'
        : 'Informe a data da festa para enviar o pedido.';
      erroData.hidden = false;
      campoData.setAttribute('aria-invalid', 'true');
      campoData.focus();
      return;
    }

    // alguns navegadores devolvem \r\n do textarea, e o \r vira quebra
    // sobrando na mensagem da WhatsApp. o slice é cinto e suspensório,
    // caso o maxlength seja contornado
    const obs = campoObs.value.replace(/\r\n/g, '\n').trim().slice(0, LIMITE_OBS);
    window.open(link(mensagem(campoData.value, obs)), '_blank');
    esquecerTudo();
  };

  atualizar();
})();
