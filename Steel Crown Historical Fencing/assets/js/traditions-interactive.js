(function () {
  'use strict';

  var TRADITIONS = [
    { name: 'Italian Armizare',                     shortName: 'Armizare',           year: 1405, steelCrown: true  },
    { name: 'The German Kunst des Fechtens',         shortName: 'Kunst des Fechtens', year: 1450, steelCrown: false },
    { name: 'The Italian Tradition of Filippo Vadi', shortName: 'Filippo Vadi',       year: 1485, steelCrown: false },
    { name: 'Joachim Meyer',                         shortName: 'Joachim Meyer',      year: 1570, steelCrown: false },
    { name: 'Iberian Longsword',                     shortName: 'Iberian',            year: 1590, steelCrown: true  }
  ];

  var TIMELINE_START = 1380;
  var TIMELINE_END   = 1620;
  var lastUrl        = null;
  var initTimer      = null;

  function pct(year) {
    return ((year - TIMELINE_START) / (TIMELINE_END - TIMELINE_START) * 100).toFixed(2) + '%';
  }

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

  function buildTimeline(article, cards) {
    var wrapper = document.createElement('div');
    wrapper.className = 'traditions-timeline';

    var startYr = document.createElement('span');
    startYr.className = 'traditions-timeline-year';
    startYr.textContent = TIMELINE_START;

    var track = document.createElement('div');
    track.className = 'traditions-timeline-track';

    var endYr = document.createElement('span');
    endYr.className = 'traditions-timeline-year';
    endYr.textContent = TIMELINE_END;

    cards.forEach(function (item) {
      var t = item.tradition;
      var marker = document.createElement('div');
      marker.className = 'traditions-timeline-marker' +
        (t.steelCrown ? ' traditions-timeline-marker--featured' : '');
      marker.style.left = pct(t.year);

      var label   = document.createElement('div');
      label.className = 'traditions-timeline-label';
      label.textContent = t.shortName;

      var dot = document.createElement('div');
      dot.className = 'traditions-timeline-dot';

      var yearTag = document.createElement('div');
      yearTag.className = 'traditions-timeline-year-tag';
      yearTag.textContent = t.year;

      marker.appendChild(label);
      marker.appendChild(dot);
      marker.appendChild(yearTag);

      marker.addEventListener('click', function () {
        if (!item.card.classList.contains('open')) openBody(item.card, item.body);
        setTimeout(function () {
          item.card.scrollIntoView({ behavior: 'smooth', block: 'start' });
          item.card.classList.add('pulse');
          setTimeout(function () { item.card.classList.remove('pulse'); }, 1150);
        }, 50);
      });

      track.appendChild(marker);
    });

    wrapper.appendChild(startYr);
    wrapper.appendChild(track);
    wrapper.appendChild(endYr);
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
