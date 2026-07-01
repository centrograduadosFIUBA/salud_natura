function toggleMenu() {
  document.querySelector('.nav-links').classList.toggle('open');
}

function enviarFormulario(e) {
  e.preventDefault();
  document.getElementById('form-msg').style.display = 'block';
  e.target.reset();
}

// Scroll suave del indicador
document.querySelector('.scroll-indicator')?.addEventListener('click', () => {
  document.getElementById('pilares').scrollIntoView({ behavior: 'smooth' });
});

// Animación de entrada en scroll
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1 });

document.querySelectorAll('.pilar-card, .lote-card, .grimorio-content').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(el);
});

document.addEventListener('scroll', () => {
  document.querySelectorAll('.visible').forEach(el => {
    el.style.opacity = '1';
    el.style.transform = 'translateY(0)';
  });
});

// Cita aleatoria del footer
const FOOTER_QUOTES = [
  { text: "El que conoce a los demás es sabio. El que se conoce a sí mismo es iluminado.", author: "Lao Tsé" },
  { text: "La naturaleza es el mejor médico.", author: "Hipócrates" },
];

function setRandomFooterQuote() {
  const el = document.getElementById('footer-quote');
  if (!el) return;
  const quote = FOOTER_QUOTES[Math.floor(Math.random() * FOOTER_QUOTES.length)];
  el.textContent = `"${quote.text}" — ${quote.author}`;
}

document.addEventListener('DOMContentLoaded', setRandomFooterQuote);
