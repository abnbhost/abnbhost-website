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
