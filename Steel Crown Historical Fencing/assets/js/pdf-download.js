var html2pdfLoaded = false;

function loadHtml2Pdf(callback) {
  if (html2pdfLoaded) { callback(); return; }
  var script = document.createElement('script');
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
  script.onload = function () { html2pdfLoaded = true; callback(); };
  document.head.appendChild(script);
}

// Read from pdf-config.js with fallback defaults
function cfg(path, fallback) {
  var parts = path.split('.');
  var val = window.PDF_CONFIG;
  for (var i = 0; i < parts.length; i++) {
    if (val == null || typeof val !== 'object') return fallback;
    val = val[parts[i]];
  }
  return val != null ? val : fallback;
}

function isMaterialsPage() {
  var path = decodeURIComponent(window.location.pathname);
  var roots = ['/Materials', '/Fencing Concepts', '/Historical Longsword Traditions', '/Fiore for HEMA Fencers', '/Montante'];
  if (roots.some(function (r) { return path.indexOf(r) !== -1; })) return true;
  var a = document.querySelector('.md-tabs__link--active')
    || document.querySelector('.md-tabs__item--active .md-tabs__link')
    || document.querySelector('.md-tabs__link[aria-current]');
  return !!(a && a.textContent.trim() === 'Materials');
}

function buildWatermarkDataUrl(url, opacity, callback) {
  var img = new Image();
  img.crossOrigin = 'anonymous';
  img.onload = function () {
    var canvas = document.createElement('canvas');
    canvas.width  = img.naturalWidth;
    canvas.height = img.naturalHeight;
    var ctx = canvas.getContext('2d');
    ctx.globalAlpha = opacity;
    ctx.drawImage(img, 0, 0);
    callback(canvas.toDataURL('image/png'), img.naturalWidth / img.naturalHeight);
  };
  img.onerror = function () { callback(null, 1); };
  img.src = url;
}

function downloadPdf() {
  var btn     = document.querySelector('.pdf-download-btn');
  var article = document.querySelector('.md-content__inner article')
              || document.querySelector('.md-content__inner');
  if (!article) return;

  btn.disabled    = true;
  btn.textContent = 'Generating…';

  loadHtml2Pdf(function () {
    var h1        = document.querySelector('.md-content h1');
    var pageTitle = h1 ? h1.textContent.trim() : document.title;
    var logoUrl   = window.location.origin + '/assets/Logo.png';

    // Hide button in live DOM before canvas capture
    var bar = article.querySelector('.pdf-download-bar');
    if (bar) bar.style.display = 'none';

    var wmEnabled  = cfg('watermark.enabled', true);
    var wmOpacity  = cfg('watermark.opacity', 0.1);
    var wmWidthMm  = cfg('watermark.widthMm', 80);
    var fontSize   = cfg('typography.fontSize', '0.9rem');
    var lineHeight = cfg('typography.lineHeight', '1.6');

    function generate(wmDataUrl, wmAspect) {
      html2pdf()
        .set({
          margin:    cfg('page.margins', [15, 15, 15, 15]),
          filename:  pageTitle + '.pdf',
          image:     { type: 'jpeg', quality: cfg('image.quality', 0.95) },
          pagebreak: { mode: cfg('pageBreak.mode', 'avoid-all') },
          html2canvas: {
            scale:           cfg('image.scale', 2),
            useCORS:         true,
            logging:         false,
            backgroundColor: '#ffffff',
            onclone: function (clonedDoc) {
              var s = clonedDoc.createElement('style');
              s.textContent = [
                '* { transition: none !important; }',
                'html, body, [data-md-color-scheme], [data-md-color-scheme="slate"] {',
                '  --md-default-fg-color:          rgba(0,0,0,0.87) !important;',
                '  --md-default-fg-color--light:   rgba(0,0,0,0.54) !important;',
                '  --md-default-fg-color--lighter: rgba(0,0,0,0.32) !important;',
                '  --md-default-bg-color:          #ffffff !important;',
                '  --md-code-bg-color:             #f5f5f5 !important;',
                '  --md-typeset-color:             rgba(0,0,0,0.87) !important;',
                '}',
                '.md-typeset h1, .md-typeset h2, .md-typeset h3,',
                '.md-typeset h4, .md-typeset h5, .md-typeset h6,',
                'h1, h2, h3, h4, h5, h6 { color: rgba(0,0,0,0.87) !important; }',
                // Typography overrides from config
                '.md-typeset, .md-content article p, .md-content article li {',
                '  font-size: ' + fontSize + ' !important;',
                '  line-height: ' + lineHeight + ' !important;',
                '}',
                '.pdf-download-bar, .md-button { display: none !important; }'
              ].join('\n');
              clonedDoc.head.appendChild(s);
            }
          },
          jsPDF: {
            unit:        'mm',
            format:      cfg('page.format', 'letter'),
            orientation: cfg('page.orientation', 'portrait')
          }
        })
        .from(article)
        .toPdf()
        .get('pdf')
        .then(function (pdf) {
          if (wmEnabled && wmDataUrl) {
            var total = pdf.internal.getNumberOfPages();
            var pw    = pdf.internal.pageSize.getWidth();
            var ph    = pdf.internal.pageSize.getHeight();
            var wmW   = wmWidthMm;
            var wmH   = wmW / wmAspect;
            var x     = (pw - wmW) / 2;
            var y     = (ph - wmH) / 2;
            for (var i = 1; i <= total; i++) {
              pdf.setPage(i);
              pdf.addImage(wmDataUrl, 'PNG', x, y, wmW, wmH);
            }
          }
        })
        .save()
        .then(function () {
          if (bar) bar.style.display = '';
          btn.disabled    = false;
          btn.textContent = 'Download PDF';
        });
    }

    if (wmEnabled) {
      buildWatermarkDataUrl(logoUrl, wmOpacity, generate);
    } else {
      generate(null, 1);
    }
  });
}

function initPdfButton() {
  if (!isMaterialsPage()) return;

  var article = document.querySelector('.md-content__inner article')
              || document.querySelector('.md-content__inner');
  if (!article) return;

  if (article.querySelector('.md-button')) return;
  if (article.querySelector('.pdf-download-bar')) return;

  var bar = document.createElement('div');
  bar.className = 'pdf-download-bar';

  var btn = document.createElement('button');
  btn.className   = 'pdf-download-btn';
  btn.textContent = 'Download PDF';
  btn.addEventListener('click', downloadPdf);

  bar.appendChild(btn);
  article.insertBefore(bar, article.firstChild);
}

if (typeof document$ !== 'undefined') {
  document$.subscribe(initPdfButton);
} else {
  document.addEventListener('DOMContentLoaded', initPdfButton);
}
