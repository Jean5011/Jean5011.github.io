// ============================================
// CARGA DINÁMICA DE COMPONENTES HTML
// ============================================
document.addEventListener('DOMContentLoaded', async () => {
    const includes = document.querySelectorAll('[data-include]');
    for (let el of includes) {
        const file = el.getAttribute('data-include');
        try {
            const response = await fetch(file);
            if (response.ok) {
                el.innerHTML = await response.text();
            } else {
                console.error(`Error cargando componente: ${file}`);
            }
        } catch (error) {
            console.error(`Error de red al cargar ${file}:`, error);
        }
    }
    // Una vez que todos los componentes están en el DOM, disparamos un evento.
    document.dispatchEvent(new Event('componentsLoaded'));
});

// ============================================
// FUNCIONALIDAD DEL CARRUSEL DE PROYECTOS
// ============================================
document.addEventListener('componentsLoaded', () => {
    const carousel = document.querySelector('.projects-carousel');
    const leftBtn = document.querySelector('.left-btn');
    const rightBtn = document.querySelector('.right-btn');
    const projectCard = document.querySelector('.project-card');

    if (!carousel || !leftBtn || !rightBtn || !projectCard) {
        console.warn("Algunos elementos del carrusel no están disponibles.");
        return;
    }

    const getScrollAmount = () => {
        // Recalcula el ancho de la tarjeta en cada llamada para manejar el redimensionamiento de la ventana.
        const card = document.querySelector('.project-card');
        if (card) {
            return card.offsetWidth + 20; // 20 es el 'gap' definido en CSS.
        }
        return 300; // Un valor de respaldo.
    };

    let autoScrollInterval;

    const scrollRight = () => {
        // Si está al final, vuelve al principio.
        if (carousel.scrollLeft + carousel.clientWidth >= carousel.scrollWidth - 1) {
            carousel.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
            carousel.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
        }
    };

    const startAutoScroll = () => {
        stopAutoScroll();
        autoScrollInterval = setInterval(scrollRight, 5000); // Cambia cada 3 segundos
    };

    const stopAutoScroll = () => {
        clearInterval(autoScrollInterval);
    };

    leftBtn.addEventListener('click', () => {
        // Si está al principio, se desplaza hasta el final para un efecto circular.
        if (carousel.scrollLeft < 1) {
            carousel.scrollTo({ left: carousel.scrollWidth, behavior: 'smooth' });
        } else {
            carousel.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
        }
        startAutoScroll(); // Reinicia el temporizador al hacer clic
    });

    rightBtn.addEventListener('click', () => {
        scrollRight();
        startAutoScroll(); // Reinicia el temporizador al hacer clic
    });

    // Iniciar el carrusel automático
    startAutoScroll();

    // Pausar el carrusel cuando el mouse está sobre él para que el usuario pueda interactuar
    const carouselWrapper = document.querySelector('.carousel-wrapper');
    carouselWrapper.addEventListener('mouseenter', stopAutoScroll);
    carouselWrapper.addEventListener('mouseleave', startAutoScroll);
});

// ============================================
// MENÚ HAMBURGUESA PARA MÓVILES
// ============================================
document.addEventListener('componentsLoaded', () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu a');

    if (!menuToggle || !navMenu) return;

    menuToggle.addEventListener('click', () => {
        const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
        menuToggle.setAttribute('aria-expanded', !isExpanded);
        navMenu.classList.toggle('active');
        menuToggle.classList.toggle('active');
        document.body.style.overflow = !isExpanded ? 'hidden' : '';
    });

    // Cerrar menú al hacer click en un enlace
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            menuToggle.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        });
    });

    // Cerrar menú al hacer click fuera
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
            navMenu.classList.remove('active');
            menuToggle.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }
    });
});

// ============================================
// BOTÓN SCROLL TO TOP
// ============================================
document.addEventListener('componentsLoaded', () => {
    const scrollToTopBtn = document.querySelector('.scroll-to-top');
    
    if (!scrollToTopBtn) return;

    // Mostrar/ocultar botón según el scroll
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.classList.add('show');
        } else {
            scrollToTopBtn.classList.remove('show');
        }
    });

    // Scroll suave al hacer click
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});

