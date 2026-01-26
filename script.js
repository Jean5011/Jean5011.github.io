// ============================================
// FUNCIONALIDAD DEL CARRUSEL DE PROYECTOS
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    const carousel = document.querySelector('.projects-carousel');
    const leftBtn = document.querySelector('.left-btn');
    const rightBtn = document.querySelector('.right-btn');
    const projectCard = document.querySelector('.project-card');

    if (!carousel || !leftBtn || !rightBtn || !projectCard) {
        console.warn("Algunos elementos del carrusel no están disponibles.");
        return;
    }

    const scrollAmount = projectCard.offsetWidth + 20;

    leftBtn.addEventListener('click', () => {
        carousel.scrollBy({
            left: -scrollAmount,
            behavior: 'smooth'
        });
    });

    rightBtn.addEventListener('click', () => {
        carousel.scrollBy({
            left: scrollAmount,
            behavior: 'smooth'
        });
    });

    // Actualizar scroll amount cuando cambia el tamaño de la ventana
    window.addEventListener('resize', () => {
        const newScrollAmount = projectCard.offsetWidth + 20;
        // Guardamos el nuevo valor para futuros clicks
        if (leftBtn && rightBtn) {
            leftBtn.dataset.scrollAmount = newScrollAmount;
            rightBtn.dataset.scrollAmount = newScrollAmount;
        }
    });
});

// ============================================
// MENÚ HAMBURGUESA PARA MÓVILES
// ============================================
document.addEventListener('DOMContentLoaded', () => {
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
document.addEventListener('DOMContentLoaded', () => {
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
document.addEventListener('DOMContentLoaded', () => {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observar elementos que deben animarse
    const animateElements = document.querySelectorAll(
        '.job-entry, .edu-entry, .project-card, .skills-group, .profile-info'
    );
    
    animateElements.forEach(el => observer.observe(el));
});

// ============================================
// NAVEGACIÓN SUAVE MEJORADA
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const headerOffset = 80;
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
document.addEventListener('DOMContentLoaded', () => {
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
                statusMessage.style.color = '#2ecc71';
                form.reset();
                // Limpiar todos los errores
                form.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
                form.querySelectorAll('.error-message').forEach(el => el.remove());
            } else {
                statusMessage.textContent = "❌ Error al enviar el mensaje. Por favor, inténtalo de nuevo o usa mis redes sociales.";
                statusMessage.style.color = '#e74c3c';
            }
        } catch (error) {
            statusMessage.textContent = "❌ Error de conexión. Por favor, verifica tu conexión o usa mis redes sociales.";
            statusMessage.style.color = '#e74c3c';
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
document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');

    function highlightNav() {
        let current = '';
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

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
