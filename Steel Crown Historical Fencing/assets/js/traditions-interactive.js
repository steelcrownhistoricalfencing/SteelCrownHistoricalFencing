(function () {
  'use strict';

  // Text-safe variants of each tradition's hue — darkened for light mode,
  // lightened for dark mode — so author names colored with these still
  // clear 4.5:1 contrast as body text (the brighter dot/accent hues do not).
  var TRADITIONS = [
    {
      label: 'Italian Armizare',
      steelCrown: true,
      colorLight: '#2873ce',
      colorDark: '#3b83d9',
      authors: [
        { name: 'Fiore dei Liberi', year: 'c. 1410', sortYear: 1410 }
      ]
    },
    {
      label: 'Kunst des Fechtens',
      steelCrown: false,
      colorLight: '#de2a29',
      colorDark: '#e44d4c',
      authors: [
        { name: 'Johannes Liechtenauer', year: 'c. 1389', sortYear: 1389 },
        { name: 'Sigmund Ringeck', year: 'c. 1440', sortYear: 1440 },
        { name: 'Peter von Danzig', year: '1452', sortYear: 1452 },
        { name: 'Hans Talhoffer', year: '1467', sortYear: 1467 }
      ]
    },
    {
      label: 'Filippo Vadi',
      steelCrown: false,
      colorLight: '#14835b',
      colorDark: '#1cb37d',
      authors: [
        { name: 'Filippo Vadi', year: '1482–1487', sortYear: 1482 }
      ]
    },
    {
      label: 'Joachim Meyer',
      steelCrown: false,
      colorLight: '#4839a3',
      colorDark: '#8477d0',
      authors: [
        { name: 'Joachim Meyer', year: '1570', sortYear: 1570 }
      ]
    },
    {
      label: 'Iberian Longsword',
      steelCrown: true,
      colorLight: '#007e00',
      colorDark: '#009700',
      authors: [
        { name: 'Domingo Luis Godinho', year: 'c. 1599', sortYear: 1599 },
        { name: 'Diogo Gomes de Figueyredo', year: '1651', sortYear: 1651 }
      ]
    }
  ];

  function flattenAuthors(cards) {
    var flat = [];
    cards.forEach(function (item) {
      item.tradition.authors.forEach(function (author) {
        flat.push({ item: item, tradition: item.tradition, author: author });
      });
    });
    flat.sort(function (a, b) { return a.author.sortYear - b.author.sortYear; });
    return flat;
  }

  var lastUrl   = null;
  var initTimer = null;

  function openBody(card, body) {
    card.classList.add('open');
    body.classList.add('open');
    body.style.maxHeight = body.scrollHeight + 'px';
    body.addEventListener('transitionend', function onEnd() {
      if (card.classList.contains('open')) body.style.maxHeight = 'none';
      body.removeEventListener('transitionend', onEnd);
    });
  }

  function closeBody(card, body) {
    body.style.maxHeight = body.scrollHeight + 'px';
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        card.classList.remove('open');
        body.classList.remove('open');
        body.style.maxHeight = '0';
      });
    });
  }

  function buildCards(article) {
    var allH2s = Array.from(article.querySelectorAll('h2'));
    var h2s = allH2s.slice(0, 5);
    if (h2s.length < 5) return [];

    var cards = [];

    h2s.forEach(function (h2, i) {
      var tradition = TRADITIONS[i];

      var contentEls = [];
      var trailingHr = null;
      var el = h2.nextElementSibling;
      while (el && el.tagName !== 'H2') {
        if (el.tagName === 'HR') { trailingHr = el; break; }
        contentEls.push(el);
        el = el.nextElementSibling;
      }

      var card   = document.createElement('div');
      card.className = 'tradition-card';
      card.id = 'tradition-' + i;

      var header = document.createElement('div');
      header.className = 'tradition-card-header';

      var chevron = document.createElement('span');
      chevron.className = 'tradition-card-chevron';
      chevron.setAttribute('aria-hidden', 'true');
      chevron.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><polyline points="2,5 8,11 14,5" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';

      h2.parentNode.insertBefore(card, h2);
      header.appendChild(h2);
      header.appendChild(chevron);
      card.appendChild(header);

      var body = document.createElement('div');
      body.className = 'tradition-card-body';
      contentEls.forEach(function (node) { body.appendChild(node); });
      card.appendChild(body);

      if (trailingHr) trailingHr.style.display = 'none';

      if (tradition.steelCrown) {
        card.classList.add('open');
        body.classList.add('open');
        body.style.maxHeight = 'none';
      }

      header.addEventListener('click', function () {
        if (card.classList.contains('open')) closeBody(card, body);
        else openBody(card, body);
      });

      cards.push({ card: card, body: body, tradition: tradition });
    });

    return cards;
  }

  function jumpToCard(item) {
    if (!item.card.classList.contains('open')) openBody(item.card, item.body);
    setTimeout(function () {
      item.card.scrollIntoView({ behavior: 'smooth', block: 'start' });
      item.card.classList.add('pulse');
      setTimeout(function () { item.card.classList.remove('pulse'); }, 1150);
    }, 50);
  }

  function earliestYear(tradition) {
    return Math.min.apply(null, tradition.authors.map(function (a) { return a.sortYear; }));
  }

  function buildLegend(article, cards) {
    var legend = document.createElement('div');
    legend.className = 'traditions-timeline-legend';

    var ordered = cards.slice().sort(function (a, b) {
      return earliestYear(a.tradition) - earliestYear(b.tradition);
    });

    ordered.forEach(function (item) {
      var t = item.tradition;

      var chip = document.createElement('span');
      chip.className = 'traditions-timeline-legend-item';
      chip.style.setProperty('--entry-color-light', t.colorLight);
      chip.style.setProperty('--entry-color-dark', t.colorDark);
      chip.setAttribute('tabindex', '0');
      chip.setAttribute('role', 'button');

      var dot = document.createElement('span');
      dot.className = 'traditions-timeline-legend-dot';

      var label = document.createElement('span');
      label.className = 'traditions-timeline-legend-label';
      label.textContent = t.label;

      chip.appendChild(dot);
      chip.appendChild(label);

      chip.addEventListener('click', function () { jumpToCard(item); });
      chip.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          jumpToCard(item);
        }
      });

      legend.appendChild(chip);
    });

    article.insertBefore(legend, cards[0].card);
    return legend;
  }

  function decadeLabel(year, direction) {
    var decade = direction === 'floor' ? Math.floor(year / 10) * 10 : Math.ceil(year / 10) * 10;
    return decade + 's';
  }

  function buildTimeline(article, cards) {
    var wrapper = document.createElement('div');
    wrapper.className = 'traditions-timeline';

    var flat = flattenAuthors(cards);
    var years = flat.map(function (e) { return e.author.sortYear; });

    var startEdge = document.createElement('div');
    startEdge.className = 'traditions-timeline-edge';
    startEdge.textContent = decadeLabel(Math.min.apply(null, years), 'floor');
    wrapper.appendChild(startEdge);

    flat.forEach(function (entry, i) {
      var t      = entry.tradition;
      var author = entry.author;
      var side   = i % 2 === 0 ? 'right' : 'left';

      var row = document.createElement('div');
      row.className = 'traditions-timeline-entry traditions-timeline-entry--' + side +
        (t.steelCrown ? ' traditions-timeline-entry--featured' : '');
      row.style.setProperty('--entry-color-light', t.colorLight);
      row.style.setProperty('--entry-color-dark', t.colorDark);
      row.setAttribute('tabindex', '0');
      row.setAttribute('role', 'button');
      row.title = author.name + ' — ' + t.label;
      row.setAttribute('aria-label', author.name + ', ' + author.year + ' — ' + t.label);

      var dot = document.createElement('div');
      dot.className = 'traditions-timeline-entry-dot';

      var content = document.createElement('div');
      content.className = 'traditions-timeline-entry-content';

      var year = document.createElement('span');
      year.className = 'traditions-timeline-entry-year';
      year.textContent = author.year;

      var name = document.createElement('span');
      name.className = 'traditions-timeline-entry-name';
      name.textContent = author.name;

      content.appendChild(year);
      content.appendChild(name);

      row.appendChild(dot);
      row.appendChild(content);

      row.addEventListener('click', function () { jumpToCard(entry.item); });
      row.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          jumpToCard(entry.item);
        }
      });

      wrapper.appendChild(row);
    });

    var endEdge = document.createElement('div');
    endEdge.className = 'traditions-timeline-edge';
    endEdge.textContent = decadeLabel(Math.max.apply(null, years), 'ceil');
    wrapper.appendChild(endEdge);

    article.insertBefore(wrapper, cards[0].card);
  }

  function buildToggle(article, cards) {
    var allOpen = false;
    var btn = document.createElement('button');
    btn.className = 'traditions-expand-toggle';
    btn.textContent = 'Expand All';

    btn.addEventListener('click', function () {
      allOpen = !allOpen;
      btn.textContent = allOpen ? 'Collapse All' : 'Expand All';
      cards.forEach(function (item) {
        if (allOpen && !item.card.classList.contains('open')) openBody(item.card, item.body);
        else if (!allOpen && item.card.classList.contains('open')) closeBody(item.card, item.body);
      });
    });

    article.insertBefore(btn, cards[0].card);
  }

  function init() {
    var url = window.location.href;
    if (url === lastUrl) return;

    if (!document.title.includes('Longsword Traditions')) {
      lastUrl = url;
      return;
    }

    // Try multiple selectors — Material wraps content in article.md-content__inner
    var article = document.querySelector('.md-content article') ||
                  document.querySelector('article.md-content__inner') ||
                  document.querySelector('article.md-typeset');
    if (!article) return;
    if (article.querySelector('.tradition-card')) return; // already done

    var cards = buildCards(article);
    if (!cards.length) return;

    lastUrl = url;
    buildLegend(article, cards);
    buildTimeline(article, cards);
    buildToggle(article, cards);
  }

  function scheduleInit() {
    clearTimeout(initTimer);
    lastUrl = null; // force re-check on next init
    initTimer = setTimeout(init, 150);
  }

  // ── Initialization hooks ────────────────────────────────────────────────
  // 1. Immediate: script runs at bottom of body so DOM is already parsed.
  //    Use setTimeout(0) to yield to any remaining synchronous work first.
  setTimeout(init, 0);

  // 2. DOMContentLoaded: fires after all synchronous scripts complete,
  //    catches the case where readyState was still 'loading' above.
  document.addEventListener('DOMContentLoaded', init);

  // 3. Material instant navigation — observe the content container.
  //    Material replaces article children when loading a new page via XHR.
  //    We wait until the script AND DOM are ready before setting this up.
  function setupObservers() {
    // Watch the content container for article replacement (instant nav)
    var contentEl = document.querySelector('[data-md-component="content"]') ||
                    document.querySelector('.md-content');
    if (contentEl) {
      new MutationObserver(scheduleInit)
        .observe(contentEl, { childList: true, subtree: false });
    }

    // Also watch document.head — Material may swap the <title> element itself
    new MutationObserver(scheduleInit)
      .observe(document.head, { childList: true, subtree: true, characterData: true });

    // popstate covers browser back/forward
    window.addEventListener('popstate', scheduleInit);
  }

  // Set up observers as soon as DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupObservers);
  } else {
    setupObservers();
  }

}());
