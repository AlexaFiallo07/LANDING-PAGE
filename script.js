document.addEventListener('DOMContentLoaded', () => {

  // ============================================
  // 1. CURSOR PERSONALIZADO
  // ============================================
  const cursorGlow = document.getElementById('cursorGlow');
  const cursorDot = document.getElementById('cursorDot');

  if (cursorGlow && cursorDot) {
    document.addEventListener('mousemove', (e) => {
      cursorGlow.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      cursorDot.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    });

    document.querySelectorAll('a, button, .feature-card, .testimonial-card-main, input, textarea').forEach(el => {
      el.addEventListener('mouseenter', () => cursorDot.classList.add('hover'));
      el.addEventListener('mouseleave', () => cursorDot.classList.remove('hover'));
    });

    if ('ontouchstart' in window) {
      cursorGlow.style.display = 'none';
      cursorDot.style.display = 'none';
      document.body.style.cursor = 'auto';
    }
  }

  // ============================================
  // 2. SCROLL PROGRESS BAR
  // ============================================
  const scrollBar = document.getElementById('scrollProgress');
  if (scrollBar) {
    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      scrollBar.style.width = `${progress}%`;
    });
  }

  // ============================================
  // 3. NAVBAR SCROLL EFFECT
  // ============================================
  const header = document.getElementById('header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 80) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  // ============================================
  // 4. MOBILE MENU TOGGLE
  // ============================================
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });
  }

  // ============================================
  // 5. 3D CUBE ROTATION ON MOUSE
  // ============================================
  const cube = document.getElementById('cube');
  const heroVisual = document.getElementById('heroVisual');

  if (cube && heroVisual) {
    let rotX = -15;
    let rotY = 0;
    let targetRotX = -15;
    let targetRotY = 0;
    let isHovering = false;

    heroVisual.addEventListener('mouseenter', () => { isHovering = true; });
    heroVisual.addEventListener('mouseleave', () => { isHovering = false; });

    heroVisual.addEventListener('mousemove', (e) => {
      if (!isHovering) return;
      const rect = heroVisual.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      targetRotY = x * 60;
      targetRotX = -15 - y * 30;
    });

    function animateCube() {
      if (!isHovering) {
        targetRotY += 0.3;
      }
      rotX += (targetRotX - rotX) * 0.05;
      rotY += (targetRotY - rotY) * 0.05;
      cube.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
      requestAnimationFrame(animateCube);
    }
    animateCube();
  }

  // ============================================
  // 6. SCROLL REVEAL
  // ============================================
  const revealElements = document.querySelectorAll('[data-reveal]');
  if (revealElements.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = entry.target.dataset.revealDelay || 0;
          setTimeout(() => entry.target.classList.add('visible'), parseInt(delay));
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    revealElements.forEach(el => observer.observe(el));
  }

  // ============================================
  // 7. ANIMATED COUNTERS (Stats rings)
  // ============================================
  const statNumbers = document.querySelectorAll('.stat-num');
  if (statNumbers.length) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.dataset.count, 10);
          const suffix = el.dataset.suffix || '';
          if (isNaN(target)) return;

          let current = 0;
          const increment = Math.max(1, Math.floor(target / 50));
          const update = () => {
            current += increment;
            if (current >= target) {
              el.textContent = target.toLocaleString() + suffix;
              counterObserver.unobserve(el);
              return;
            }
            el.textContent = current.toLocaleString() + suffix;
            requestAnimationFrame(() => setTimeout(update, 30));
          };
          update();
          counterObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    statNumbers.forEach(el => counterObserver.observe(el));
  }

  // ============================================
  // 8. ACTIVE NAV LINK ON SCROLL
  // ============================================
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  if (sections.length && navLinks.length) {
    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
          });
        }
      });
    }, { threshold: 0.25, rootMargin: '-80px 0px 0px 0px' });

    sections.forEach(s => navObserver.observe(s));
  }

  // ============================================
  // 9. TICKER DUPLICATE FOR SEAMLESS LOOP
  // ============================================
  const tickerTrack = document.getElementById('tickerTrack');
  if (tickerTrack) {
    const clone = tickerTrack.cloneNode(true);
    tickerTrack.parentElement.appendChild(clone);
  }

  // ============================================
  // 10. CONTACT FORM VALIDATION
  // ============================================
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    const formMsg = document.getElementById('formMsg');
    const nameInput = document.getElementById('formName');
    const emailInput = document.getElementById('formEmail');
    const messageInput = document.getElementById('formMessage');

    function validateEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = nameInput.value.trim();
      const email = emailInput.value.trim();
      const message = messageInput.value.trim();

      if (!name || !email || !message || !validateEmail(email)) {
        if (!name) nameInput.focus();
        else if (!email || !validateEmail(email)) emailInput.focus();
        else if (!message) messageInput.focus();
        return;
      }

      const btn = contactForm.querySelector('.btn');
      const orig = btn.innerHTML;
      btn.innerHTML = 'Enviando...';
      btn.disabled = true;

      setTimeout(() => {
        formMsg.classList.add('show');
        contactForm.reset();
        btn.innerHTML = orig;
        btn.disabled = false;
        setTimeout(() => formMsg.classList.remove('show'), 5000);
      }, 1200);
    });
  }

  // ============================================
  // 11. JUEGO: SALVA LA PYME (click rápido)
  // ============================================
  let score = 0;
  let timeLeft = 15;
  let timerId = null;
  let gameActive = false;

  const btnStartGame = document.getElementById('btn-start-game');
  const scoreDisplay = document.getElementById('score');
  const timerDisplay = document.getElementById('timer');
  const gameBody = document.getElementById('game-body');

  function startGame() {
    score = 0;
    timeLeft = 15;
    gameActive = true;
    if (timerId) clearInterval(timerId);
    if (scoreDisplay) scoreDisplay.innerText = '0';
    if (timerDisplay) timerDisplay.innerText = '15s';

    gameBody.innerHTML = `
      <p class="text-sm text-white/50 font-roboto mb-2">¡Da clic lo más rápido que puedas!</p>
      <button id="btn-clicker" class="btn-game-click w-full font-poppins font-bold bg-brand-primary text-white py-8 rounded-xl shadow-lg active:scale-95 transition text-2xl hover:bg-blue-600">
        👆 +10 puntos
      </button>
    `;

    document.getElementById('btn-clicker').addEventListener('click', function onClick() {
      if (!gameActive) return;
      score += 10;
      if (scoreDisplay) scoreDisplay.innerText = score;
      this.style.transform = 'scale(0.93)';
      setTimeout(() => this.style.transform = 'scale(1)', 80);
    });

    timerId = setInterval(() => {
      timeLeft--;
      if (timerDisplay) timerDisplay.innerText = timeLeft + 's';
      if (timeLeft <= 0) {
        clearInterval(timerId);
        gameActive = false;
        endGame();
      }
    }, 1000);
  }

  if (btnStartGame) {
    btnStartGame.addEventListener('click', startGame);
  }

  function endGame() {
    if (!gameBody) return;
    gameBody.innerHTML = `
      <div>
        <p class="font-poppins font-bold text-3xl text-brand-warning mb-1">⏱ ¡Tiempo!</p>
        <p class="text-sm text-white/60 mb-2">Procesaste <strong class="text-white text-2xl">${score}</strong> pts</p>
        <p class="text-xs text-white/30 mb-5">en 15 segundos</p>
        <button id="btn-restart" class="w-full font-poppins font-bold bg-brand-primary text-white py-4 rounded-xl hover:bg-blue-600 transition text-lg">
          ↻ Jugar de nuevo
        </button>
      </div>
    `;
    document.getElementById('btn-restart').addEventListener('click', startGame);
  }

  // ============================================
  // 12. PARALLAX BLOBS EN HERO
  // ============================================
  const blobs = document.querySelectorAll('.blob-morph');
  if (blobs.length) {
    document.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      blobs.forEach((blob, i) => {
        const speed = 15 + i * 8;
        blob.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
      });
    });
  }

  // ============================================
  // 13. RING FILL ANIMATION ON SCROLL
  // ============================================
  const ringFills = document.querySelectorAll('.ring-fill');
  if (ringFills.length) {
    const ringObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const fill = entry.target;
          const pct = fill.style.getPropertyValue('--pct');
          fill.style.strokeDashoffset = `calc(326.7 - (326.7 * ${pct}) / 100)`;
          ringObserver.unobserve(fill);
        }
      });
    }, { threshold: 0.3 });

    ringFills.forEach(fill => ringObserver.observe(fill));
  }

  console.log('🧠 EFFIADMI — sistema vivo cargado');
});
