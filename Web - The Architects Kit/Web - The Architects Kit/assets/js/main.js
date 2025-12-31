document.addEventListener('DOMContentLoaded', () => {

    // 1. CURSOR (Solo Desktop)
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');

    if (cursorDot && cursorOutline) {
        window.addEventListener("mousemove", function (e) {
            const posX = e.clientX;
            const posY = e.clientY;
            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;
            cursorOutline.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, { duration: 500, fill: "forwards" });
        });
    }

    // 2. REVEAL (Aparición)
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('active');
        });
    }, { threshold: 0.1 });
    revealElements.forEach(el => revealObserver.observe(el));

    // 3. MENÚ MÓVIL
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    if(hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('nav-active'); 
            hamburger.classList.toggle('toggle');
        });
    }

    // 4. SISTEMA DE FILTROS (ROBUSTO)
    const productGrid = document.querySelector('.product-grid');
    
    if (productGrid) {
        const searchInput = document.querySelector('.tech-search-box input');
        const categoryLinks = document.querySelectorAll('.tech-filter-list a');
        const priceSlider = document.querySelector('.tech-slider');
        const products = document.querySelectorAll('.product-card');

        let state = { category: 'all', price: 100, search: '' };

// --- FUNCIÓN MAESTRA: APLICA TODOS LOS FILTROS A LA VEZ ---
        function applyFilters() {
            let visibleCount = 0; // Contador de productos visibles
            const noResultsMsg = document.getElementById('no-results-message');

            products.forEach(product => {
                // 1. Leer datos con protección
                const pCategory = product.getAttribute('data-category');
                const pPrice = parseFloat(product.getAttribute('data-price') || '0');
                const pName = (product.getAttribute('data-name') || '').toLowerCase();

                // 2. Verificar condiciones
                const matchesCategory = (state.category === 'all') || (pCategory === state.category);
                const matchesPrice = (pPrice <= state.price);
                const matchesSearch = pName.includes(state.search);

                // 3. Mostrar u Ocultar
                if (matchesCategory && matchesPrice && matchesSearch) {
                    product.style.display = 'block';
                    visibleCount++; // ¡Encontramos uno!
                    requestAnimationFrame(() => {
                        product.style.opacity = '1';
                        product.style.transform = 'translateY(0)';
                    });
                } else {
                    product.style.opacity = '0';
                    product.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        if(product.style.opacity === '0') product.style.display = 'none';
                    }, 300);
                }
            });

            // 4. Mógica del mensaje "No Results"
            if (noResultsMsg) {
                if (visibleCount === 0) {
                    // Si no hay nada visible, mostramos el mensaje con un pequeño delay
                    setTimeout(() => noResultsMsg.style.display = 'block', 300);
                } else {
                    noResultsMsg.style.display = 'none';
                }
            }
        }

        // Eventos
        categoryLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                categoryLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
                state.category = link.getAttribute('data-filter') || 'all';
                applyFilters();
            });
        });

        if(searchInput) {
            searchInput.addEventListener('input', (e) => {
                state.search = e.target.value.toLowerCase().trim();
                applyFilters();
            });
        }

        if(priceSlider) {
            priceSlider.addEventListener('input', (e) => {
                state.price = parseInt(e.target.value);
                applyFilters();
            });
        }
    }

    // ==============================================
    // 5. EXTRAS: SCROLL TOP & COOKIES
    // ==============================================
    
    // --- A. Botón Volver Arriba ---
    const scrollTopBtn = document.getElementById('scrollToTop');
    
    if (scrollTopBtn) {
        // Mostrar botón al bajar 300px
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        });

        // Acción de subir
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // --- B. Aviso de Cookies ---
    const cookieBanner = document.getElementById('cookieConsent');
    const acceptCookiesBtn = document.getElementById('acceptCookies');

    // 1. Verificar si ya aceptó antes (guardado en memoria del navegador)
    if (!localStorage.getItem('cookiesAccepted')) {
        // Si no existe el registro, mostramos el banner
        if(cookieBanner) cookieBanner.style.display = 'block';
    }

    // 2. Al hacer clic en Aceptar
    if (acceptCookiesBtn) {
        acceptCookiesBtn.addEventListener('click', () => {
            // Guardamos la decisión en memoria
            localStorage.setItem('cookiesAccepted', 'true');
            // Ocultamos el banner
            cookieBanner.style.display = 'none';
        });
    }

    // ==============================================
    // 6. TOP BAR CONTROL
    // ==============================================
    const closeBarBtn = document.getElementById('closeTopBar');
    
    if (closeBarBtn) {
        // Verificar si el usuario ya la cerró antes (opcional)
        if (localStorage.getItem('topBarClosed') === 'true') {
            document.body.classList.add('bar-closed');
        }

        closeBarBtn.addEventListener('click', () => {
            document.body.classList.add('bar-closed');
            // Guardar preferencia para que no aparezca de nuevo en esta sesión
            // localStorage.setItem('topBarClosed', 'true'); // Descomenta si quieres que sea permanente
        });
    }
});