document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // 1. CONFIGURAÇÕES E DETECÇÃO DE DISPOSITIVO
    // ==========================================
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    const enableMouseEffects = !isTouchDevice && !prefersReducedMotion;

    // ==========================================
    // 2. ATUALIZAÇÃO DO ANO NO RODAPÉ
    // ==========================================
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // ==========================================
    // 3. NAVEGAÇÃO MOBILE TOGGLE
    // ==========================================
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (mobileToggle && navMenu) {
        const toggleMenu = (open) => {
            const shouldOpen = open !== undefined ? open : navMenu.classList.contains('active') === false;
            mobileToggle.setAttribute('aria-expanded', shouldOpen);
            mobileToggle.classList.toggle('active', shouldOpen);
            navMenu.classList.toggle('active', shouldOpen);
        };

        mobileToggle.addEventListener('click', () => toggleMenu());

        // Fechar ao clicar num link
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => toggleMenu(false));
        });
    }

    // ==========================================
    // 4. HEADER STICKY & SCROLL OBSERVERS
    // ==========================================
    const header = document.getElementById('header');
    if (header) {
        window.addEventListener('scroll', () => {
            header.classList.toggle('scrolled', window.scrollY > 30);
        }, { passive: true });
    }

    // Highlighting de seções ativas no menu
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    if (sections.length > 0 && navLinks.length > 0) {
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    navLinks.forEach(link => {
                        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
                    });
                }
            });
        }, { rootMargin: '-20% 0px -60% 0px', threshold: 0 });

        sections.forEach(section => sectionObserver.observe(section));
    }

    // Sistema de Revelação Suave (.reveal)
    const reveals = document.querySelectorAll('.reveal');
    if (reveals.length > 0) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

        reveals.forEach(reveal => revealObserver.observe(reveal));
    }

    // ==========================================
    // 5. INTERAÇÕES AVANÇADAS COM O MOUSE (DESKTOP)
    // ==========================================
    if (enableMouseEffects) {
        
        // --- A. CURSOR CUSTOMIZADO DUPLO (DOT + FOLLOWER) ---
        const cursorDot = document.createElement('div');
        const cursorFollower = document.createElement('div');
        
        cursorDot.className = 'custom-cursor-dot';
        cursorFollower.className = 'custom-cursor-follower';
        
        document.body.appendChild(cursorDot);
        document.body.appendChild(cursorFollower);

        let mouseX = -100, mouseY = -100;
        let followerX = -100, followerY = -100;

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            // Dot imediato
            cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;

            // Rastro de Partículas ao mover o mouse
            createTrailParticle(mouseX, mouseY);
        }, { passive: true });

        // Animação suave para o Follower (Linear Interpolation - LERP)
        function renderCursor() {
            followerX += (mouseX - followerX) * 0.15;
            followerY += (mouseY - followerY) * 0.15;

            cursorFollower.style.transform = `translate3d(${followerX}px, ${followerY}px, 0)`;
            requestAnimationFrame(renderCursor);
        }
        requestAnimationFrame(renderCursor);

        // Estados do Cursor (Hover em elementos clicáveis)
        const hoverables = document.querySelectorAll('a, button, input, .interactive, .glass-card');
        hoverables.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorDot.classList.add('cursor-hover');
                cursorFollower.classList.add('cursor-hover');
            });
            el.addEventListener('mouseleave', () => {
                cursorDot.classList.remove('cursor-hover');
                cursorFollower.classList.remove('cursor-hover');
            });
        });

        // --- B. EFEITO TILT 3D E SPOTLIGHT EM CARDS ---
        const tiltCards = document.querySelectorAll('.glass-card, .stat-card, .tilt-card');

        tiltCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                // Variáveis CSS para efeito Spotlight (Brilho dinâmico)
                card.style.setProperty('--mouse-x', `${x}px`);
                card.style.setProperty('--mouse-y', `${y}px`);

                // Cálculo da inclinação 3D
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = ((y - centerY) / centerY) * -10; // Máximo 10deg
                const rotateY = ((x - centerX) / centerX) * 10;  // Máximo 10deg

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            });

            card.addEventListener('mouseleave', () => {
                // Reset suave ao sair
                card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
                card.style.transition = 'transform 0.5s ease';
            });

            card.addEventListener('mouseenter', () => {
                card.style.transition = 'none'; // Remove transição no enter para resposta imediata
            });
        });

        // --- C. BOTÕES MAGNÉTICOS ---
        const magneticElements = document.querySelectorAll('.btn, .btn-magnetic, .social-icon');

        magneticElements.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;

                // Move o botão em direção ao cursor (força magnética)
                btn.style.transform = `translate3d(${x * 0.3}px, ${y * 0.3}px, 0)`;
            });

            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'translate3d(0px, 0px, 0)';
                btn.style.transition = 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            });

            btn.addEventListener('mouseenter', () => {
                btn.style.transition = 'none';
            });
        });

        // --- D. PARALLAX SUTIL COM O MOVIMENTO DO MOUSE ---
        const parallaxElements = document.querySelectorAll('.parallax-element');

        window.addEventListener('mousemove', (e) => {
            const { clientX, clientY } = e;
            const windowWidth = window.innerWidth;
            const windowHeight = window.innerHeight;

            const moveX = (clientX - windowWidth / 2) / windowWidth;
            const moveY = (clientY - windowHeight / 2) / windowHeight;

            parallaxElements.forEach(el => {
                const speed = parseFloat(el.getAttribute('data-parallax-speed')) || 20;
                el.style.transform = `translate3d(${moveX * speed}px, ${moveY * speed}px, 0)`;
            });
        }, { passive: true });

        // --- E. SISTEMA DE PARTÍCULAS NO RASTRO DO MOUSE ---
        let lastParticleTime = 0;
        function createTrailParticle(x, y) {
            const now = Date.now();
            if (now - lastParticleTime < 40) return; // Limita a taxa de geração (60fps friendly)
            lastParticleTime = now;

            const particle = document.createElement('div');
            particle.className = 'cursor-particle';
            particle.style.left = `${x}px`;
            particle.style.top = `${y}px`;

            document.body.appendChild(particle);

            setTimeout(() => {
                particle.remove();
            }, 600); // Remove do DOM após terminar a animação CSS
        }
    }
});