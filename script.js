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
    "page": *[_type == "page" && slug.current == $pageSlug][0]{heroTitle, heroDescription, introTitle, seoDescription},
    "properties": *[_type == "property" && featured == true] | order(sortOrder asc)[0...3]{name, location, type, "imageUrl": image.asset->url}
  }`;
  try {
    const endpoint = `https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}?query=${encodeURIComponent(query)}&$pageSlug=${encodeURIComponent(JSON.stringify(pageSlug))}`;
    const response = await fetch(endpoint);
    if (!response.ok) return;
    const {result} = await response.json();
    if (!result) return;
    const {settings, page, properties} = result;
    const heading = pageSlug === 'home' ? document.querySelector('.hero h1') : document.querySelector('.page-hero h1, .partner h1');
    const description = pageSlug === 'home' ? document.querySelector('.hero-bottom p') : document.querySelector('.page-hero > div > p:last-child, .partner-copy > p:last-of-type');
    if (heading && page?.heroTitle) heading.textContent = page.heroTitle;
    if (description && page?.heroDescription) description.textContent = page.heroDescription;
    if (pageSlug === 'home' && page?.introTitle) {
      const intro = document.querySelector('.intro-copy h2');
      if (intro) intro.textContent = page.introTitle;
    }
    if (page?.seoDescription) document.querySelector('meta[name="description"]')?.setAttribute('content', page.seoDescription);
    if (settings?.email) document.querySelectorAll('a[href^="mailto:"]').forEach((link) => { link.href = `mailto:${settings.email}`; });
    if (settings?.whatsapp) document.querySelectorAll('a[href^="https://wa.me/"]').forEach((link) => { link.href = `https://wa.me/${settings.whatsapp.replace(/\D/g, '')}`; });
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
  } catch (_) { /* Static fallback remains visible. */ }
})();
