/**
 * M4 Solutions Limited - Main JavaScript
 * Professional Corporate Website Functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavbar();
    initMobileMenu();
    initScrollAnimations();
    initGalleryFilters();
    initContactForm();
    initScrollToTop();
    initSmoothScroll();
});

/**
 * Navbar Scroll Effect
 * Changes navbar appearance on scroll
 */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    
    if (!navbar) return;
    
    // Check if we're on home page (has hero section)
    const hero = document.querySelector('.hero');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
            navbar.style.background = 'rgba(10, 37, 88, 0.98)';
        } else {
            // Only remove scrolled class if we're on home page
            if (hero) {
                navbar.classList.remove('scrolled');
                navbar.style.background = 'transparent';
            }
        }
    });
    
    // Initial check
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
        navbar.style.background = 'rgba(10, 37, 88, 0.98)';
    }
}

/**
 * Mobile Menu Toggle
 * Handles hamburger menu interaction
 */
function initMobileMenu() {
    const mobileToggle = document.getElementById('mobileToggle');
    const navLinks = document.getElementById('navLinks');
    
    if (!mobileToggle || !navLinks) return;
    
    mobileToggle.addEventListener('click', function() {
        mobileToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });
    
    // Close menu when clicking on a link
    const navLinksItems = navLinks.querySelectorAll('a');
    navLinksItems.forEach(function(link) {
        link.addEventListener('click', function() {
            mobileToggle.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!navLinks.contains(e.target) && !mobileToggle.contains(e.target)) {
            mobileToggle.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

/**
 * Scroll Animations
 * Elements fade in as they enter the viewport
 */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right');
    
    if (animatedElements.length === 0) return;
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    animatedElements.forEach(function(element) {
        observer.observe(element);
    });
}

/**
 * Gallery Filter Functionality
 * Filters gallery items by category with smooth animations
 */
function initGalleryFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const galleryGrid = document.getElementById('galleryGrid');
    
    if (filterButtons.length === 0 || galleryItems.length === 0) return;
    
    filterButtons.forEach(function(button) {
        button.addEventListener('click', function(e) {
            // Prevent default behavior and stop propagation
            e.preventDefault();
            e.stopPropagation();
            
            // Don't do anything if already active
            if (button.classList.contains('active')) return;
            
            // Remove active class from all buttons
            filterButtons.forEach(function(btn) {
                btn.classList.remove('active');
            });
            
            // Add active class to clicked button
            button.classList.add('active');
            
            const filter = button.getAttribute('data-filter');
            
            // Add filtering class to grid for animation
            if (galleryGrid) {
                galleryGrid.classList.add('filtering');
            }
            
            galleryItems.forEach(function(item) {
                const category = item.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    // Show matching items
                    item.style.display = '';
                    item.classList.add('show');
                    item.classList.remove('hide');
                    
                    // Trigger animation
                    setTimeout(function() {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0) scale(1)';
                    }, 50);
                } else {
                    // Hide non-matching items
                    item.classList.add('hide');
                    item.classList.remove('show');
                    
                    // Animate out
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(20px) scale(0.8)';
                    
                    // Actually hide after animation
                    setTimeout(function() {
                        if (item.classList.contains('hide')) {
                            item.style.display = 'none';
                        }
                    }, 300);
                }
            });
            
            // Remove filtering class after animation
            setTimeout(function() {
                if (galleryGrid) {
                    galleryGrid.classList.remove('filtering');
                }
            }, 350);
        });
    });
    
    // Add hover effect for gallery items to indicate clickability
    galleryItems.forEach(function(item) {
        item.addEventListener('mouseenter', function() {
            if (item.classList.contains('show') || !item.classList.contains('hide')) {
                item.style.cursor = 'pointer';
            }
        });
    });
}

/**
 * Contact Form Handling
 * Form validation and FormSubmit.co integration
 */
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    const urlParams = new URLSearchParams(window.location.search);
    
    // Show success message if redirected from FormSubmit.co
    if (urlParams.get('success') === 'true') {
        showNotification('Thank you! Your message has been sent successfully. We will get back to you soon.', 'success');
        // Clean the URL
        window.history.replaceState({}, document.title, window.location.pathname);
    }
    
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        // Get form data
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);
        
        // Basic validation
        let isValid = true;
        const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'service', 'subject', 'message'];
        
        requiredFields.forEach(function(field) {
            const input = document.getElementById(field);
            if (!data[field] || data[field].trim() === '') {
                isValid = false;
                input.style.borderColor = '#D32F2F';
            } else {
                input.style.borderColor = '#F0F2F5';
            }
        });
        
        // Email validation
        const emailInput = document.getElementById('email');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            isValid = false;
            emailInput.style.borderColor = '#D32F2F';
        }
        
        if (isValid) {
            // Show sending state
            const submitBtn = contactForm.querySelector('.submit-btn');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;
            
            // FormSubmit.co will handle the submission naturally
            // The form will redirect to the _next URL on success
            // Allow the form to submit
            submitBtn.innerHTML = '<i class="fas fa-check"></i> Submitting...';
        } else {
            // Shake animation for invalid form
            contactForm.style.animation = 'shake 0.5s';
            setTimeout(function() {
                contactForm.style.animation = '';
            }, 500);
            e.preventDefault();
        }
    });
    
    // Remove error styling on input
    const inputs = contactForm.querySelectorAll('input, select, textarea');
    inputs.forEach(function(input) {
        input.addEventListener('input', function() {
            input.style.borderColor = '#F0F2F5';
        });
    });
}

