/* =====================================================================
   Ilú Odara — Escola de Atabaques · Landing page "Ritmos do Candomblé"
   script.js — JavaScript puro, sem dependências

   Conteúdo:
   01. Ano dinâmico do rodapé
   02. Reveal on scroll (IntersectionObserver + prefers-reduced-motion)
   03. Fachada de vídeo do YouTube (iframe carrega só após o clique)
   04. FAQ em accordion (acessível por teclado)
   05. Barra fixa de CTA no mobile
   ===================================================================== */

(function () {
    'use strict';

    /* 01. ANO DINÂMICO DO RODAPÉ --------------------------------------- */
    const anoEl = document.getElementById('ano');
    if (anoEl) anoEl.textContent = String(new Date().getFullYear());


    /* 02. REVEAL ON SCROLL ---------------------------------------------- */
    const revealEls = Array.from(document.querySelectorAll('.reveal'));
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reducedMotion || !('IntersectionObserver' in window)) {
        // Sem animação: exibe tudo imediatamente
        revealEls.forEach((el) => el.classList.add('is-visible'));
    } else {
        const io = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        io.unobserve(entry.target); // anima apenas uma vez
                    }
                });
            },
            { threshold: 0.12, rootMargin: '0px 0px -48px 0px' }
        );
        revealEls.forEach((el) => io.observe(el));
    }


    /* 03. FACHADA DE VÍDEO ------------------------------------------------ */
    /* O iframe do YouTube só é criado quando o usuário clica na thumbnail,
       mantendo o carregamento inicial da página leve. */
    document.querySelectorAll('[data-video-id]').forEach((facade) => {
        facade.addEventListener('click', () => {
            const videoId = facade.getAttribute('data-video-id');

            const iframe = document.createElement('iframe');
            iframe.className = 'video__iframe';
            iframe.src = 'https://www.youtube-nocookie.com/embed/' + videoId + '?autoplay=1&rel=0';
            iframe.title = facade.getAttribute('data-video-title') || 'Vídeo do Ilú Odara';
            iframe.allow = 'autoplay; fullscreen; picture-in-picture; encrypted-media';
            iframe.allowFullscreen = true;

            facade.replaceWith(iframe);
            iframe.focus();
        }, { once: true });
    });


    /* 04. FAQ ACCORDION ---------------------------------------------------- */
    const faqItems = Array.from(document.querySelectorAll('.faq__item'));

    function closeItem(item) {
        item.classList.remove('is-open');
        const btn = item.querySelector('.faq__question');
        if (btn) btn.setAttribute('aria-expanded', 'false');
    }

    faqItems.forEach((item) => {
        const btn = item.querySelector('.faq__question');
        if (!btn) return;

        btn.addEventListener('click', () => {
            const isOpen = item.classList.contains('is-open');

            // Comportamento de accordion: fecha os outros itens
            faqItems.forEach((other) => { if (other !== item) closeItem(other); });

            if (isOpen) {
                closeItem(item);
            } else {
                item.classList.add('is-open');
                btn.setAttribute('aria-expanded', 'true');
            }
        });
    });


    /* 05. BARRA FIXA DE CTA (MOBILE) ---------------------------------------- */
    /* A barra aparece somente quando o hero, a oferta e o CTA final
       estão fora da tela — evita redundância e não invade a experiência. */
    const sticky = document.getElementById('sticky-cta');

    if (sticky && 'IntersectionObserver' in window) {
        const hideZones = document.querySelectorAll('[data-hide-sticky]');
        const visibleZones = new Set();

        const update = () => {
            const show = visibleZones.size === 0;
            sticky.classList.toggle('is-active', show);
            document.body.classList.toggle('has-sticky', show);
        };

        const io = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) visibleZones.add(entry.target);
                    else visibleZones.delete(entry.target);
                });
                update();
            },
            { threshold: 0.25 }
        );

        hideZones.forEach((zone) => io.observe(zone));
    }
})();