// ============================================
// ANIMACIONES AL HACER SCROLL (Intersection Observer)
// ============================================
document.addEventListener('componentsLoaded', () => {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    let delayCounter = 0;
    let resetTimer = null;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Configurar animación en cascada
                setTimeout(() => {
                    entry.target.classList.add('fade-in');
                }, delayCounter);
                
                delayCounter += 150; // Incrementar delay para el siguiente (Staggered Effect)
                observer.unobserve(entry.target);

                // Resetear el contador de retrasos cuando el hilo de ejecución actual finalice
                clearTimeout(resetTimer);
                resetTimer = setTimeout(() => {
                    delayCounter = 0;
                }, 500);
            }
        });
    }, observerOptions);

    // Observar elementos que deben animarse interactuando
    const animateElements = document.querySelectorAll(
        '.job-entry, .edu-entry, .project-card, .skills-group, .profile-info'
    );
    
    // Configuración inicial de elementos: opacidad a 0 para no saltar brusco
    animateElements.forEach(el => {
        el.style.opacity = '0';
        observer.observe(el);
    });
});

// ============================================
// NAVEGACIÓN SUAVE MEJORADA
// ============================================
document.addEventListener('componentsLoaded', () => {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const headerOffset = window.innerWidth <= 768 ? 70 : 0;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
});

// ============================================
// VALIDACIÓN Y ENVÍO DE FORMULARIO MEJORADO
// ============================================
document.addEventListener('componentsLoaded', () => {
    const form = document.querySelector('.contact-form');
    if (!form) return;

    const emailInput = form.querySelector('#user-email');
    const asuntoInput = form.querySelector('#asunto');
    const mensajeInput = form.querySelector('#mensaje');
    const submitBtn = form.querySelector('button[type="submit"]');

    // Validación en tiempo real
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function showError(input, message) {
        const formGroup = input.closest('.form-group');
        let errorDiv = formGroup.querySelector('.error-message');
        
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            formGroup.appendChild(errorDiv);
        }
        
        errorDiv.textContent = message;
        input.classList.add('error');
    }

    function clearError(input) {
        const formGroup = input.closest('.form-group');
        const errorDiv = formGroup.querySelector('.error-message');
        if (errorDiv) {
            errorDiv.remove();
        }
        input.classList.remove('error');
    }

    // Validación de email
    if (emailInput) {
        emailInput.addEventListener('blur', () => {
            if (emailInput.value && !validateEmail(emailInput.value)) {
                showError(emailInput, 'Por favor, ingresa un email válido');
            } else {
                clearError(emailInput);
            }
        });

        emailInput.addEventListener('input', () => {
            if (emailInput.classList.contains('error') && validateEmail(emailInput.value)) {
                clearError(emailInput);
            }
        });
    }

    // Validación de campos requeridos
    [asuntoInput, mensajeInput].forEach(input => {
        if (input) {
            input.addEventListener('blur', () => {
                if (!input.value.trim()) {
                    showError(input, 'Este campo es obligatorio');
                } else {
                    clearError(input);
                }
            });

            input.addEventListener('input', () => {
                if (input.value.trim() && input.classList.contains('error')) {
                    clearError(input);
                }
            });
        }
    });

    // Envío del formulario
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        
        // Validar todos los campos antes de enviar
        let isValid = true;
        
        if (!validateEmail(emailInput.value)) {
            showError(emailInput, 'Por favor, ingresa un email válido');
            isValid = false;
        }
        
        if (!asuntoInput.value.trim()) {
            showError(asuntoInput, 'Este campo es obligatorio');
            isValid = false;
        }
        
        if (!mensajeInput.value.trim()) {
            showError(mensajeInput, 'Este campo es obligatorio');
            isValid = false;
        }

        if (!isValid) {
            return;
        }

        // Deshabilitar botón durante el envío
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Enviando...';
        submitBtn.style.opacity = '0.7';

        // Eliminar mensajes anteriores
        const existingStatus = form.parentNode.querySelector('.form-submission-status');
        if (existingStatus) existingStatus.remove();

        const statusMessage = document.createElement('p');
        statusMessage.className = 'form-submission-status';
        statusMessage.style.textAlign = 'center';
        statusMessage.style.marginTop = '15px';

        try {
            const response = await fetch(form.action, {
                method: 'POST',
                body: new FormData(form),
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                statusMessage.textContent = "✅ ¡Gracias! Tu mensaje ha sido enviado correctamente. Te responderé pronto.";
                statusMessage.style.color = '#9ece6a';
                form.reset();
                // Limpiar todos los errores
                form.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
                form.querySelectorAll('.error-message').forEach(el => el.remove());
            } else {
                statusMessage.textContent = "❌ Error al enviar el mensaje. Por favor, inténtalo de nuevo o usa mis redes sociales.";
                statusMessage.style.color = '#f7768e';
            }
        } catch (error) {
            statusMessage.textContent = "❌ Error de conexión. Por favor, verifica tu conexión o usa mis redes sociales.";
            statusMessage.style.color = '#f7768e';
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
            submitBtn.style.opacity = '1';
            form.parentNode.insertBefore(statusMessage, form.nextSibling);
        }
    });
});

