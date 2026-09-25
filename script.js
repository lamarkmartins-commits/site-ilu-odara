/* =====================================================================
   Ilú Odara — Escola de Atabaques · Landing page "Ritmos do Candomblé"
   script.js — JavaScript moderno, leve e sem dependências
   ===================================================================== */

(function () {
    'use strict';

    /* 01. ANO DINÂMICO DO RODAPÉ --------------------------------------- */
    const anoEl = document.getElementById('ano');
    if (anoEl) {
        anoEl.textContent = String(new Date().getFullYear());
    }


    /* 02. REVEAL ON SCROLL (IntersectionObserver) ----------------------- */
    const revealEls = Array.from(document.querySelectorAll('.reveal'));
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reducedMotion || !('IntersectionObserver' in window)) {
        revealEls.forEach((el) => el.classList.add('is-visible'));
    } else {
        const io = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        io.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
        );
        revealEls.forEach((el) => io.observe(el));
    }


    /* 03. FACHADA DE VÍDEO DO YOUTUBE (Lazy embed) --------------------- */
    document.querySelectorAll('[data-video-id]').forEach((facade) => {
        facade.addEventListener('click', () => {
            const videoId = facade.getAttribute('data-video-id');
            const iframe = document.createElement('iframe');
            iframe.className = 'video__iframe';
            iframe.src = 'https://www.youtube-nocookie.com/embed/' + videoId + '?autoplay=1&rel=0';
            iframe.title = facade.getAttribute('data-video-title') || 'Vídeo de Apresentação Ilú Odara';
            iframe.allow = 'autoplay; fullscreen; picture-in-picture; encrypted-media';
            iframe.allowFullscreen = true;

            const container = facade.closest('.video-facade-container') || facade.parentElement;
            facade.replaceWith(iframe);
            iframe.focus();
        }, { once: true });
    });


    /* 04. FAQ ACCORDION (Acessível por teclado e leitor de tela) -------- */
    const faqItems = Array.from(document.querySelectorAll('.faq-item, .faq__item'));

    function closeFaq(item) {
        item.classList.remove('is-open');
        const btn = item.querySelector('.faq-btn, .faq__question');
        if (btn) btn.setAttribute('aria-expanded', 'false');
    }

    faqItems.forEach((item) => {
        const btn = item.querySelector('.faq-btn, .faq__question');
        if (!btn) return;

        btn.addEventListener('click', () => {
            const isOpen = item.classList.contains('is-open');

            // Fecha os outros itens mantendo comportamento harmonioso de accordion
            faqItems.forEach((other) => {
                if (other !== item) closeFaq(other);
            });

            if (isOpen) {
                closeFaq(item);
            } else {
                item.classList.add('is-open');
                btn.setAttribute('aria-expanded', 'true');
            }
        });
    });


    /* 05. BARRA FIXA DE CTA MOBILE (Sensível à rolagem) ----------------- */
    const sticky = document.getElementById('sticky-cta');

    if (sticky && 'IntersectionObserver' in window) {
        const hideZones = document.querySelectorAll('[data-hide-sticky]');
        const visibleZones = new Set();

        const updateSticky = () => {
            const show = visibleZones.size === 0;
            sticky.classList.toggle('is-active', show);
            document.body.classList.toggle('has-sticky', show);
        };

        const stickyObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        visibleZones.add(entry.target);
                    } else {
                        visibleZones.delete(entry.target);
                    }
                });
                updateSticky();
            },
            { threshold: 0.2 }
        );

        hideZones.forEach((zone) => stickyObserver.observe(zone));
    }


    /* 06. INTERATIVIDADE NOS CARDS DE RITMOS (Micro-animação de toque) -- */
    const rhythmCards = document.querySelectorAll('.rhythm-card');
    rhythmCards.forEach((card) => {
        card.addEventListener('mouseenter', () => {
            const bars = card.querySelectorAll('.r-bar');
            bars.forEach((bar) => {
                bar.style.transform = 'scaleY(1.3)';
                bar.style.transition = 'transform 0.15s ease';
            });
        });
        card.addEventListener('mouseleave', () => {
            const bars = card.querySelectorAll('.r-bar');
            bars.forEach((bar) => {
                bar.style.transform = 'scaleY(1)';
            });
        });
    });

})();