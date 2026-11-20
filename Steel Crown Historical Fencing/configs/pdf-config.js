window.PDF_CONFIG = {

  page: {
    // 'letter' (8.5" x 11") or 'a4'
    format: 'letter',

    // 'portrait' or 'landscape'
    orientation: 'portrait',

    // Margins in millimeters: [top, right, bottom, left]
    margins: [15, 15, 15, 15]
  },

  typography: {
    // Base font size for the PDF body text — adjust if text feels too large or small
    // Examples: '0.85rem', '0.9rem', '1rem', '13px', '14px'
    fontSize: '0.9rem',

    // Line spacing. 1.6 is tighter, 1.75 is the site default, 2.0 is very open
    lineHeight: '1.6'
  },

  image: {
    // Capture resolution multiplier. 2 = sharp, 1 = screen resolution (smaller file)
    scale: 2,

    // JPEG compression quality: 0.0 (smallest file) to 1.0 (best quality)
    quality: 0.95
  },

  watermark: {
    // Set to false to disable the logo watermark entirely
    enabled: true,

    // Transparency of the watermark: 0.0 = invisible, 1.0 = fully opaque
    opacity: 0.1,

    // Width of the watermark logo in millimeters
    widthMm: 80
  },

  pageBreak: {
    // Controls how content is split across pages.
    // 'avoid-all' prevents cutting through paragraphs and headings (recommended)
    // 'css' respects CSS page-break properties only
    // 'legacy' only breaks on .html2pdf__page-break elements
    mode: 'avoid-all'
  }

};
