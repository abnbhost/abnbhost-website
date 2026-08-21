const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
  if (entry.isIntersecting) entry.target.classList.add('visible');
}), { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

document.querySelectorAll('.service').forEach((service) => {
  service.addEventListener('click', () => {
    document.querySelectorAll('.service').forEach((item) => item.classList.remove('active'));
    service.classList.add('active');
  });
});

const menu = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('.mobile-nav');
if (menu && mobileNav) {
  menu.addEventListener('click', () => {
    const isOpen = mobileNav.classList.toggle('open');
    menu.setAttribute('aria-expanded', isOpen);
  });
  mobileNav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
    mobileNav.classList.remove('open'); menu.setAttribute('aria-expanded', 'false');
  }));
}

const leadForm = document.querySelector('#lead-form');
if (leadForm) leadForm.addEventListener('submit', () => {
  const message = leadForm.querySelector('.form-message');
  if (message) message.textContent = 'Sending your inquiry…';
});

// The public Sanity dataset lets the website update immediately after content is
// published in ABNBHost Content Studio. The existing HTML remains as a graceful
// fallback while the Studio is being populated or if a visitor is offline.
(async () => {
  const projectId = 'nvnz9p1u';
  const dataset = 'production';
  const apiVersion = '2026-08-20';
  const filename = location.pathname.split('/').pop() || 'index.html';
  const pageSlug = { 'index.html': 'home', 'about.html': 'about', 'services.html': 'services', 'portfolio.html': 'portfolio', 'why-abnbhost.html': 'why', 'insights.html': 'insights', 'partner.html': 'partner' }[filename] || 'home';
  const query = `{
    "settings": *[_type == "siteSettings"][0]{email, whatsapp, instagram, youtube, formRecipientEmail, metrics, locations},
    "page": *[_type == "page" && slug.current == $pageSlug][0]{heroTitle, heroDescription, introTitle, seoDescription, "heroImageUrl": heroImage.asset->url, sections[]{key, label, eyebrow, heading, body, buttonLabel, buttonLink, "imageUrl": image.asset->url, items[]{label, title, description, "imageUrl": image.asset->url}}},
    "properties": *[_type == "property" && featured == true] | order(sortOrder asc){name, location, type, "imageUrl": image.asset->url},
    "services": *[_type == "service"] | order(sortOrder asc){title, summary, "imageUrl": image.asset->url, showOnHome},
    "insights": *[_type == "insight"] | order(sortOrder asc){title, category, summary, featured, "imageUrl": image.asset->url}
  }`;
  try {
    const endpoint = `https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}?query=${encodeURIComponent(query)}&$pageSlug=${encodeURIComponent(JSON.stringify(pageSlug))}`;
    const response = await fetch(endpoint);
    if (!response.ok) return;
    const {result} = await response.json();
    if (!result) return;
    const {settings, page, properties, services, insights} = result;
    if (settings?.headingScale) document.documentElement.dataset.headingScale = settings.headingScale;
    if (settings?.bodyScale) document.documentElement.dataset.bodyScale = settings.bodyScale;
    const heading = pageSlug === 'home' ? document.querySelector('.hero h1') : document.querySelector('.page-hero h1, .partner h1');
    const description = pageSlug === 'home' ? document.querySelector('.hero-bottom p') : document.querySelector('.page-hero > div > p:last-child, .partner-copy > p:last-of-type');
    if (heading && page?.heroTitle) heading.textContent = page.heroTitle;
    if (description && page?.heroDescription) description.textContent = page.heroDescription;
    if (page?.heroImageUrl) updateImage(pageSlug === 'home' ? '.hero-image' : '.page-hero', page.heroImageUrl);
    if (pageSlug === 'home' && page?.introTitle) {
      const intro = document.querySelector('.intro-copy h2');
      if (intro) intro.textContent = page.introTitle;
    }
    if (page?.seoDescription) document.querySelector('meta[name="description"]')?.setAttribute('content', page.seoDescription);
    if (settings?.email) document.querySelectorAll('a[href^="mailto:"]').forEach((link) => { link.href = `mailto:${settings.email}`; });
    if (settings?.whatsapp) document.querySelectorAll('a[href^="https://wa.me/"]').forEach((link) => { link.href = `https://wa.me/${settings.whatsapp.replace(/\D/g, '')}`; });
    if (settings?.instagram) document.querySelectorAll('a[href*="instagram.com/"]').forEach((link) => {
      link.href = `https://instagram.com/${settings.instagram.replace(/^@/, '')}`;
      if (link.textContent.includes('@')) link.innerHTML = `@${settings.instagram.replace(/^@/, '')} on Instagram <b>↗</b>`;
    });
    if (settings?.youtube) document.querySelectorAll('a[href*="youtube.com/"]').forEach((link) => {
      link.href = `https://youtube.com/@${settings.youtube.replace(/^@/, '')}`;
    });
    if (settings?.formRecipientEmail) document.querySelector('#lead-form')?.setAttribute('action', `https://formsubmit.co/${settings.formRecipientEmail}`);
    if (pageSlug === 'home' && Array.isArray(settings?.metrics) && settings.metrics.length) {
      document.querySelectorAll('.stats > div').forEach((card, index) => {
        const metric = settings.metrics[index];
        if (!metric) return;
        const value = card.querySelector('strong');
        const label = card.querySelector('p');
        if (value && metric.value) value.textContent = metric.value;
        if (label && metric.label) label.textContent = metric.label;
      });
    }
    if (pageSlug === 'home' && Array.isArray(properties) && properties.length) {
      document.querySelectorAll('.property').forEach((card, index) => {
        const property = properties[index];
        if (!property) return;
        const image = card.querySelector('img');
        const title = card.querySelector('h3');
        const location = card.querySelector('.property-caption span');
        if (image && property.imageUrl) { image.src = property.imageUrl; image.alt = property.name || 'ABNBHost property'; }
        if (title && property.name) title.textContent = property.name;
        if (location && property.location) location.textContent = `0${index + 1} / ${property.location}`;
      });
    }
    renderPageSections(pageSlug, page?.sections || []);
    renderServices(pageSlug, services || []);
    renderPortfolio(pageSlug, properties || []);
    renderInsights(pageSlug, insights || []);
  } catch (_) { /* Static fallback remains visible. */ }
})();

