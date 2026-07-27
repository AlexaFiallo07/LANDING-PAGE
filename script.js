/* ============================================
   EFFIADMI — Interactivity v2.0
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. CUSTOM CURSOR
    // ==========================================
    function initCursor() {
        const glow = document.getElementById('cursorGlow');
        const dot = document.getElementById('cursorDot');
        if (!glow || !dot) return;

        let mouseX = -200, mouseY = -200;
        let glowX = -200, glowY = -200;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            dot.style.left = mouseX + 'px';
            dot.style.top = mouseY + 'px';
        });

        function animateGlow() {
            glowX += (mouseX - glowX) * 0.08;
            glowY += (mouseY - glowY) * 0.08;
            glow.style.left = glowX + 'px';
            glow.style.top = glowY + 'px';
            requestAnimationFrame(animateGlow);
        }
        animateGlow();

        const hoverTargets = document.querySelectorAll('a, button, .feature-card, .testimonial-card-main, .btn');
        hoverTargets.forEach(el => {
            el.addEventListener('mouseenter', () => dot.classList.add('hover'));
            el.addEventListener('mouseleave', () => dot.classList.remove('hover'));
        });

        document.addEventListener('mouseleave', () => {
            glow.style.opacity = '0';
            dot.style.opacity = '0';
        });
        document.addEventListener('mouseenter', () => {
            glow.style.opacity = '1';
            dot.style.opacity = '1';
        });
    }
    initCursor();

    // ==========================================
    // 2. SCROLL PROGRESS BAR
    // ==========================================
    function initScrollProgress() {
        const bar = document.getElementById('scrollProgress');
        if (!bar) return;
        window.addEventListener('scroll', () => {
            const h = document.documentElement;
            const pct = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
            bar.style.width = pct + '%';
        }, { passive: true });
    }
    initScrollProgress();

    // ==========================================
    // 3. NAVBAR SCROLL
    // ==========================================
    function initNavbar() {
        const header = document.getElementById('header');
        if (!header) return;
        window.addEventListener('scroll', () => {
            header.classList.toggle('scrolled', window.scrollY > 60);
        }, { passive: true });
    }
    initNavbar();

    // ==========================================
    // 4. MOBILE MENU
    // ==========================================
    function initMobileMenu() {
        const toggle = document.getElementById('navToggle');
        const menu = document.getElementById('navMenu');
        if (!toggle || !menu) return;

        toggle.addEventListener('click', () => {
            toggle.classList.toggle('active');
            menu.classList.toggle('active');
        });

        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                toggle.classList.remove('active');
                menu.classList.remove('active');
            });
        });
    }
    initMobileMenu();

    // ==========================================
    // 5. ACTIVE NAV LINK
    // ==========================================
    function initActiveNav() {
        const sections = document.querySelectorAll('section[id]');
        const links = document.querySelectorAll('.nav-link:not(.btn-nav)');
        if (!sections.length || !links.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.id;
                    links.forEach(link => {
                        link.classList.toggle('active', link.getAttribute('href') === '#' + id);
                    });
                }
            });
        }, { threshold: 0.3, rootMargin: '-80px 0px 0px 0px' });

        sections.forEach(s => observer.observe(s));
    }
    initActiveNav();

    // ==========================================
    // 6. SCROLL REVEAL (Staggered)
    // ==========================================
    function initReveal() {
        const els = document.querySelectorAll('[data-reveal]');
        if (!els.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const delay = parseInt(el.dataset.revealDelay) || 0;
                    setTimeout(() => {
                        el.classList.add('visible');
                    }, delay);
                    observer.unobserve(el);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

        els.forEach(el => observer.observe(el));
    }
    initReveal();

    // ==========================================
    // 7. STATS RING COUNTERS
    // ==========================================
    function initStats() {
        const statCards = document.querySelectorAll('.stat-card');
        if (!statCards.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const card = entry.target;
                    const numEl = card.querySelector('.stat-num');
                    if (!numEl) return;

                    const target = parseInt(numEl.dataset.count, 10);
                    const suffix = numEl.dataset.suffix || '';
                    if (isNaN(target)) return;

                    let current = 0;
                    const steps = 60;
                    const increment = target / steps;
                    const stepTime = 1200 / steps;

                    const update = () => {
                        current += increment;
                        if (current >= target) {
                            numEl.textContent = target.toLocaleString() + suffix;
                            observer.unobserve(card);
                            return;
                        }
                        numEl.textContent = Math.floor(current).toLocaleString() + suffix;
                        setTimeout(update, stepTime);
                    };

                    setTimeout(update, 300);
                    observer.unobserve(card);
                }
            });
        }, { threshold: 0.4 });

        statCards.forEach(card => observer.observe(card));
    }
    initStats();

    // ==========================================
    // 8. 3D CUBE INTERACTION
    // ==========================================
    function initCube() {
        const cube = document.getElementById('cube');
        const container = document.querySelector('.cube-container');
        if (!cube || !container) return;

        let isHovering = false;
        let rotX = -15, rotY = 0;
        let targetRotX = -15, targetRotY = 0;
        let autoRotate = true;

        container.addEventListener('mouseenter', () => {
            isHovering = true;
            autoRotate = false;
        });
        container.addEventListener('mouseleave', () => {
            isHovering = false;
            autoRotate = true;
        });
        container.addEventListener('mousemove', (e) => {
            if (!isHovering) return;
            const rect = container.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            targetRotY = x * 40;
            targetRotX = -15 + y * -20;
        });

        function animateCube() {
            if (autoRotate) {
                targetRotY += 0.3;
            }
            rotX += (targetRotX - rotX) * 0.05;
            rotY += (targetRotY - rotY) * 0.05;
            cube.style.transform = 'rotateX(' + rotX + 'deg) rotateY(' + rotY + 'deg)';
            requestAnimationFrame(animateCube);
        }
        animateCube();
    }
    initCube();

    // ==========================================
    // 9. FLOATING ORBS PARALLAX
    // ==========================================
    function initOrbParallax() {
        const orbs = document.querySelectorAll('.gradient-orb');
        if (!orbs.length) return;

        document.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 2;
            const y = (e.clientY / window.innerHeight - 0.5) * 2;

            orbs.forEach((orb, i) => {
                const speed = 10 + i * 5;
                const moveX = x * speed;
                const moveY = y * speed;
                orb.style.transform = 'translate(' + moveX + 'px, ' + moveY + 'px)';
            });
        });
    }
    initOrbParallax();

    // ==========================================
    // 10. CONTACT FORM
    // ==========================================
    function initForm() {
        const form = document.getElementById('contactForm');
        if (!form) return;

        const name = document.getElementById('formName');
        const email = document.getElementById('formEmail');
        const message = document.getElementById('formMessage');
        const msg = document.getElementById('formMsg');

        form.addEventListener('submit', (e) => {
            e.preventDefault();

            let valid = true;
            const fields = [
                { el: name, test: function(v) { return v.trim().length > 0; } },
                { el: email, test: function(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); } },
                { el: message, test: function(v) { return v.trim().length > 0; } }
            ];

            fields.forEach(function(field) {
                var el = field.el;
                var test = field.test;
                var floating = el.closest('.form-floating');
                if (!test(el.value)) {
                    floating.style.borderColor = '#EB5757';
                    valid = false;
                } else {
                    floating.style.borderColor = '';
                }
                el.addEventListener('input', function() {
                    floating.style.borderColor = '';
                }, { once: true });
            });

            if (!valid) return;

            var btn = form.querySelector('.btn');
            var orig = btn.innerHTML;
            btn.innerHTML = 'Enviando...';
            btn.disabled = true;

            setTimeout(function() {
                msg.classList.add('show');
                form.reset();
                btn.innerHTML = orig;
                btn.disabled = false;
                setTimeout(function() { msg.classList.remove('show'); }, 5000);
            }, 1200);
        });
    }
    initForm();

    // ==========================================
    // 11. SMOOTH ANCHOR SCROLL
    // ==========================================
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            var target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    console.log('\u{1F680} EFFIADMI v2 \u2014 Interactive experience loaded');
});

