// Modern NASA Website JavaScript - ES6+ Features
class NASAWebsite {
    constructor() {
        this.init();
    }

    init() {
        // Wait for DOM to be ready before initializing
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.initializeComponents();
            });
        } else {
            this.initializeComponents();
        }
    }

    initializeComponents() {
        this.handleDOMReady();
        this.setupEventListeners();
        this.setupIntersectionObserver();
        this.setupScrollEffects();
        this.setupGalleryFilter();
        this.setupMobileMenu();
        this.setupSmoothScrolling();
        this.setupAnimations();
        this.logWelcomeMessage();
    }

    // Event Listeners Setup
    setupEventListeners() {
        // DOM Content Loaded
        document.addEventListener('DOMContentLoaded', () => {
            this.handleDOMReady();
        });

        // Window Events
        window.addEventListener('scroll', this.throttle(this.handleScroll.bind(this), 16));
        window.addEventListener('resize', this.debounce(this.handleResize.bind(this), 250));
        window.addEventListener('load', this.handleWindowLoad.bind(this));

        // Keyboard Events
        document.addEventListener('keydown', this.handleKeyDown.bind(this));
    }

    // DOM Ready Handler
    handleDOMReady() {
        this.elements = {
            header: document.querySelector('.header'),
            hamburger: document.getElementById('hamburger'),
            mobileMenu: document.getElementById('mobile-menu'),
            navLinks: document.querySelectorAll('.nav-link, .mobile-nav-link'),
            filterButtons: document.querySelectorAll('.filter-btn'),
            galleryItems: document.querySelectorAll('.gallery-item'),
            animatedElements: document.querySelectorAll('.mission-card, .news-card, .gallery-item, .about-text, .about-image'),
            buttons: document.querySelectorAll('.btn'),
            statNumbers: document.querySelectorAll('.stat-number')
        };

        this.setupButtonEffects();
        this.createScrollToTopButton();
        
        // Initialize gallery stats counter animation
        this.initializeGalleryStats();
    }

    // Mobile Menu Setup
    setupMobileMenu() {
        if (!this.elements) return;
        
        const { hamburger, mobileMenu, navLinks } = this.elements;

        if (hamburger && mobileMenu) {
            hamburger.addEventListener('click', () => {
                this.toggleMobileMenu();
            });

            // Close mobile menu when clicking on links
            if (navLinks) {
                navLinks.forEach(link => {
                    link.addEventListener('click', () => {
                        this.closeMobileMenu();
                    });
                });
            }

            // Close mobile menu when clicking outside
            mobileMenu.addEventListener('click', (e) => {
                if (e.target === mobileMenu) {
                    this.closeMobileMenu();
                }
            });
        }
    }

    toggleMobileMenu() {
        if (!this.elements) return;
        
        const { hamburger, mobileMenu } = this.elements;
        if (!hamburger || !mobileMenu) return;
        
        const isActive = hamburger.classList.contains('active');

        hamburger.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = isActive ? 'auto' : 'hidden';
    }

    closeMobileMenu() {
        if (!this.elements) return;
        
        const { hamburger, mobileMenu } = this.elements;
        if (!hamburger || !mobileMenu) return;
        
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    // Smooth Scrolling Setup
    setupSmoothScrolling() {
        if (!this.elements || !this.elements.navLinks) return;
        
        this.elements.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);

                if (targetElement) {
                    const headerHeight = this.elements.header ? this.elements.header.offsetHeight : 70;
                    const targetPosition = targetElement.offsetTop - headerHeight;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // Scroll Effects
    setupScrollEffects() {
        this.lastScrollY = window.scrollY;
    }

    handleScroll() {
        const currentScrollY = window.scrollY;
        
        // Header scroll effect
        if (this.elements && this.elements.header) {
            const { header } = this.elements;
            if (currentScrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }

        // Parallax effect for hero section
        const heroBackground = document.querySelector('.hero-background');
        if (heroBackground && currentScrollY < window.innerHeight) {
            const rate = currentScrollY * -0.5;
            heroBackground.style.transform = `translateY(${rate}px)`;
        }

        // Show/hide scroll to top button
        this.toggleScrollToTopButton(currentScrollY);

        this.lastScrollY = currentScrollY;
    }

    // Intersection Observer for Animations
    setupIntersectionObserver() {
        if (!this.elements || !this.elements.animatedElements) return;

        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    
                    // Trigger counter animation for stats
                    if (entry.target.closest('.about-section')) {
                        this.animateCounters();
                    }
                }
            });
        }, observerOptions);

        // Observe animated elements when they exist
        setTimeout(() => {
            if (this.elements && this.elements.animatedElements) {
                this.elements.animatedElements.forEach(el => {
                    el.classList.add('fade-in');
                    this.observer.observe(el);
                });
            }
        }, 100);
    }

    // Gallery Setup
    setupGalleryFilter() {
        if (!this.elements || !this.elements.galleryItems) return;
        
        const { galleryItems } = this.elements;

        // Setup gallery item click events for lightbox
        galleryItems.forEach(item => {
            item.addEventListener('click', () => {
                this.openLightbox(item);
            });
        });
    }

    

    // Lightbox Functionality
    openLightbox(item) {
        const img = item.querySelector('img');
        const overlay = item.querySelector('.gallery-overlay');
        const title = overlay.querySelector('h4').textContent;
        const description = overlay.querySelector('p').textContent;

        const lightbox = this.createLightboxElement(img.src, title, description);
        document.body.appendChild(lightbox);
        document.body.style.overflow = 'hidden';

        // Animate in
        requestAnimationFrame(() => {
            lightbox.style.opacity = '1';
            lightbox.querySelector('.lightbox-content').style.transform = 'scale(1)';
        });

        // Setup close functionality
        this.setupLightboxClose(lightbox);
    }

    createLightboxElement(imageSrc, title, description) {
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <div class="lightbox-content">
                <button class="lightbox-close" aria-label="Close lightbox">&times;</button>
                <img src="${imageSrc}" alt="${title}">
                <div class="lightbox-info">
                    <h3>${title}</h3>
                    <p>${description}</p>
                </div>
            </div>
        `;

        // Apply styles
        Object.assign(lightbox.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            background: 'rgba(0, 0, 0, 0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: '10000',
            opacity: '0',
            transition: 'opacity 0.3s ease'
        });

        const content = lightbox.querySelector('.lightbox-content');
        Object.assign(content.style, {
            position: 'relative',
            maxWidth: '90%',
            maxHeight: '90%',
            background: 'white',
            borderRadius: '1rem',
            overflow: 'hidden',
            transform: 'scale(0.8)',
            transition: 'transform 0.3s ease'
        });

        const closeBtn = lightbox.querySelector('.lightbox-close');
        Object.assign(closeBtn.style, {
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            fontSize: '2rem',
            color: 'white',
            background: 'rgba(0, 0, 0, 0.5)',
            border: 'none',
            width: '4rem',
            height: '4rem',
            borderRadius: '50%',
            cursor: 'pointer',
            zIndex: '10001',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        });

        const img = lightbox.querySelector('img');
        Object.assign(img.style, {
            width: '100%',
            height: 'auto',
            display: 'block'
        });

        const info = lightbox.querySelector('.lightbox-info');
        Object.assign(info.style, {
            padding: '2rem'
        });

        return lightbox;
    }

    setupLightboxClose(lightbox) {
        const closeBtn = lightbox.querySelector('.lightbox-close');
        
        const closeLightbox = () => {
            lightbox.style.opacity = '0';
            lightbox.querySelector('.lightbox-content').style.transform = 'scale(0.8)';
            setTimeout(() => {
                if (document.body.contains(lightbox)) {
                    document.body.removeChild(lightbox);
                }
                document.body.style.overflow = 'auto';
            }, 300);
        };

        closeBtn.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });

        // Store reference for keyboard handler
        this.currentLightboxClose = closeLightbox;
    }

    // Button Effects
    setupButtonEffects() {
        if (!this.elements || !this.elements.buttons) return;
        
        this.elements.buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                this.createRippleEffect(e, button);
            });
        });
    }

    createRippleEffect(event, button) {
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;

        Object.assign(ripple.style, {
            position: 'absolute',
            width: `${size}px`,
            height: `${size}px`,
            left: `${x}px`,
            top: `${y}px`,
            background: 'rgba(255, 255, 255, 0.3)',
            borderRadius: '50%',
            transform: 'scale(0)',
            animation: 'ripple 0.6s linear',
            pointerEvents: 'none'
        });

        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(ripple);

        setTimeout(() => {
            if (button.contains(ripple)) {
                button.removeChild(ripple);
            }
        }, 600);
    }

    // Counter Animation
    animateCounters() {
        if (this.countersAnimated) return;
        if (!this.elements || !this.elements.statNumbers) return;
        
        this.countersAnimated = true;

        this.elements.statNumbers.forEach(stat => {
            const target = parseInt(stat.textContent.replace(/\D/g, ''));
            const suffix = stat.textContent.replace(/[0-9]/g, '');
            let current = 0;
            const increment = target / 100;
            const duration = 2000;
            const stepTime = duration / 100;

            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                stat.textContent = Math.floor(current) + suffix;
            }, stepTime);
        });
    }

    // Initialize Gallery Stats Animation
    initializeGalleryStats() {
        const galleryStatNumbers = document.querySelectorAll('.gallery-stat-number');
        if (galleryStatNumbers.length === 0) return;

        const gallerySection = document.querySelector('.gallery-section');
        if (!gallerySection) return;

        const galleryObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.galleryStatsAnimated) {
                    this.animateGalleryStats();
                    this.galleryStatsAnimated = true;
                }
            });
        }, { threshold: 0.5 });

        galleryObserver.observe(gallerySection);
    }

    // Animate Gallery Statistics
    animateGalleryStats() {
        const galleryStatNumbers = document.querySelectorAll('.gallery-stat-number');
        
        galleryStatNumbers.forEach((stat, index) => {
            const text = stat.textContent;
            
            // Handle different number formats
            if (text.includes('/')) {
                // Handle "24/7" format
                stat.style.opacity = '0';
                setTimeout(() => {
                    stat.style.opacity = '1';
                    stat.style.transform = 'scale(1.1)';
                    setTimeout(() => {
                        stat.style.transform = 'scale(1)';
                    }, 200);
                }, index * 200);
            } else {
                // Handle regular numbers
                const target = parseInt(text.replace(/\D/g, ''));
                const suffix = text.replace(/[0-9]/g, '');
                let current = 0;
                const increment = target / 50;
                
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        current = target;
                        clearInterval(timer);
                    }
                    stat.textContent = Math.floor(current) + suffix;
                }, 40);
            }
        });
    }

    // Scroll to Top Button
    createScrollToTopButton() {
        const scrollBtn = document.createElement('button');
        scrollBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
        scrollBtn.className = 'scroll-to-top';
        scrollBtn.setAttribute('aria-label', 'Scroll to top');

        Object.assign(scrollBtn.style, {
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            width: '5rem',
            height: '5rem',
            background: '#FC3D21',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            cursor: 'pointer',
            fontSize: '1.8rem',
            opacity: '0',
            visibility: 'hidden',
            transition: 'all 0.3s ease',
            zIndex: '1000',
            boxShadow: '0 0.4rem 1.2rem rgba(0, 0, 0, 0.15)'
        });

        scrollBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        scrollBtn.addEventListener('mouseenter', () => {
            scrollBtn.style.transform = 'translateY(-0.3rem)';
            scrollBtn.style.boxShadow = '0 0.6rem 2rem rgba(0, 0, 0, 0.25)';
        });

        scrollBtn.addEventListener('mouseleave', () => {
            scrollBtn.style.transform = 'translateY(0)';
            scrollBtn.style.boxShadow = '0 0.4rem 1.2rem rgba(0, 0, 0, 0.15)';
        });

        document.body.appendChild(scrollBtn);
        this.scrollToTopBtn = scrollBtn;
    }

    toggleScrollToTopButton(scrollY) {
        if (!this.scrollToTopBtn) return;

        if (scrollY > 500) {
            this.scrollToTopBtn.style.opacity = '1';
            this.scrollToTopBtn.style.visibility = 'visible';
        } else {
            this.scrollToTopBtn.style.opacity = '0';
            this.scrollToTopBtn.style.visibility = 'hidden';
        }
    }

    // Animation Setup
    setupAnimations() {
        // Add CSS keyframes for ripple effect
        const style = document.createElement('style');
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Event Handlers
    handleResize() {
        // Close mobile menu on resize to desktop
        if (window.innerWidth >= 992) {
            this.closeMobileMenu();
        }
    }

    handleWindowLoad() {
        // Remove any loading states
        document.body.classList.add('loaded');
    }

    handleKeyDown(e) {
        // Close lightbox on Escape key
        if (e.key === 'Escape' && this.currentLightboxClose) {
            this.currentLightboxClose();
            this.currentLightboxClose = null;
        }

        // Close mobile menu on Escape key
        if (e.key === 'Escape') {
            this.closeMobileMenu();
        }
    }

    // Utility Functions
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    debounce(func, wait, immediate) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                timeout = null;
                if (!immediate) func(...args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func(...args);
        };
    }

    // Welcome Message
    logWelcomeMessage() {
        const styles = [
            'color: #0B3D91',
            'font-size: 16px',
            'font-weight: bold',
            'text-shadow: 1px 1px 1px rgba(0,0,0,0.1)'
        ].join(';');

        console.log('%c🚀 NASA Website Loaded Successfully!', styles);
        console.log(`
═══════════════════════════════════════
Welcome to the NASA Experience
═══════════════════════════════════════

Features loaded:
✓ Modern ES6+ JavaScript
✓ Responsive Design (Mobile/Tablet/Desktop)
✓ Interactive Gallery with Lightbox
✓ Smooth Scrolling Navigation
✓ Mobile Hamburger Menu
✓ Intersection Observer Animations
✓ Counter Animations
✓ Parallax Effects
✓ Accessibility Features

Explore the universe! 🌌
        `);
    }
}

// Additional Utility Classes
class PerformanceMonitor {
    static measurePageLoad() {
        window.addEventListener('load', () => {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log('Page Load Performance:', {
                'DOM Content Loaded': `${perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart}ms`,
                'Full Page Load': `${perfData.loadEventEnd - perfData.loadEventStart}ms`,
                'Total Load Time': `${perfData.loadEventEnd - perfData.fetchStart}ms`
            });
        });
    }
}

class AccessibilityHelper {
    static init() {
        // Add skip link for keyboard navigation
        this.addSkipLink();
        
        // Enhance focus management
        this.enhanceFocusManagement();
        
        // Add ARIA labels where needed
        this.addAriaLabels();
    }

    static addSkipLink() {
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.textContent = 'Skip to main content';
        skipLink.className = 'skip-link';
        
        Object.assign(skipLink.style, {
            position: 'absolute',
            top: '-4rem',
            left: '1rem',
            background: '#0B3D91',
            color: 'white',
            padding: '0.5rem 1rem',
            textDecoration: 'none',
            borderRadius: '0.4rem',
            zIndex: '10000',
            transition: 'top 0.3s ease'
        });

        skipLink.addEventListener('focus', () => {
            skipLink.style.top = '1rem';
        });

        skipLink.addEventListener('blur', () => {
            skipLink.style.top = '-4rem';
        });

        document.body.insertBefore(skipLink, document.body.firstChild);
    }

    static enhanceFocusManagement() {
        // Add focus indicators for better keyboard navigation
        const style = document.createElement('style');
        style.textContent = `
            .focus-visible {
                outline: 2px solid #FFD700 !important;
                outline-offset: 2px !important;
            }
        `;
        document.head.appendChild(style);
    }

    static addAriaLabels() {
        // Add ARIA labels to interactive elements without proper labels
        const interactiveElements = document.querySelectorAll('button:not([aria-label]), a:not([aria-label])');
        interactiveElements.forEach(el => {
            if (!el.textContent.trim() && !el.getAttribute('aria-label')) {
                const context = el.closest('section')?.id || 'interactive';
                el.setAttribute('aria-label', `${context} button`);
            }
        });
    }
}

// Initialize the website
document.addEventListener('DOMContentLoaded', () => {
    // Initialize main website functionality
    new NASAWebsite();
    
    // Initialize accessibility features
    AccessibilityHelper.init();
    
    // Monitor performance in development
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        PerformanceMonitor.measurePageLoad();
    }
});

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { NASAWebsite, PerformanceMonitor, AccessibilityHelper };
}