// ============================================
// EFECTO DE HIGHLIGHT EN NAVEGACIÓN AL SCROLL
// ============================================
document.addEventListener('componentsLoaded', () => {
    const sections = document.querySelectorAll('section[id], footer[id], .contact-footer[id]');
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');

    function highlightNav() {
        let current = '';
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const offset = window.innerWidth <= 768 ? 100 : 0;
            const sectionTop = section.offsetTop - offset;
            const sectionHeight = section.offsetHeight;
            
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        // Corrección: Si estamos al final de la página, activar el último enlace (Contacto)
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 50) {
            const lastLink = navLinks[navLinks.length - 1];
            if (lastLink) {
                const href = lastLink.getAttribute('href');
                if (href) current = href.substring(1);
            }
        }

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', highlightNav);
    highlightNav(); // Llamar una vez al cargar
});

// ============================================
// CARRUSEL DE EDUCACIÓN (AUTO SCROLL + MOUSE WHEEL)
// ============================================
document.addEventListener('componentsLoaded', () => {
    const eduCarousel = document.querySelector('.education-carousel');
    const eduLeftBtn = document.querySelector('.edu-left-btn');
    const eduRightBtn = document.querySelector('.edu-right-btn');
    if (!eduCarousel) return;

    let eduInterval;

    const scrollEduRight = () => {
        const cardWidth = eduCarousel.querySelector('.edu-entry').offsetWidth + 20; // 20 = gap
        
        // Si llegamos al final, volvemos al principio
        if (eduCarousel.scrollLeft + eduCarousel.clientWidth >= eduCarousel.scrollWidth - 5) {
            eduCarousel.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
            eduCarousel.scrollBy({ left: cardWidth, behavior: 'smooth' });
        }
    };

    const startEduScroll = () => {
        stopEduScroll();
        eduInterval = setInterval(scrollEduRight, 4000); // 3 segundos (más rápido)
    };

    const stopEduScroll = () => {
        clearInterval(eduInterval);
    };

    // Soporte para Mouse Wheel (Scroll horizontal con rueda del mouse)
    eduCarousel.addEventListener('wheel', (e) => {
        e.preventDefault();
        eduCarousel.scrollLeft += e.deltaY;
        stopEduScroll(); // Pausar auto-scroll al interactuar
    });

    eduCarousel.addEventListener('mouseenter', stopEduScroll);
    eduCarousel.addEventListener('mouseleave', startEduScroll);

    // Event listeners para los botones
    if (eduLeftBtn) {
        eduLeftBtn.addEventListener('click', () => {
            const cardWidth = eduCarousel.querySelector('.edu-entry').offsetWidth + 20;
            eduCarousel.scrollBy({ left: -cardWidth, behavior: 'smooth' });
            startEduScroll(); // Reiniciar timer
        });
    }

    if (eduRightBtn) {
        eduRightBtn.addEventListener('click', () => {
            scrollEduRight();
            startEduScroll(); // Reiniciar timer
        });
    }

    startEduScroll();
});

// ============================================
// FUNCIONALIDAD BOTONES "LEER MÁS" EN EXPERIENCIA
// ============================================
document.addEventListener('componentsLoaded', () => {
    // Usamos delegación de eventos al document, pero solo asignamos una vez
    // Esto es útil porque los elementos se inyectan dinámicamente
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.read-more-btn');
        if (!btn) return;
        
        const jobEntry = btn.closest('.job-entry');
        if (!jobEntry) return;

        const list = jobEntry.querySelector('.experience-list');
        if (!list) return;

        const isExpanded = btn.getAttribute('aria-expanded') === 'true';
        
        if (isExpanded) {
            // Colapsar
            list.classList.add('collapsed');
            btn.innerHTML = 'Leer más <i class="fas fa-chevron-down"></i>';
            btn.setAttribute('aria-expanded', 'false');
        } else {
            // Expandir
            list.classList.remove('collapsed');
            btn.innerHTML = 'Leer menos <i class="fas fa-chevron-up"></i>';
            btn.setAttribute('aria-expanded', 'true');
        }
    });
});

