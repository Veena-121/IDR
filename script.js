document.addEventListener('DOMContentLoaded', () => {

  // nav scroll state
  const nav = document.querySelector('.nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  // mobile menu
  const hamburger = document.querySelector('.nav__hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  let menuOpen = false;

  const toggleMenu = (force) => {
    menuOpen = typeof force === 'boolean' ? force : !menuOpen;
    mobileMenu.classList.toggle('open', menuOpen);
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    const bars = hamburger.querySelectorAll('span');
    if (menuOpen) {
      bars[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      bars[1].style.opacity = '0';
      bars[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      bars.forEach(b => { b.style.transform = ''; b.style.opacity = ''; });
    }
  };

  hamburger.addEventListener('click', () => toggleMenu());
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => toggleMenu(false));
  });

  // scroll reveal
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const siblings = Array.from(entry.target.parentElement.querySelectorAll('.reveal'));
        const idx = siblings.indexOf(entry.target);
        setTimeout(() => entry.target.classList.add('visible'), idx * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  // stat counters
  const countUp = (el) => {
    const target = parseInt(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - start) / 1400, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(ease * target) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        countUp(entry.target);
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.stat__num[data-target]').forEach(el => statsObserver.observe(el));

  // contact form
  const form = document.querySelector('.contact__form-el');
  const msg = document.querySelector('.form-msg');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('.contact__submit');
      btn.textContent = 'Sending…';
      btn.disabled = true;
      setTimeout(() => {
        btn.innerHTML = '<span>Message Received</span> ✓';
        btn.style.background = '#1a1a1a';
        btn.style.color = '#FF5C00';
        if (msg) {
          msg.style.display = 'block';
          msg.textContent = '// Your message has been logged. A member of the IDR team will be in contact shortly.';
        }
        form.reset();
        setTimeout(() => {
          btn.innerHTML = '<span>Register Interest</span> →';
          btn.disabled = false;
          btn.style.background = '';
          btn.style.color = '';
          if (msg) msg.style.display = 'none';
        }, 4000);
      }, 1200);
    });
  }

  // smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 68, behavior: 'smooth' });
      }
    });
  });

  // cursor glow on desktop
  if (window.matchMedia('(pointer: fine)').matches) {
    const glow = document.createElement('div');
    glow.style.cssText = `
      position: fixed; width: 320px; height: 320px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(255,92,0,0.06) 0%, transparent 70%);
      pointer-events: none; z-index: 9998;
      transform: translate(-50%, -50%);
      transition: transform 0.15s ease;
      top: 0; left: 0;
    `;
    document.body.appendChild(glow);
    document.addEventListener('mousemove', (e) => {
      glow.style.left = e.clientX + 'px';
      glow.style.top = e.clientY + 'px';
    }, { passive: true });
  }

});
