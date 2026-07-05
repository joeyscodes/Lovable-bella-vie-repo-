// Bella Vie — cinematic interactions
(function(){
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));

  // Loader
  window.addEventListener('load', () => {
    setTimeout(() => $('.loader')?.classList.add('hidden'), 500);
  });

  // Scroll progress + nav state
  const nav = $('.nav'); const prog = $('.progress');
  const onScroll = () => {
    const y = window.scrollY;
    if (nav) nav.classList.toggle('scrolled', y > 30);
    if (prog){
      const h = document.documentElement.scrollHeight - window.innerHeight;
      prog.style.width = Math.min(100, (y / h) * 100) + '%';
    }
  };
  document.addEventListener('scroll', onScroll, { passive:true });
  onScroll();

  // Mobile menu
  const burger = $('.burger'); const menu = $('.mobile-menu');
  if (burger && menu){
    burger.addEventListener('click', () => {
      burger.classList.toggle('open');
      menu.classList.toggle('open');
      document.body.style.overflow = menu.classList.contains('open') ? 'hidden' : '';
    });
    $$('.mobile-menu a').forEach(a => a.addEventListener('click', () => {
      burger.classList.remove('open'); menu.classList.remove('open'); document.body.style.overflow = '';
    }));
  }

  // Reveal on scroll
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.14, rootMargin: '0px 0px -60px 0px' });
  $$('.reveal').forEach(el => io.observe(el));

  // 3D tilt on service cards
  const tiltEls = $$('[data-tilt]');
  tiltEls.forEach(el => {
    let raf;
    el.addEventListener('mousemove', (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - .5;
      const y = (e.clientY - r.top) / r.height - .5;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.transform = `perspective(1000px) rotateY(${x*8}deg) rotateX(${-y*8}deg) translateY(-6px)`;
      });
    });
    el.addEventListener('mouseleave', () => { el.style.transform = ''; });
  });

  // Hero parallax
  const heroImg = $('.hero-media img');
  if (heroImg){
    document.addEventListener('scroll', () => {
      const y = window.scrollY;
      if (y < window.innerHeight){
        heroImg.style.transform = `scale(1.02) translateY(${y * 0.15}px)`;
      }
    }, { passive:true });
  }

  // Contact form (client-side)
  const form = $('#contact-form');
  if (form){
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(form));
      const msg = `Hello Bella Vie! %0A%0AName: ${data.name}%0APhone: ${data.phone}%0AService: ${data.service}%0AMessage: ${data.message}`;
      const ok = $('#form-ok');
      window.open(`https://wa.me/971509629095?text=${msg}`, '_blank');
      if (ok){ ok.style.display = 'block'; setTimeout(()=> ok.style.display='none', 6000); }
      form.reset();
    });
  }

  // Set year
  const y = $('#year'); if (y) y.textContent = new Date().getFullYear();

  // Active link
  const path = location.pathname.split('/').pop() || 'index.html';
  $$('.nav-links a, .mobile-menu a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === path) a.classList.add('active');
  });
})();
