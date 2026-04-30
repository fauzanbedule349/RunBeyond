const modal = document.getElementById('productModal');
const modalImage = document.getElementById('modalImage');
const modalTitle = document.getElementById('modalTitle');
const modalTagline = document.getElementById('modalTagline');
const modalType = document.getElementById('modalType');
const modalBestFor = document.getElementById('modalBestFor');
const modalWeight = document.getElementById('modalWeight');
const modalDrop = document.getElementById('modalDrop');
const modalUpper = document.getElementById('modalUpper');
const modalTechList = document.getElementById('modalTechList');
const modalAdvList = document.getElementById('modalAdvList');
const modalClose = document.getElementById('modalClose');
const modalCloseButton = document.getElementById('modalCloseButton');

const filterButtons = Array.from(document.querySelectorAll('.filter-btn'));
const productCards = Array.from(document.querySelectorAll('.product-card'));

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll('.reveal-card').forEach((card) => observer.observe(card));

productCards.forEach((card) => {
  const quickView = card.querySelector('.quick-view');
  const meta = JSON.parse(card.dataset.product);

  quickView.addEventListener('click', (event) => {
    event.stopPropagation();
    openQuickView(meta);
  });

  card.addEventListener('pointermove', (event) => {
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const px = (x / rect.width - 0.5) * 16;
    const py = (y / rect.height - 0.5) * 16;
    card.style.transform = `perspective(900px) rotateY(${px}deg) rotateX(${py}deg) translateZ(0)`;
  });

  card.addEventListener('pointerleave', () => {
    card.style.transform = '';
  });
});

filterButtons.forEach((button) => {
  button.addEventListener('click', () => applyFilter(button.dataset.category));
});

function applyFilter(category) {
  filterButtons.forEach((button) => {
    button.classList.toggle('active', button.dataset.category === category);
  });

  productCards.forEach((card) => {
    const match = category === 'All' || card.dataset.category === category;
    if (match) {
      card.style.display = 'block';
      requestAnimationFrame(() => card.classList.remove('card-hidden'));
    } else {
      card.classList.add('card-hidden');
      setTimeout(() => {
        card.style.display = 'none';
      }, 280);
    }
  });
}

modalClose.addEventListener('click', closeQuickView);
modalCloseButton.addEventListener('click', closeQuickView);
modal.addEventListener('click', (event) => {
  if (event.target === modal) closeQuickView();
});

function openQuickView(meta) {
  modalImage.src = meta.img;
  modalTitle.textContent = meta.name;
  modalTagline.textContent = meta.tagline;
  modalType.textContent = meta.type;
  modalBestFor.textContent = meta.bestFor;
  modalWeight.textContent = meta.weight;
  modalDrop.textContent = meta.drop;
  modalUpper.textContent = meta.upper;

  modalTechList.innerHTML = meta.technologies
    .map((tech) => `<span>${tech}</span>`)
    .join('');

  modalAdvList.innerHTML = meta.advantages
    .map((item) => `<li>${item}</li>`)
    .join('');

  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
}

function closeQuickView() {
  modal.classList.remove('active');
  modal.setAttribute('aria-hidden', 'true');
}

const navLinks = Array.from(document.querySelectorAll('.nav-links a'));
navLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

window.addEventListener('load', () => {
  document.querySelectorAll('.hero-shoe-card img').forEach((image) => {
    image.style.transform = 'scale(1.1)';
  });
  applyFilter('All');
});