/**
 * Show Notification
 * Display success or error messages
 */
function showNotification(message, type) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification ' + type;
    notification.innerHTML = '<i class="fas fa-' + (type === 'success' ? 'check-circle' : 'exclamation-circle') + '"></i><span>' + message + '</span>';
    
    // Add styles
    notification.style.cssText = 'position: fixed; top: 100px; right: 20px; padding: 15px 25px; border-radius: 8px; color: white; font-weight: 500; display: flex; align-items: center; gap: 10px; z-index: 10000; animation: slideIn 0.3s ease; box-shadow: 0 4px 15px rgba(0,0,0,0.2);';
    notification.style.background = type === 'success' ? '#25D366' : '#D32F2F';
    
    // Add animation styles if not exists
    if (!document.getElementById('notificationStyles')) {
        const style = document.createElement('style');
        style.id = 'notificationStyles';
        style.textContent = '@keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }';
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Remove after 5 seconds
    setTimeout(function() {
        notification.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(function() {
            notification.remove();
        }, 300);
    }, 5000);
}

/**
 * Scroll to Top Button
 * Shows/hides and scrolls to top on click
 */
function initScrollToTop() {
    const scrollTopBtn = document.getElementById('scrollTop');
    
    if (!scrollTopBtn) return;
    
    // Show button when scrolling down
    window.addEventListener('scroll', function() {
        if (window.scrollY > 500) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });
    
    // Scroll to top on click
    scrollTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/**
 * Smooth Scroll for Anchor Links
 * Smoothly scrolls to section when clicking navigation links
 */
function initSmoothScroll() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
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
}

/**
 * Lazy Load Images
 * Load images only when they enter the viewport
 */
function initLazyLoad() {
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    if (lazyImages.length === 0) return;
    
    const imageObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.getAttribute('data-src');
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    lazyImages.forEach(function(img) {
        imageObserver.observe(img);
    });
}

/**
 * Video Fallback for Hero
 * Show poster image if video fails to load
 */
function initVideoFallback() {
    const heroVideo = document.querySelector('.hero-video');
    
    if (!heroVideo) return;
    
    heroVideo.addEventListener('error', function() {
        // Video failed to load, poster image will be shown automatically
        console.log('Video failed to load, using poster image');
    });
}

/**
 * Preload Critical Resources
 * Improve page load performance
 */
function preloadResources() {
    // Preload fonts
    const fontLinks = [
        'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap',
        'https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;500;600;700&display=swap'
    ];
    
    fontLinks.forEach(function(href) {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'style';
        link.href = href;
        document.head.appendChild(link);
    });
}

/**
 * Add CSS shake animation for invalid form
 */
(function addShakeStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
            20%, 40%, 60%, 80% { transform: translateX(10px); }
        }
    `;
    document.head.appendChild(style);
})();

/**
 * Console Welcome Message
 */
console.log('%c M4 Solutions Limited ', 'background: #0A2558; color: #FBC02D; font-size: 20px; font-weight: bold; padding: 10px;');
console.log('%c Professional Printing & Contract Services ', 'color: #D32F2F; font-size: 14px;');
console.log('%c Abuja, Nigeria ', 'color: #6C757D; font-size: 12px;');
