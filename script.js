// Sem bibliotecas ou serviços externos. Funciona também abrindo index.html.
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
function closeMenu() {
  menuButton.setAttribute('aria-expanded', 'false');
  navigation.classList.remove('open');
}
menuButton.addEventListener('click', () => {
  const expanded = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!expanded));
  navigation.classList.toggle('open', !expanded);
});
navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
    closeMenu();
    menuButton.focus();
  }
});
if ('IntersectionObserver' in window) {
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navigation.querySelectorAll('a').forEach(link => {
        const active = link.hash === `#${entry.target.id}`;
        link.classList.toggle('active', active);
        if (active) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-15% 0px -65% 0px', threshold: 0 });
  document.querySelectorAll('main > section[id]').forEach(section => sectionObserver.observe(section));
}
const projects = [...document.querySelectorAll('.project-card')];
document.querySelectorAll('[data-filter]').forEach(button => {
  button.addEventListener('click', () => {
    const category = button.dataset.filter;
    document.querySelectorAll('[data-filter]').forEach(other => other.setAttribute('aria-pressed', String(other === button)));
    let visible = 0;
    projects.forEach(project => {
      const show = category === 'all' || project.dataset.category === category;
      project.hidden = !show;
      if (show) visible++;
    });
    document.querySelector('#filter-status').textContent = `${visible} projet${visible > 1 ? 's' : ''} affiché${visible > 1 ? 's' : ''}.`;
  });
});

// Legendas das fotos: mantenha os IDs alinhados aos data-gallery no HTML.
const gallery = [
  { id: 'poster', src: 'assets/poster-recherche.webp', caption: 'Poster de recherche — qualité des annotations et diagnostic de défauts de lubrification. Travail collectif UFSC / Dynamox.' },
  { id: 'poster-detail', src: 'assets/poster-recherche-2.webp', caption: 'Autre vue du poster : méthodologie, résultats et conclusions de l’étude collective.' },
  { id: 'poster-team', src: 'assets/poster-equipe.webp', caption: 'Présentation du poster de recherche lors d’une rencontre scientifique.' },
  { id: 'poster-team-2', src: 'assets/poster-equipe-2.webp', caption: 'Un autre moment de la présentation du poster.' },
  { id: 'presentation', src: 'assets/presentation-poster.webp', caption: 'Présentation autour des résultats de la recherche sur les annotations bruitées en contexte industriel.' },
  { id: 'microgrid', src: 'assets/laboratoire-microreseau.webp', caption: 'Banc expérimental : émulateurs photovoltaïque et éolien, batteries et onduleurs.' },
  { id: 'hydrogen', src: 'assets/laboratoire-hydrogene.webp', caption: 'Banc hydrogène du laboratoire : électrolyseur, piles à combustible et stockage.' },
  { id: 'lab-overview', src: 'assets/laboratoire-ensemble.webp', caption: 'Vue d’ensemble des équipements du laboratoire énergétique INCT / CAPE.' },
  { id: 'workshop-group', src: 'assets/workshop-groupe.webp', caption: 'Photo de groupe lors d’un workshop lié aux travaux avec Dynamox.' },
  { id: 'workshop-talk', src: 'assets/workshop-presentation.webp', caption: 'Présentation technique et discussion des résultats lors d’un workshop.' },
  { id: 'workshop-2026', src: 'assets/workshop-rencontre.webp', caption: 'Rencontre de l’équipe lors d’un workshop.' }
];
const lightbox = document.querySelector('#lightbox');
let currentImage = 0;
let previousFocus;
function showImage(index) {
  currentImage = (index + gallery.length) % gallery.length;
  const item = gallery[currentImage];
  const image = document.querySelector('#lightbox-image');
  image.src = item.src;
  image.alt = item.caption;
  document.querySelector('#lightbox-caption').textContent = item.caption;
  document.querySelector('#lightbox-count').textContent = `${currentImage + 1} / ${gallery.length}`;
}
document.querySelectorAll('[data-gallery]').forEach(button => {
  button.addEventListener('click', () => {
    previousFocus = button;
    showImage(gallery.findIndex(item => item.id === button.dataset.gallery));
    if (typeof lightbox.showModal === 'function') {
      lightbox.showModal();
      document.body.classList.add('modal-open');
    } else window.open(gallery[currentImage].src, '_blank', 'noopener');
  });
});
document.querySelector('.lightbox-close').addEventListener('click', () => lightbox.close());
document.querySelector('.lightbox-prev').addEventListener('click', () => showImage(currentImage - 1));
document.querySelector('.lightbox-next').addEventListener('click', () => showImage(currentImage + 1));
lightbox.addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft') { event.preventDefault(); showImage(currentImage - 1); }
  if (event.key === 'ArrowRight') { event.preventDefault(); showImage(currentImage + 1); }
});
lightbox.addEventListener('click', event => { if (event.target === lightbox) lightbox.close(); });
lightbox.addEventListener('close', () => {
  document.body.classList.remove('modal-open');
  previousFocus?.focus();
});
document.querySelector('#year').textContent = new Date().getFullYear();
