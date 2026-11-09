// Static site generator for Creme Cutz. Zero dependencies. Run: node build.mjs
import { readFileSync, writeFileSync, mkdirSync, cpSync, rmSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const dist = join(root, 'dist');
const cfg = JSON.parse(readFileSync(join(root, 'content/site-config.json'), 'utf8'));

// ---------- helpers ----------
const esc = (s = '') =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const TRACKING = /^(fbclid|gclid|igshid|mc_eid|utm_.*)$/i;
function clean(url) {
  try {
    const u = new URL(url);
    [...u.searchParams.keys()].forEach((k) => TRACKING.test(k) && u.searchParams.delete(k));
    return u.toString();
  } catch {
    return url;
  }
}
const money = (n) => `$${n}`;
const site = cfg.siteUrl.replace(/\/$/, '');
const bookUrl = clean(cfg.booking.url);
const c = cfg.contact;
const a = c.address;
const fullAddress = `${a.street}, ${a.city}, ${a.region} ${a.postalCode}`;
const ig = cfg.social.instagram ? clean(cfg.social.instagram) : '';
const ext = 'target="_blank" rel="noopener noreferrer"';
const bookBtn = (label, cls = 'btn btn-primary') =>
  `<a class="${cls}" href="${esc(bookUrl)}" ${ext}>${esc(label)}</a>`;

const icon = {
  linkedin: '<svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9.75h4V21H3V9.75zm6.5 0h3.8v1.55h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21h-4v-4.93c0-1.18-.02-2.7-1.65-2.7-1.65 0-1.9 1.29-1.9 2.62V21h-4V9.75z"/></svg>',
  instagram: '<svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>'
};

// ---------- layout ----------
function layout({ title, description, path, body, jsonld = '', noindex = false }) {
  const url = site + path;
  const og = site + cfg.seo.ogImage;
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${esc(url)}">
${noindex ? '<meta name="robots" content="noindex">' : ''}
<meta name="theme-color" content="#111111">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(cfg.name)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${esc(url)}">
<meta property="og:image" content="${esc(og)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${esc(og)}">
<link rel="icon" href="/favicon/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600;700&display=swap">
<link rel="stylesheet" href="/styles/main.css">
${jsonld}
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
${body}
<script src="/scripts/main.js" defer></script>
</body>
</html>`;
}

function header(home) {
  const p = home ? '' : '/';
  const nav = [['Services', '#services'], ['Gallery', '#gallery'], ['About', '#about'], ['Reviews', '#reviews'], ['Contact', '#contact']]
    .filter(([l]) => !(l === 'Reviews' && cfg.reviews.enabled === false))
    .map(([l, h]) => `<li><a href="${p}${h}">${l}</a></li>`)
    .join('');
  const promo = cfg.promo.enabled ? `<div class="promo" role="note">${esc(cfg.promo.text)}</div>` : '';
  return `${promo}
<header class="site-header">
  <div class="wrap bar">
    <a class="wordmark" href="/" aria-label="${esc(cfg.name)} home">${esc(cfg.wordmark)}</a>
    <nav aria-label="Main" id="nav" class="nav">
      <ul>${nav}</ul>
    </nav>
    ${bookBtn('Book Now', 'btn btn-primary btn-sm')}
    <button class="menu-btn" aria-expanded="false" aria-controls="nav" aria-label="Menu"><span></span><span></span><span></span></button>
  </div>
</header>`;
}

function footer() {
  return `<footer class="site-footer">
  <div class="wrap foot">
    <div>
      <p class="wordmark">${esc(cfg.wordmark)}</p>
      <p>${esc(cfg.hero.trust)}</p>
    </div>
    <ul class="foot-list">
      <li><a href="tel:${esc(c.phoneRaw)}">${esc(c.phone)}</a></li>
      <li><a href="mailto:${esc(c.email)}">${esc(c.email)}</a></li>
      ${ig ? `<li><a href="${esc(ig)}" ${ext}>Instagram</a></li>` : ''}
    </ul>
    <ul class="foot-list">
      <li><a href="/privacy/">Privacy Policy</a></li>
      <li><a href="/accessibility/">Accessibility Statement</a></li>
    </ul>
  </div>
  <p class="wrap copy">&copy; <span data-year>${new Date().getFullYear()}</span> ${esc(cfg.name)}. All rights reserved.</p>
</footer>
<div class="sticky-bar">
  <a class="btn btn-primary" href="${esc(bookUrl)}" ${ext}>Book Now</a>
  <a class="btn btn-ghost" href="tel:${esc(c.phoneRaw)}">Call</a>
  <a class="btn btn-ghost" href="sms:${esc(c.phoneRaw)}">Text</a>
</div>`;
}

// ---------- sections ----------
function hero() {
  const h = cfg.hero;
  return `<section class="hero" aria-labelledby="hero-title">
  <div class="wrap hero-in">
    <p class="eyebrow">${esc(h.trust)}</p>
    <h1 id="hero-title">${esc(h.headline)}</h1>
    <p class="lead">${esc(h.subline)}</p>
    <div class="cta-row">
      ${bookBtn(h.primaryCta)}
      <a class="btn btn-ghost-light" href="#gallery">${esc(h.secondaryCta)}</a>
    </div>
  </div>
</section>`;
}

function services() {
  const s = cfg.services;
  const cards = s.items
    .map(
      (i) => `<li class="card reveal">
      <h3>${esc(i.name)}${i.alt ? ` <span class="or">or</span> ${esc(i.alt)}` : ''}</h3>
      <p class="price">${money(i.price)}</p>
      <p>${esc(i.description)}</p>
      ${bookBtn('Book', 'btn btn-dark btn-sm')}
    </li>`
    )
    .join('');
  return `<section id="services" class="section" aria-labelledby="services-title">
  <div class="wrap">
    <h2 id="services-title">${esc(s.title)}</h2>
    <ul class="grid cards">${cards}</ul>
    <div class="addon reveal">
      <p><strong>${esc(s.addon.name)}</strong> <span class="price-sm">+${money(s.addon.price)}</span></p>
      <p>${esc(s.addon.description)}</p>
    </div>
  </div>
</section>`;
}

function gallery() {
  const g = cfg.gallery;
  const items = g.items
    .map(
      (i, n) => `<li><button class="shot" data-full="${esc(i.src)}" data-alt="${esc(i.alt)}" aria-label="Open photo ${n + 1}: ${esc(i.alt)}">
        <img src="${esc(i.src)}" alt="${esc(i.alt)}" loading="lazy" width="800" height="1000">
      </button></li>`
    )
    .join('');
  return `<section id="gallery" class="section dark" aria-labelledby="gallery-title">
  <div class="wrap">
    <h2 id="gallery-title">${esc(g.title)}</h2>
    <p class="muted">${esc(g.intro)}</p>
    <ul class="gallery">${items}</ul>
    ${ig ? `<p class="center"><a class="btn btn-primary" href="${esc(ig)}" ${ext}>${icon.instagram} Follow us on Instagram</a></p>` : ''}
  </div>
  <dialog id="lightbox" aria-label="Photo viewer">
    <button class="lb-close" aria-label="Close photo">&times;</button>
    <button class="lb-prev" aria-label="Previous photo">&#8249;</button>
    <img alt="">
    <button class="lb-next" aria-label="Next photo">&#8250;</button>
  </dialog>
</section>`;
}

function story() {
  const s = cfg.story;
  return `<section id="about" class="section" aria-labelledby="story-title">
  <div class="wrap narrow">
    <h2 id="story-title">${esc(s.title)}</h2>
    <h3 class="sub">${esc(s.subtitle)}</h3>
    ${s.paragraphs.map((p) => `<p class="reveal">${esc(p)}</p>`).join('')}
  </div>
</section>`;
}

function team() {
  const t = cfg.team;
  if (t.enabled === false) return '';
  const cards = t.members
    .map(
      (m) => `<li class="card person reveal">
      <img src="${esc(m.photo)}" alt="Photo placeholder for ${esc(m.name)}, replace with a real photo" loading="lazy" width="320" height="320">
      <h3>${esc(m.name)}</h3>
      <p>${esc(m.background)}</p>
      <p class="muted-dark">From ${esc(m.hometown)}</p>
      <a class="icon-link" href="${esc(clean(m.linkedin))}" ${ext} aria-label="${esc(m.name)} on LinkedIn">${icon.linkedin}<span>LinkedIn</span></a>
    </li>`
    )
    .join('');
  return `<section class="section alt" aria-labelledby="team-title">
  <div class="wrap">
    <h2 id="team-title">${esc(t.title)}</h2>
    <p class="intro">${esc(t.intro)}</p>
    <ul class="grid people">${cards}</ul>
  </div>
</section>`;
}

function reviews() {
  const r = cfg.reviews;
  if (r.enabled === false) return '';
  const body = r.items.length
    ? `<ul class="grid cards">${r.items
        .map((i) => `<li class="card"><blockquote><p>&ldquo;${esc(i.text)}&rdquo;</p><footer>${esc(i.author)}</footer></blockquote></li>`)
        .join('')}</ul>`
    : `<p class="empty">${esc(r.emptyMessage)}</p>`;
  return `<section id="reviews" class="section" aria-labelledby="reviews-title">
  <div class="wrap narrow center">
    <h2 id="reviews-title">${esc(r.title)}</h2>
    ${body}
  </div>
</section>`;
}

function how() {
  const h = cfg.howItWorks;
  return `<section class="section dark" aria-labelledby="how-title">
  <div class="wrap">
    <h2 id="how-title">${esc(h.title)}</h2>
    <ol class="steps">${h.steps
      .map((s) => `<li class="reveal"><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p></li>`)
      .join('')}</ol>
    <p class="center">${bookBtn('Book Your Cut')}</p>
  </div>
</section>`;
}

function location() {
  const mapQ = encodeURIComponent(fullAddress);
  const hours = c.hours.length
    ? `<table class="hours"><caption class="sr">Hours</caption><tbody>${c.hours
        .map((h) => `<tr><th scope="row">${esc(h.day)}</th><td>${esc(h.time)}</td></tr>`)
        .join('')}</tbody></table>`
    : `<p>${esc(c.hoursMessage)}</p>`;
  const addr = a.show ? `<p>${esc(a.street)}<br>${esc(a.city)}, ${esc(a.region)} ${esc(a.postalCode)}</p>` : `<p>${esc(a.hiddenMessage)}</p>`;
  const map = a.show
    ? `<div class="map"><iframe title="Map to ${esc(a.street)}, ${esc(a.city)}" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="https://www.google.com/maps?q=${mapQ}&output=embed"></iframe></div>`
    : '';
  const dir = a.show
    ? `<a class="btn btn-dark" href="https://www.google.com/maps/dir/?api=1&destination=${mapQ}" ${ext}>Get Directions</a>`
    : '';
  return `<section id="contact" class="section alt" aria-labelledby="contact-title">
  <div class="wrap two">
    <div>
      <h2 id="contact-title">${esc(c.title)}</h2>
      <h3>Address</h3>${addr}
      <h3>Hours</h3>${hours}
      <h3>Contact</h3>
      <ul class="plain">
        <li><a href="tel:${esc(c.phoneRaw)}">Call ${esc(c.phone)}</a></li>
        <li><a href="sms:${esc(c.phoneRaw)}">Text ${esc(c.phone)}</a></li>
        <li><a href="mailto:${esc(c.email)}">${esc(c.email)}</a></li>
      </ul>
      <div class="cta-row">${bookBtn('Book Now')} ${dir}</div>
    </div>
    ${map}
  </div>
</section>`;
}

function faq() {
  const f = cfg.faq;
  return `<section class="section" aria-labelledby="faq-title">
  <div class="wrap narrow">
    <h2 id="faq-title">${esc(f.title)}</h2>
    ${f.items
      .map(
        (i) => `<details><summary>${esc(i.q)}</summary><p>${esc(i.a || f.pendingMessage)}</p></details>`
      )
      .join('')}
  </div>
</section>`;
}

function schema() {
  const o = {
    '@context': 'https://schema.org',
    '@type': 'BarberShop',
    name: cfg.name,
    url: site,
    image: site + cfg.seo.ogImage,
    description: cfg.seo.description,
    telephone: c.phoneRaw,
    email: c.email,
    priceRange: cfg.priceRange,
    address: {
      '@type': 'PostalAddress',
      streetAddress: a.street,
      addressLocality: a.city,
      addressRegion: a.region,
      postalCode: a.postalCode,
      addressCountry: a.country
    },
    potentialAction: { '@type': 'ReserveAction', target: bookUrl, name: 'Book an appointment' },
    sameAs: [ig, ...cfg.social.linkedin].filter(Boolean)
  };
  if (!a.show) o.address = { '@type': 'PostalAddress', addressLocality: a.city, addressRegion: a.region, addressCountry: a.country };
  return `<script type="application/ld+json">${JSON.stringify(o)}</script>`;
}

// ---------- legal pages ----------
function page(title, h1, content, path) {
  return layout({
    title: `${title} | ${cfg.name}`,
    description: `${title} for ${cfg.name}.`,
    path,
    body: `${header(false)}<main id="main" class="section"><div class="wrap narrow legal"><h1>${h1}</h1>${content}</div></main>${footer()}`
  });
}

const privacy = `<p>Last updated: ${new Date().toISOString().slice(0, 10)}</p>
<p>${esc(cfg.name)} is a student-run barbershop in Amherst, MA. This page explains what information is involved when you use this website.</p>
<h2>What this website collects</h2>
<p>This website does not have accounts, forms, or a database, and we do not run analytics or advertising trackers on it. Our hosting provider may keep standard server logs (such as IP address and browser type) for security and reliability.</p>
<h2>Booking</h2>
<p>Appointments are booked through Google Calendar appointment scheduling. When you book, the details you enter (such as your name and email) go to Google and to us. Google's handling of that data is covered by <a href="https://policies.google.com/privacy" ${ext}>Google's Privacy Policy</a>. We use your details only to manage your appointment and contact you about it.</p>
<h2>Third-party services</h2>
<p>This site loads fonts from Google Fonts and, if shown, a Google Maps embed. Those services may receive your IP address when they load. Links to LinkedIn, Instagram, and other sites are governed by those sites' own policies.</p>
<h2>Contact</h2>
<p>Questions? Email <a href="mailto:${esc(c.email)}">${esc(c.email)}</a>.</p>
<p><em>Draft for owner review: this page should be reviewed and confirmed by the owners (see TODO.md).</em></p>`;

const accessibility = `<p>${esc(cfg.name)} wants this website to be usable by everyone, including people who use assistive technology.</p>
<h2>What we do</h2>
<ul>
<li>Semantic HTML with a logical heading order and a skip link.</li>
<li>Full keyboard navigation, including the menu and the photo viewer, with visible focus outlines.</li>
<li>Text and button colors chosen for WCAG AA contrast.</li>
<li>Alt text on images and labels on icon-only links.</li>
<li>Tap targets of at least 44px.</li>
<li>Animations are turned off for visitors who prefer reduced motion.</li>
</ul>
<h2>Known limits</h2>
<p>Booking happens on Google Calendar, which we do not control. Images marked as placeholders will get descriptive alt text when real photos are added. We have not yet completed a manual audit with screen readers.</p>
<h2>Feedback</h2>
<p>If something is hard to use, email <a href="mailto:${esc(c.email)}">${esc(c.email)}</a> or call <a href="tel:${esc(c.phoneRaw)}">${esc(c.phone)}</a>. We will help you book another way.</p>`;

// ---------- write ----------
rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });
cpSync(join(root, 'public'), dist, { recursive: true });
cpSync(join(root, 'src/styles'), join(dist, 'styles'), { recursive: true });
cpSync(join(root, 'src/scripts'), join(dist, 'scripts'), { recursive: true });

const out = (p, html) => {
  const f = join(dist, p);
  mkdirSync(dirname(f), { recursive: true });
  writeFileSync(f, html);
};

out(
  'index.html',
  layout({
    title: cfg.seo.title,
    description: cfg.seo.description,
    path: '/',
    jsonld: schema(),
    body: `${header(true)}<main id="main">${hero()}${services()}${gallery()}${story()}${team()}${reviews()}${how()}${location()}${faq()}</main>${footer()}`
  })
);
out('privacy/index.html', page('Privacy Policy', 'Privacy Policy', privacy, '/privacy/'));
out('accessibility/index.html', page('Accessibility Statement', 'Accessibility Statement', accessibility, '/accessibility/'));

const urls = ['/', '/privacy/', '/accessibility/'];
out(
  'sitemap.xml',
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
    .map((u) => `  <url><loc>${site}${u}</loc></url>`)
    .join('\n')}\n</urlset>\n`
);
out('robots.txt', `User-agent: *\nAllow: /\nSitemap: ${site}/sitemap.xml\n`);
console.log('Built to dist/');
