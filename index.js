document.addEventListener('DOMContentLoaded', () => {
    // UI Elements
    const navItems = document.querySelectorAll('.menuItens li');
    const sections = document.querySelectorAll('section[id]');
    const hamburger = document.querySelector('.hamburger');
    const menuItens = document.querySelector('.menuItens');
    const menuLinks = document.querySelectorAll('.menuItens a');

    // 1. Intersection Observer for active menu state
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navItems.forEach(item => {
                    const link = item.querySelector('a');
                    if (link) {
                        const href = link.getAttribute('href');
                        if (href === `#${id}` || href.endsWith(`#${id}`)) {
                            navItems.forEach(i => i.classList.remove('active'));
                            item.classList.add('active');
                        }
                    }
                });
            }
        });
    }, {
        root: null,
        rootMargin: '-40% 0px -60% 0px',
        threshold: 0
    });

    sections.forEach(section => observer.observe(section));

    // 2. Mobile Hamburger Menu Toggle
    if (hamburger && menuItens) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            menuItens.classList.toggle('active');
        });

        menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                menuItens.classList.remove('active');
            });
        });
    }

    // 3. Smooth scroll for internal links
    document.querySelectorAll('a[href*="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            const [path, hash] = href.split('#');
            
            if (!path || path === window.location.pathname.split('/').pop() || path === 'index.html') {
                const targetElement = document.getElementById(hash);

                if (targetElement) {
                    e.preventDefault();
                    
                    if (hamburger) {
                        hamburger.classList.remove('active');
                        menuItens.classList.remove('active');
                    }

                    // Using offsetTop for absolute position relative to body
                    const targetPosition = targetElement.offsetTop - 100;

                    window.scrollTo({
                        top: targetPosition,
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
                const shouldSkipTransition = e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0;
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
    const stickySections = document.querySelectorAll('.valueItem, .diferencial-section');
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
                window.scrollTo({
                    top: targetElement.offsetTop,
                    behavior: 'smooth'
                });
            }, 500);
        }
    }
});
