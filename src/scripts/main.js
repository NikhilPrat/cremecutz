document.documentElement.classList.add('js');

// Dynamic copyright year
document.querySelectorAll('[data-year]').forEach((el) => (el.textContent = new Date().getFullYear()));

// Mobile menu
const btn = document.querySelector('.menu-btn');
const nav = document.getElementById('nav');
if (btn && nav) {
  const set = (open) => {
    nav.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', String(open));
  };
  btn.addEventListener('click', () => set(!nav.classList.contains('open')));
  nav.addEventListener('click', (e) => e.target.closest('a') && set(false));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('open')) {
      set(false);
      btn.focus();
    }
  });
}

// Scroll reveal
const items = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      }),
    { threshold: 0.15 }
  );
  items.forEach((el) => io.observe(el));
} else {
  items.forEach((el) => el.classList.add('in'));
}

// Lightbox (native <dialog> gives focus trap + Esc)
const lb = document.getElementById('lightbox');
if (lb && typeof lb.showModal === 'function') {
  const shots = [...document.querySelectorAll('.shot')];
  const img = lb.querySelector('img');
  let idx = 0;
  let opener = null;
  const show = (i) => {
    idx = (i + shots.length) % shots.length;
    img.src = shots[idx].dataset.full;
    img.alt = shots[idx].dataset.alt;
  };
  shots.forEach((s, i) =>
    s.addEventListener('click', () => {
      opener = s;
      show(i);
      lb.showModal();
      lb.querySelector('.lb-close').focus();
    })
  );
  lb.querySelector('.lb-close').addEventListener('click', () => lb.close());
  lb.querySelector('.lb-prev').addEventListener('click', () => show(idx - 1));
  lb.querySelector('.lb-next').addEventListener('click', () => show(idx + 1));
  lb.addEventListener('click', (e) => e.target === lb && lb.close());
  lb.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') show(idx - 1);
    if (e.key === 'ArrowRight') show(idx + 1);
  });
  lb.addEventListener('close', () => opener && opener.focus());
}
