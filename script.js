/* ============================================
   EFFIADMI - LANDING PAGE
   Interactivity & Animations
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. PARTICLES CANVAS (Hero Background)
    // ==========================================
    function initParticles() {
        const canvas = document.getElementById('particlesCanvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let particles = [];
        let mouseX = -1000, mouseY = -1000;

        function resize() {
            canvas.width = canvas.parentElement.offsetWidth;
            canvas.height = canvas.parentElement.offsetHeight;
        }

        resize();
        window.addEventListener('resize', resize);

        class Particle {
            constructor() { this.reset(); }
            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 3 + 1;
                this.speedX = (Math.random() - 0.5) * 0.5;
                this.speedY = (Math.random() - 0.5) * 0.5;
                this.opacity = Math.random() * 0.5 + 0.2;
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                // Mouse interaction
                const dx = this.x - mouseX;
                const dy = this.y - mouseY;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    const force = (120 - dist) / 120;
                    this.x += dx * force * 0.03;
                    this.y += dy * force * 0.03;
                }

                if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
                if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
                ctx.fill();
            }
        }

        // Create particles
        const count = Math.min(80, Math.floor((canvas.width * canvas.height) / 12000));
        for (let i = 0; i < count; i++) {
            particles.push(new Particle());
        }

        // Connection lines
        function drawConnections() {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 150) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(255, 255, 255, ${0.08 * (1 - dist / 150)})`;
                        ctx.lineWidth = 0.6;
                        ctx.stroke();
                    }
                }
            }
        }

        // Mouse move
        canvas.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            mouseX = e.clientX - rect.left;
            mouseY = e.clientY - rect.top;
        });

        canvas.addEventListener('mouseleave', () => {
            mouseX = -1000;
            mouseY = -1000;
        });

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => { p.update(); p.draw(); });
            drawConnections();
            requestAnimationFrame(animate);
        }

        animate();
    }

    initParticles();

    // ==========================================
    // 2. TYPING EFFECT (Hero Title)
    // ==========================================
    function initTyping() {
        const el = document.getElementById('typed-text');
        if (!el) return;

        const phrases = [
            'Optimiza la gestión de tu PyME',
            'Controla tu inventario en tiempo real',
            'Automatiza tus procesos administrativos',
            'Toma decisiones basadas en datos'
        ];

        let phraseIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let isPaused = false;

        function type() {
            const currentPhrase = phrases[phraseIndex];
            let displayText;

            if (isPaused) {
                setTimeout(type, 2000);
                isPaused = false;
                isDeleting = true;
                return;
            }

            if (isDeleting) {
                displayText = currentPhrase.substring(0, charIndex - 1);
                charIndex--;
            } else {
                displayText = currentPhrase.substring(0, charIndex + 1);
                charIndex++;
            }

            el.textContent = displayText;

            if (!isDeleting && charIndex === currentPhrase.length) {
                // Finished typing — pause before delete
                isPaused = true;
                setTimeout(type, 2000);
                return;
            }

            if (isDeleting && charIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                setTimeout(type, 400);
                return;
            }

            const speed = isDeleting ? 50 : 90;
            setTimeout(type, speed);
        }

        type();
    }

    initTyping();

    // ==========================================
    // 3. SCROLL REVEAL (Intersection Observer)
    // ==========================================
    function initScrollReveal() {
        const elements = document.querySelectorAll('.reveal');
        if (!elements.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        elements.forEach(el => observer.observe(el));
    }

    initScrollReveal();

    // ==========================================
    // 4. ANIMATED COUNTERS (Stats)
    // ==========================================
    function initCounters() {
        const counters = document.querySelectorAll('.stat-number');
        if (!counters.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = parseInt(counter.dataset.target, 10);
                    if (isNaN(target)) return;

                    let current = 0;
                    const increment = Math.max(1, Math.floor(target / 60));
                    const duration = 2000;
                    const stepTime = Math.floor(duration / (target / increment));

                    const updateCounter = () => {
                        current += increment;
                        if (current >= target) {
                            counter.textContent = target.toLocaleString();
                            observer.unobserve(counter);
                            return;
                        }
                        counter.textContent = current.toLocaleString();
                        setTimeout(updateCounter, stepTime);
                    };

                    updateCounter();
                    observer.unobserve(counter);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(c => observer.observe(c));
    }

    initCounters();

    // ==========================================
    // 5. NAVBAR SCROLL EFFECT
    // ==========================================
    function initNavbarScroll() {
        const header = document.getElementById('header');
        if (!header) return;

        let lastScroll = 0;

        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

            if (currentScroll > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }

            lastScroll = currentScroll;
        }, { passive: true });
    }

    initNavbarScroll();

    // ==========================================
    // 6. MOBILE MENU TOGGLE
    // ==========================================
    function initMobileMenu() {
        const toggle = document.getElementById('navToggle');
        const menu = document.getElementById('navMenu');
        if (!toggle || !menu) return;

        toggle.addEventListener('click', () => {
            toggle.classList.toggle('active');
            menu.classList.toggle('active');
        });

        // Close on link click
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                toggle.classList.remove('active');
                menu.classList.remove('active');
            });
        });
    }

    initMobileMenu();

    // ==========================================
    // 7. ACTIVE NAV LINK ON SCROLL
    // ==========================================
    function initActiveNav() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');

        if (!sections.length || !navLinks.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    navLinks.forEach(link => {
                        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
                    });
                }
            });
        }, {
            threshold: 0.3,
            rootMargin: '-80px 0px 0px 0px'
        });

        sections.forEach(section => observer.observe(section));
    }

    initActiveNav();

    // ==========================================
    // 8. TESTIMONIALS SLIDER
    // ==========================================
    function initTestimonials() {
        const track = document.getElementById('testimonialTrack');
        const dotsContainer = document.getElementById('testimonialDots');
        if (!track || !dotsContainer) return;

        const cards = track.querySelectorAll('.testimonial-card');
        const total = cards.length;
        if (total === 0) return;

        let current = 0;
        let interval;

        // Create dots
        for (let i = 0; i < total; i++) {
            const dot = document.createElement('span');
            if (i === 0) dot.classList.add('active');
            dot.dataset.index = i;
            dot.addEventListener('click', () => goTo(i));
            dotsContainer.appendChild(dot);
        }

        const prevBtn = document.querySelector('.testimonial-btn.prev');
        const nextBtn = document.querySelector('.testimonial-btn.next');

        function goTo(index) {
            current = index;
            track.style.transform = `translateX(-${current * 100}%)`;
            document.querySelectorAll('.testimonial-dots span').forEach((dot, i) => {
                dot.classList.toggle('active', i === current);
            });
            resetInterval();
        }

        function next() {
            goTo((current + 1) % total);
        }

        function prev() {
            goTo((current - 1 + total) % total);
        }

        function resetInterval() {
            clearInterval(interval);
            interval = setInterval(next, 5000);
        }

        if (prevBtn) prevBtn.addEventListener('click', prev);
        if (nextBtn) nextBtn.addEventListener('click', next);

        // Start auto-slide
        interval = setInterval(next, 5000);

        // Pause on hover
        const slider = track.parentElement;
        slider.addEventListener('mouseenter', () => clearInterval(interval));
        slider.addEventListener('mouseleave', resetInterval);
    }

    initTestimonials();

    // ==========================================
    // 9. CONTACT FORM VALIDATION
    // ==========================================
    function initForm() {
        const form = document.getElementById('contactForm');
        if (!form) return;

        const name = document.getElementById('formName');
        const email = document.getElementById('formEmail');
        const message = document.getElementById('formMessage');
        const successMsg = document.getElementById('formSuccess');

        function showError(input) {
            const group = input.closest('.form-group');
            if (group) group.classList.add('error');
        }

        function clearError(input) {
            const group = input.closest('.form-group');
            if (group) group.classList.remove('error');
        }

        function validateEmail(value) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        }

        // Real-time validation
        [name, email, message].forEach(input => {
            if (!input) return;
            input.addEventListener('blur', () => {
                if (!input.value.trim()) {
                    showError(input);
                } else if (input === email && !validateEmail(input.value)) {
                    showError(input);
                } else {
                    clearError(input);
                }
            });
            input.addEventListener('input', () => {
                if (input.value.trim()) {
                    if (input === email && !validateEmail(input.value)) return;
                    clearError(input);
                }
            });
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();

            let isValid = true;

            // Validate name
            if (!name.value.trim()) {
                showError(name);
                isValid = false;
            } else {
                clearError(name);
            }

            // Validate email
            if (!email.value.trim() || !validateEmail(email.value)) {
                showError(email);
                isValid = false;
            } else {
                clearError(email);
            }

            // Validate message
            if (!message.value.trim()) {
                showError(message);
                isValid = false;
            } else {
                clearError(message);
            }

            if (isValid) {
                // Simulate sending
                const btn = form.querySelector('.btn');
                const originalText = btn.innerHTML;
                btn.innerHTML = 'Enviando...';
                btn.disabled = true;

                setTimeout(() => {
                    successMsg.classList.add('show');
                    form.reset();
                    btn.innerHTML = originalText;
                    btn.disabled = false;
                    setTimeout(() => successMsg.classList.remove('show'), 5000);
                }, 1500);
            }
        });
    }

    initForm();

    // ==========================================
    // 10. PARALLAX MOCKUP FLOAT ON SCROLL
    // ==========================================
    function initParallax() {
        const mockup = document.querySelector('.hero-visual');
        if (!mockup) return;

        window.addEventListener('scroll', () => {
            const scrollY = window.pageYOffset;
            const heroSection = document.querySelector('.hero');
            if (!heroSection) return;
            const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
            if (scrollY < heroBottom) {
                const speed = 0.15;
                const yOffset = scrollY * speed;
                mockup.style.transform = `translateY(${yOffset}px)`;
            }
        }, { passive: true });
    }

    initParallax();

    console.log('🚀 EFFIADMI Landing Page — fully loaded and ready!');
});

