<!-- JAVASCRIPT PURO INTEGRADO -->
    <script>
        document.addEventListener('DOMContentLoaded', () => {
            // 1. ATUALIZAÇÃO AUTOMÁTICA DO ANO NO RODAPÉ
            const yearSpan = document.getElementById('current-year');
            if (yearSpan) {
                yearSpan.textContent = new Date().getFullYear();
            }

            // 2. NAVEGAÇÃO MOBILE TOGGLE
            const mobileToggle = document.getElementById('mobile-toggle');
            const navMenu = document.getElementById('nav-menu');
            
            if (mobileToggle && navMenu) {
                mobileToggle.addEventListener('click', () => {
                    const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
                    mobileToggle.setAttribute('aria-expanded', !isExpanded);
                    mobileToggle.classList.toggle('active');
                    navMenu.classList.toggle('active');
                });

                // Fechar menu ao clicar num link
                const navLinks = navMenu.querySelectorAll('.nav-link');
                navLinks.forEach(link => {
                    link.addEventListener('click', () => {
                        mobileToggle.setAttribute('aria-expanded', 'false');
                        mobileToggle.classList.remove('active');
                        navMenu.classList.remove('active');
                    });
                });
            }

            // 3. SCROLL E HEADER STICKY
            const header = document.getElementById('header');
            window.addEventListener('scroll', () => {
                if (window.scrollY > 30) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
            }, { passive: true });

            // 4. MENU DINÂMICO DURANTE O SCROLL (INTERSECTION OBSERVER)
            const sections = document.querySelectorAll('section[id]');
            const navLinks = document.querySelectorAll('.nav-link');

            if (sections.length > 0 && navLinks.length > 0) {
                const observerOptions = {
                    root: null,
                    rootMargin: '-20% 0px -60% 0px',
                    threshold: 0
                };

                const sectionObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const id = entry.target.getAttribute('id');
                            navLinks.forEach(link => {
                                link.classList.remove('active');
                                if (link.getAttribute('href') === `#${id}`) {
                                    link.classList.add('active');
                                }
                            });
                        }
                    });
                }, observerOptions);

                sections.forEach(section => sectionObserver.observe(section));
            }

            // 5. SISTEMA DE REVELAÇÃO SUAVE AO SCROLL (.reveal)
            const reveals = document.querySelectorAll('.reveal');
            if (reveals.length > 0) {
                const revealObserver = new IntersectionObserver((entries, observer) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('active');
                            observer.unobserve(entry.target);
                        }
                    });
                }, {
                    root: null,
                    threshold: 0.1,
                    rootMargin: '0px 0px -40px 0px'
                });

                reveals.forEach(reveal => revealObserver.observe(reveal));
            }

            // 6. EFEITO DE PROXIMIDADE E BRILHO DO CURSOR (DESKTOP)
            const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

            if (!isTouchDevice && !prefersReducedMotion) {
                // Criar o elemento visual do cursor spotlight
                const cursorGlow = document.createElement('div');
                cursorGlow.className = 'cursor-glow';
                document.body.appendChild(cursorGlow);

                let mouseX = -100;
                let mouseY = -100;

                window.addEventListener('mousemove', (e) => {
                    mouseX = e.clientX;
                    mouseY = e.clientY;
                    cursorGlow.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
                }, { passive: true });

                // Efeito sutil de brilho nos cards com o movimento
                const interactiveCards = document.querySelectorAll('.glass-card, .stat-card');
                interactiveCards.forEach(card => {
                    card.addEventListener('mousemove', (e) => {
                        const rect = card.getBoundingClientRect();
                        const x = e.clientX - rect.left;
                        const y = e.clientY - rect.top;
                        card.style.setProperty('--mouse-x', `${x}px`);
                        card.style.setProperty('--mouse-y', `${y}px`);
                    });
                });
            }
        });
    </script>