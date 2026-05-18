document.addEventListener('DOMContentLoaded', () => {
    // UI Elements
    const navItems = document.querySelectorAll('.menuItens li');
    const sections = document.querySelectorAll('section[id]');
    const hamburger = document.querySelector('.hamburger');
    const menuItens = document.querySelector('.menuItens');
    const menuLinks = document.querySelectorAll('.menuItens a');
    const scrollOffset = document.body.classList.contains('home-page') ? 0 : 100;
    const activeMenuOffset = document.body.classList.contains('home-page') ? 2 : 140;

    // 1. Active menu state based on the section currently at the top of the viewport.
    function updateActiveMenu() {
        const marker = window.scrollY + activeMenuOffset;
        let activeId = '';

        sections.forEach(section => {
            if (marker >= section.offsetTop) {
                activeId = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            const link = item.querySelector('a');
            const href = link ? link.getAttribute('href') : '';

            item.classList.toggle('active', Boolean(activeId) && (href === `#${activeId}` || href.endsWith(`#${activeId}`)));
        });
    }

    window.addEventListener('scroll', updateActiveMenu, { passive: true });
    window.addEventListener('resize', updateActiveMenu);
    updateActiveMenu();

    // 2. Mobile Hamburger Menu Toggle
    if (hamburger && menuItens) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            menuItens.classList.toggle('active');
            hamburger.closest('.menu')?.classList.toggle('menu-open', menuItens.classList.contains('active'));
        });

        menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                menuItens.classList.remove('active');
                hamburger.closest('.menu')?.classList.remove('menu-open');
            });
        });
    }

    // 3. Smooth scroll for internal links
    document.querySelectorAll('a[href*="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            const [path, hash] = href.split('#');
            
            // Check if we are on the page where the hash exists
            const isSamePage = !path ||
                             path === window.location.pathname.split('/').pop() ||
                             path === 'index.html' ||
                             (path === 'index.html' && window.location.pathname === '/') ||
                             (window.location.pathname.endsWith(path));

            if (isSamePage) {
                const targetElement = document.getElementById(hash);
                if (targetElement) {
                    e.preventDefault();
                    
                    if (hamburger) {
                        hamburger.classList.remove('active');
                        menuItens.classList.remove('active');
                        hamburger.closest('.menu')?.classList.remove('menu-open');
                    }

                    // Use offsetTop to get the actual static position in the document
                    // getBoundingClientRect() is incorrect for position: sticky elements
                    const offsetPosition = Math.max(targetElement.offsetTop - scrollOffset, 0);

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });

                    history.pushState(null, null, `#${hash}`);
                }
            }
        });
    });

    // 4. Book page transition
    document.querySelectorAll('.editorial-link, .book-primary-link, a[href="o-encontro.html"]').forEach(link => {
        if (link.getAttribute('href') === 'o-encontro.html') {
            link.addEventListener('click', (e) => {
                const shouldSkipTransition = link.target === '_blank' || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0;
                if (shouldSkipTransition) return;

                e.preventDefault();
                document.body.classList.add('book-page-leaving');
                setTimeout(() => {
                    window.location.href = link.href;
                }, 500);
            });
        }
    });

    // 5. Sticky Sections Logic (Fix for tall sections)
    const stickySections = document.querySelectorAll('.valueItem');
    function updateStickyTops() {
        const windowHeight = window.innerHeight;
        stickySections.forEach(section => {
            const height = section.offsetHeight;
            if (height > windowHeight - 80) {
                section.style.top = `${windowHeight - height}px`;
            } else {
                section.style.top = '80px';
            }
        });
    }

    window.addEventListener('resize', updateStickyTops);
    if (window.ResizeObserver) {
        const resizeObserver = new ResizeObserver(() => updateStickyTops());
        stickySections.forEach(s => resizeObserver.observe(s));
    }
    updateStickyTops();

    // 6. Handle hash on initial load
    if (window.location.hash) {
        const targetId = window.location.hash.substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            setTimeout(() => {
                const bodyRect = document.body.getBoundingClientRect().top;
                const elementRect = targetElement.getBoundingClientRect().top;
                const elementPosition = elementRect - bodyRect;
                const offsetPosition = Math.max(elementPosition - scrollOffset, 0);

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }, 600);
        }
    }
});
