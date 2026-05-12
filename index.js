const navItems = document.querySelectorAll('.menuItens li');
    const sections = document.querySelectorAll('section');

    const observerOptions = {
      root: null,
      rootMargin: '-50% 0px -50% 0px',
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navItems.forEach(item => {
            const link = item.querySelector('a');
            const href = link.getAttribute('href');
            
            // Se estivermos na home ou o link for vazio, removemos o active
            if (entry.target.id === 'home' || !href || href === '#') {
              item.classList.remove('active');
            } else if (href.substring(1) === entry.target.id) {
              item.classList.add('active');
            } else {
              item.classList.remove('active');
            }
          });
        }
      });
    }, observerOptions);

    sections.forEach(section => {
      if (section.id) observer.observe(section);
    });

    // Hamburger Menu Logic
    const hamburger = document.querySelector('.hamburger');
    const menuItens = document.querySelector('.menuItens');
    const menuLinks = document.querySelectorAll('.menuItens a');

    if (hamburger) {
      hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        menuItens.classList.toggle('active');
      });

      // Close the menu when a link is clicked
      menuLinks.forEach(link => {
        link.addEventListener('click', () => {
          hamburger.classList.remove('active');
          menuItens.classList.remove('active');
        });
      });
    }

    // Book page transition
    document.querySelectorAll('a[href="o-encontro.html"]').forEach(link => {
      link.addEventListener('click', event => {
        const shouldSkipTransition = event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0 || window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (shouldSkipTransition) return;

        event.preventDefault();
        document.body.classList.add('book-page-leaving');
        window.setTimeout(() => {
          window.location.href = link.href;
        }, 520);
      });
    });

    // --- Dynamic Mobile Sticky Stacking Logic ---
    // This script calculates the exact top offset required to allow tall mobile sections
    // to scroll completely natively to their end before the sticky stacking animation triggers.
    let mobileStickyStackingInitialized = false;

    function initMobileStickyStacking() {
      if (mobileStickyStackingInitialized) return;
      mobileStickyStackingInitialized = true;

      const stickySections = document.querySelectorAll('.valueItem, .diferencial-section, .biblioteca-section');
      
      function updateStickyTops() {
        const isMobile = window.innerWidth <= 768;
        const windowHeight = window.innerHeight;
        
        stickySections.forEach(section => {
          if (isMobile) {
            const height = section.offsetHeight;
            // No mobile, as seções têm um respiro extra de altura no CSS. O top negativo
            // faz esse trecho virar uma zona de tolerância antes da próxima seção cobrir a atual.
            section.style.top = height > windowHeight ? `${windowHeight - height}px` : '0px';
          } else {
            // No desktop o comportamento é sempre grudar no topo
            section.style.top = '0px';
          }
        });
      }

      window.addEventListener('resize', updateStickyTops);
      
      // We use ResizeObserver to update positions if images load or text wraps, altering height
      if (window.ResizeObserver) {
        const resizeObserver = new ResizeObserver(updateStickyTops);
        stickySections.forEach(s => resizeObserver.observe(s));
      }
      
      updateStickyTops();
    }

    // Initialize when DOM is fully loaded
    document.addEventListener('DOMContentLoaded', initMobileStickyStacking);
    initMobileStickyStacking(); // Also call immediately in case DOM is already loaded
