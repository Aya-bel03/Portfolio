/* ═══════════════════════════════════════
   AYA KHADIDJA — PORTFOLIO SCRIPT
═══════════════════════════════════════ */

// ── THEME SWITCH ──
const themeBtn = document.getElementById('theme-switch');
const body = document.body;

// Load saved theme
const saved = localStorage.getItem('theme');
if (saved === 'dark') {
  body.classList.replace('light-mode', 'dark-mode');
  themeBtn.querySelector('i').classList.replace('fa-moon', 'fa-sun');
}

themeBtn.addEventListener('click', () => {
  const isDark = body.classList.toggle('dark-mode');
  body.classList.toggle('light-mode', !isDark);
  const icon = themeBtn.querySelector('i');
  icon.classList.toggle('fa-moon', !isDark);
  icon.classList.toggle('fa-sun', isDark);
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

// ── CUSTOM CURSOR ──
const cur = document.getElementById('cur');
const ring = document.getElementById('cur-ring');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cur.style.left = mx + 'px';
  cur.style.top  = my + 'px';
});

// Ring follows with lag
(function animRing() {
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  ring.style.left = rx + 'px';
  ring.style.top  = ry + 'px';
  requestAnimationFrame(animRing);
})();

// Grow on interactive elements
document.querySelectorAll('a, button, .bento-item, .social-item, .proj-link').forEach(el => {
  el.addEventListener('mouseenter', () => body.classList.add('cursor-hover'));
  el.addEventListener('mouseleave', () => body.classList.remove('cursor-hover'));
});

// ── PROGRESS BAR ──
const progressBar = document.getElementById('progress-bar');
window.addEventListener('scroll', () => {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progressBar.style.width = (window.scrollY / max * 100) + '%';
}, { passive: true });

// ── HEADER HIDE/SHOW ON SCROLL ──
const header = document.getElementById('header');
let lastScrollY = 0;
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  if (y > lastScrollY && y > 100) {
    header.classList.add('hide');
  } else {
    header.classList.remove('hide');
  }
  lastScrollY = y;
}, { passive: true });

// ── BENTO GLOW (mouse position) ──
document.querySelectorAll('.bento-item').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
    card.style.setProperty('--my', (e.clientY - r.top)  + 'px');
  });
});

// ── SCROLL REVEAL ──
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

// ── ACTIVE NAV LINK ON SCROLL ──
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const secObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navLinks.forEach(a => a.style.color = '');
      const active = document.querySelector(`.nav-links a[href="#${e.target.id}"]`);
      if (active) active.style.color = 'var(--accent)';
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => secObs.observe(s));

// ── SMOOTH ANCHOR SCROLL ──
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ── FORM SUBMIT FEEDBACK ──
const form = document.querySelector('form');
const submitBtn = document.querySelector('.btn-submit');
if (form && submitBtn) {
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const btnSpan = submitBtn.querySelector('span:first-child');
    const arrow = submitBtn.querySelector('.btn-arrow');
    btnSpan.textContent = 'Envoi en cours...';
    arrow.textContent = '⏳';
    submitBtn.disabled = true;

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });
      if (res.ok) {
        btnSpan.textContent = 'Message envoyé !';
        arrow.textContent = '✓';
        submitBtn.style.background = '#4ade80';
        form.reset();
        setTimeout(() => {
          btnSpan.textContent = 'Envoyer le message';
          arrow.textContent = '↗';
          submitBtn.style.background = '';
          submitBtn.disabled = false;
        }, 3000);
      } else {
        throw new Error();
      }
    } catch {
      btnSpan.textContent = 'Erreur, réessayez';
      arrow.textContent = '✗';
      submitBtn.style.background = '#f87171';
      setTimeout(() => {
        btnSpan.textContent = 'Envoyer le message';
        arrow.textContent = '↗';
        submitBtn.style.background = '';
        submitBtn.disabled = false;
      }, 3000);
    }
  });
}

// ── SKILLS MARQUEE PAUSE ON HOVER ──
const track = document.querySelector('.skills-track');
if (track) {
  track.addEventListener('mouseenter', () => track.style.animationPlayState = 'paused');
  track.addEventListener('mouseleave', () => track.style.animationPlayState = 'running');
}

// ── TILT EFFECT ON PROJECT CARDS ──
document.querySelectorAll('.bento-item.card-med').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const xp = (e.clientX - r.left) / r.width  - 0.5;
    const yp = (e.clientY - r.top)  / r.height - 0.5;
    card.style.transform = `translateY(-5px) rotateX(${-yp * 5}deg) rotateY(${xp * 5}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform .5s cubic-bezier(.22,1,.36,1)';
  });
});
