#!/usr/bin/env node
/**
 * Build the DCFS framework presentation from modular slides.
 *
 * Usage: node build-presentation.js
 *
 * To reorder slides, add/remove from the MAIN_SLIDES or APPENDIX_SLIDES arrays.
 * Each slide is a standalone HTML partial in ./slides/
 */

const fs = require('fs');
const path = require('path');

const SLIDES_DIR = path.join(__dirname, 'slides');
const OUTPUT = path.join(__dirname, 'framework-presentation.html');
const STYLES = path.join(__dirname, 'slides', 'styles.css');
const OPEN_ITEMS = path.join(__dirname, 'slides', 'open-items.html');

// ── Slide order (edit these arrays to reorder/add/remove) ──
const MAIN_SLIDES = [
  '00-title.html',
  '01-agenda.html',
  '02-opportunity.html',
  '03-framework.html',
  '03b-govern-baseline.html',
  '03c-train-pilot-measure.html',
  '03d-playbook-scale.html',
  '04-capability-map.html',
  '05-measurement.html',
  '06-timeline.html',
  '07-asks.html',
  '08-summary.html',
];

const APPENDIX_SLIDES = [
  'A0-appendix-divider.html',
  'A1-use-cases.html',
  'A2-processes.html',
  'A3-governance.html',
  'A4-guardrails.html',
  'A5-pilot-design.html',
  'A6-deliverables.html',
  'A7-risks.html',
  'A8-team.html',
  'A9-kpi-catalog.html',
];

// ── Build ──
const allSlides = [...MAIN_SLIDES, ...APPENDIX_SLIDES];
const footer = `<div class="slide-footer"><a href="https://krasanconsulting.com/" target="_blank"><img src="../assets/krasan-logo.png" alt="Krasan"></a> Krasan Consulting Services</div>`;

let slidesHtml = '';
allSlides.forEach((file, i) => {
  const filePath = path.join(SLIDES_DIR, file);
  if (!fs.existsSync(filePath)) {
    console.warn(`WARNING: Slide not found: ${file}`);
    return;
  }
  let content = fs.readFileSync(filePath, 'utf8');
  // Inject footer and slide number
  content = content.replace('<!--FOOTER-->', `${footer}\n  <div class="slide-number">${i + 1}</div>`);
  slidesHtml += `<!-- ── SLIDE ${i + 1}: ${file} ── -->\n${content}\n`;
});

const styles = fs.existsSync(STYLES) ? fs.readFileSync(STYLES, 'utf8') : '';
const openItems = fs.existsSync(OPEN_ITEMS) ? fs.readFileSync(OPEN_ITEMS, 'utf8') : '';

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>AI-Augmented Agile Delivery | Krasan Consulting Services</title>
<link rel="icon" type="image/png" href="../assets/krasan-favicon.png">
<style>
${styles}
</style>
</head>
<body>

${slidesHtml}

${openItems}

<!-- ── Slide Navigation Controls ── -->
<div class="slide-nav">
  <button id="btn-prev" onclick="navigateSlide(-1)" title="Previous (Left Arrow)">&#8592;</button>
  <div class="slide-counter" id="slide-counter">1 / ${allSlides.length}</div>
  <button id="btn-next" onclick="navigateSlide(1)" title="Next (Right Arrow)">&#8594;</button>
  <button class="mode-toggle" id="btn-mode" onclick="toggleMode()" title="Toggle presentation mode (F5)">Present</button>
</div>

<div class="key-hint" id="key-hint">Arrow keys to navigate &bull; ESC to exit &bull; F5 to toggle</div>

<script>
  let currentSlide = 0;
  let presentationMode = false;
  const slides = document.querySelectorAll('.slide');
  const totalSlides = slides.length;
  const counter = document.getElementById('slide-counter');
  const btnPrev = document.getElementById('btn-prev');
  const btnNext = document.getElementById('btn-next');
  const btnMode = document.getElementById('btn-mode');
  const keyHint = document.getElementById('key-hint');

  function updateUI() {
    counter.textContent = (currentSlide + 1) + ' / ' + totalSlides;
    btnPrev.disabled = currentSlide === 0;
    btnNext.disabled = currentSlide === totalSlides - 1;
    if (presentationMode) {
      slides.forEach((s, i) => s.classList.toggle('active-slide', i === currentSlide));
    }
  }

  function navigateSlide(dir) {
    const next = currentSlide + dir;
    if (next < 0 || next >= totalSlides) return;
    currentSlide = next;
    updateUI();
    if (!presentationMode) slides[currentSlide].scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function toggleMode() {
    presentationMode = !presentationMode;
    document.body.classList.toggle('presentation-mode', presentationMode);
    btnMode.textContent = presentationMode ? 'Scroll' : 'Present';
    updateUI();
    if (!presentationMode) slides[currentSlide].scrollIntoView({ behavior: 'smooth', block: 'center' });
    if (presentationMode) {
      keyHint.style.opacity = '1';
      setTimeout(() => { keyHint.style.opacity = '0'; }, 3000);
    }
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') { e.preventDefault(); navigateSlide(1); }
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); navigateSlide(-1); }
    else if (e.key === 'Home') { e.preventDefault(); currentSlide = 0; updateUI(); if (!presentationMode) slides[0].scrollIntoView({ behavior: 'smooth', block: 'center' }); }
    else if (e.key === 'End') { e.preventDefault(); currentSlide = totalSlides - 1; updateUI(); if (!presentationMode) slides[currentSlide].scrollIntoView({ behavior: 'smooth', block: 'center' }); }
    else if (e.key === 'Escape' && presentationMode) toggleMode();
    else if (e.key === 'F5') { e.preventDefault(); toggleMode(); }
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !presentationMode) {
        const idx = Array.from(slides).indexOf(entry.target);
        if (idx !== -1) { currentSlide = idx; updateUI(); }
      }
    });
  }, { threshold: 0.5 });
  slides.forEach(s => observer.observe(s));
  updateUI();
</script>

</body>
</html>`;

fs.writeFileSync(OUTPUT, html, 'utf8');
console.log(`Built: ${OUTPUT}`);
console.log(`Main slides: ${MAIN_SLIDES.length}, Appendix slides: ${APPENDIX_SLIDES.length}, Total: ${allSlides.length}`);