function updateText(selector, text, root = document) {
  const node = root.querySelector(selector);
  if (node && text) node.textContent = text;
}

function updateImage(selector, url, root = document) {
  const node = root.querySelector(selector);
  if (!node || !url) return;
  if (node.tagName === 'IMG') node.src = url;
  else node.style.backgroundImage = `url("${url}")`;
}

function applyItems(selector, items, options = {}) {
  if (!Array.isArray(items) || !items.length) return;
  document.querySelectorAll(selector).forEach((card, index) => {
    const item = items[index];
    if (!item) return;
    updateText(options.label || 'span', item.label, card);
    updateText(options.title || 'h2, h3', item.title, card);
    updateText(options.description || 'p', item.description, card);
    if (options.image) updateImage(options.image, item.imageUrl, card);
  });
}

function renderPageSections(slug, sections) {
  if (!Array.isArray(sections)) return;
  sections.forEach((section) => {
    const key = section.key;
    if (!key) return;
    const maps = {
      about: {
        story: () => { updateText('.story h2', section.heading); updateText('.story .section-label', section.label); applyItems('.story > div:last-child p', section.items, {title: 'strong', description: 'p'}); },
        philosophy: () => { updateText('.philosophy h2', section.heading); updateText('.philosophy .eyebrow', section.eyebrow); updateText('.philosophy-grid p:first-child', section.body); applyItems('.philosophy-grid p:nth-child(n+2)', section.items, {description: 'p'}); },
        mission: () => { updateText('.mission h2', section.heading); updateText('.mission article > p:last-of-type', section.body); updateText('.mission .eyebrow', section.eyebrow); updateText('.mission .button-dark', section.buttonLabel); updateImage('.mission > div', section.imageUrl); }
      },
      services: {
        system: () => { updateText('.dark-banner h2', section.heading); updateText('.dark-banner .eyebrow', section.eyebrow); updateText('.dark-banner .button-light', section.buttonLabel); }
      },
      portfolio: {
        intro: () => { updateText('.portfolio-intro h2', section.heading); updateText('.portfolio-intro > p', section.body); updateText('.portfolio-intro .section-label', section.label); }
      },
      why: {
        comparison: () => { updateText('.compare-good h2', section.heading); updateText('.compare-good p', section.body); applyItems('.compare-grid article:first-child li', section.items, {description: 'li'}); },
        reasons: () => { applyItems('.reason-list article', section.items, {label: 'span', title: 'h2', description: 'p'}); }
      },
      insights: {},
      partner: {
        contact: () => { updateText('.partner-copy h1', section.heading); updateText('.partner-copy > p:last-of-type', section.body); updateText('.partner-copy .eyebrow', section.eyebrow); }
      },
      home: {
        ownership: () => { updateText('.ownership h2', section.heading); updateText('.ownership-copy', section.body); updateImage('.ownership-image', section.imageUrl); },
        process: () => { applyItems('.step', section.items, {label: 'span', title: 'h3', description: 'p'}); }
      }
    };
    maps[slug]?.[key]?.();
  });
}

function renderServices(slug, services) {
  if (!Array.isArray(services) || !services.length) return;
  const cards = slug === 'services' ? '.card-grid article' : slug === 'home' ? '.service' : null;
  if (!cards) return;
  const visible = slug === 'home' ? services.filter((service) => service.showOnHome !== false) : services;
  applyItems(cards, visible.map((service, index) => ({label: String(index + 1).padStart(2, '0'), title: service.title, description: service.summary, imageUrl: service.imageUrl})), {label: 'span, .service-no', title: 'h2, h3', description: 'p'});
}

function renderPortfolio(slug, properties) {
  if (slug !== 'portfolio' || !properties.length) return;
  applyItems('.portfolio-grid article', properties, {description: 'p', title: 'h2', image: 'img'});
  document.querySelectorAll('.portfolio-grid article').forEach((card, index) => {
    const property = properties[index];
    if (property) updateText('p', `${property.location || ''} · ${property.type || ''}`, card);
  });
}

function renderInsights(slug, insights) {
  if (slug !== 'insights' || !insights.length) return;
  const featured = insights.find((article) => article.featured) || insights[0];
  updateText('.featured-article h2', featured.title);
  updateText('.featured-article p', featured.category);
  updateImage('.featured-article img', featured.imageUrl);
  applyItems('.article-list article', insights.filter((article) => article !== featured), {title: 'h2', description: 'span', label: 'p'});
}
