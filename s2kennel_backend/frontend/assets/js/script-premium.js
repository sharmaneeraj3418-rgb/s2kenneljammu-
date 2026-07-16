/* ===========================
   PREMIUM NGO WEBSITE SCRIPTS
   =========================== */

// Initialize on DOM Ready
document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initSmoothScroll();
    initScrollAnimations();
    initContactForm();
    initDonationButtons();
});

/* ===========================
   NAVIGATION FUNCTIONS
   =========================== */

function initNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    if (navToggle) {
        navToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            navMenu?.classList.toggle('active');
            updateToggleIcon();
        });
    }

    // Close menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu?.classList.remove('active');
            updateToggleIcon();
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (navToggle && !navToggle.contains(e.target) && navMenu && !navMenu.contains(e.target)) {
            navMenu.classList.remove('active');
            updateToggleIcon();
        }
    });

    // Sticky navbar effect
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar?.classList.add('scrolled');
        } else {
            navbar?.classList.remove('scrolled');
        }
    });
}

function updateToggleIcon() {
    const spans = document.querySelectorAll('.nav-toggle span');
    const navMenu = document.querySelector('.nav-menu');

    if (navMenu?.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translateY(15px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translateY(-15px)';
    } else {
        spans[0].style.transform = 'rotate(0) translateY(0)';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'rotate(0) translateY(0)';
    }
}

/* ===========================
   SMOOTH SCROLL FUNCTIONS
   =========================== */

function initSmoothScroll() {
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            if (href && href.startsWith('#')) {
                e.preventDefault();

                const targetSection = document.querySelector(href);
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 70;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Smooth scroll for all buttons
    const buttons = document.querySelectorAll('a[href^="#"]');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            const navLink = document.querySelector('.nav-link[href="' + href + '"]');

            if (!navLink) {
                e.preventDefault();

                const targetSection = document.querySelector(href);
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 70;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

/* ===========================
   SCROLL ANIMATIONS
   =========================== */

function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.8s ease-out forwards';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe service cards
    document.querySelectorAll('.service-card').forEach((el, index) => {
        el.style.opacity = '0';
        el.style.animationDelay = (index * 0.1) + 's';
        observer.observe(el);
    });

    // Observe dog cards
    document.querySelectorAll('.dog-card').forEach((el, index) => {
        el.style.opacity = '0';
        el.style.animationDelay = (index * 0.1) + 's';
        observer.observe(el);
    });

    // Observe stat cards
    document.querySelectorAll('.stat-card').forEach((el, index) => {
        el.style.opacity = '0';
        el.style.animationDelay = (index * 0.1) + 's';
        observer.observe(el);
    });
}

/* ===========================
   CONTACT FORM HANDLING
   =========================== */

function initContactForm() {
    const contactForm = document.querySelector('.contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form values
            const name = document.querySelector('input[name="name"]')?.value.trim();
            const email = document.querySelector('input[name="email"]')?.value.trim();
            const subject = document.querySelector('input[name="subject"]')?.value.trim();
            const message = document.querySelector('textarea[name="message"]')?.value.trim();

            // Validation
            if (!name || !email || !subject || !message) {
                showNotification('Please fill in all fields', 'error');
                return;
            }

            // Email validation
            if (!isValidEmail(email)) {
                showNotification('Please enter a valid email address', 'error');
                return;
            }

            // Simulate form submission
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;

            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';

            setTimeout(() => {
                // Show success message
                showNotification('Thank you! We\'ll get back to you soon.', 'success');

                // Reset form
                contactForm.reset();

                // Reset button
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }, 1500);
        });
    }
}

/* ===========================
   DONATION BUTTON HANDLING
   =========================== */

function initDonationButtons() {
    const donationButtons = document.querySelectorAll('.btn-donation');

    donationButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const amount = this.textContent;
            showNotification(`Opening payment gateway for ${amount}...`, 'info');

            setTimeout(() => {
                console.log('Donation initiated for:', amount);
            }, 1500);
        });
    });
}

/* ===========================
   NOTIFICATION SYSTEM
   =========================== */

function showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotif = document.querySelector('.notification');
    if (existingNotif) {
        existingNotif.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        max-width: 350px;
        padding: 16px 24px;
        border-radius: 12px;
        font-weight: 600;
        font-size: 14px;
        z-index: 9999;
        animation: slideInRight 0.4s ease-out;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
    `;

    // Set colors based on type
    const colors = {
        success: {
            bg: '#28a745',
            text: '#fff'
        },
        error: {
            bg: '#dc3545',
            text: '#fff'
        },
        info: {
            bg: '#007bff',
            text: '#fff'
        }
    };

    const color = colors[type] || colors.info;
    notification.style.backgroundColor = color.bg;
    notification.style.color = color.text;

    // Append to body
    document.body.appendChild(notification);

    // Auto remove
    setTimeout(() => {
        notification.style.animation = 'fadeInUp 0.4s ease-out reverse';
        setTimeout(() => {
            notification.remove();
        }, 400);
    }, 3000);
}

/* ===========================
   UTILITY FUNCTIONS
   =========================== */

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/* ===========================
   PARALLAX EFFECT (OPTIONAL)
   =========================== */

function initParallax() {
    const parallaxElements = document.querySelectorAll('[data-parallax]');

    if (parallaxElements.length === 0) return;

    window.addEventListener('scroll', function() {
        parallaxElements.forEach(el => {
            const scrollPosition = window.scrollY;
            const elementPosition = el.offsetTop;
            const distance = scrollPosition - elementPosition;

            if (distance > -500 && distance < window.innerHeight) {
                el.style.transform = `translateY(${distance * 0.5}px)`;
            }
        });
    });
}

// Initialize parallax if needed
if (document.querySelectorAll('[data-parallax]').length > 0) {
    initParallax();
}

/* ===========================
   PAGE LOAD ANIMATION
   =========================== */

window.addEventListener('load', function() {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease-in';
        document.body.style.opacity = '1';
    }, 100);
});

/* ===========================
   BACK TO TOP BUTTON (OPTIONAL)
   =========================== */

function initBackToTop() {
    // Create button
    const backToTopBtn = document.createElement('button');
    backToTopBtn.textContent = '↑';
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: linear-gradient(135deg, #FF8C42, #FFA500);
        color: white;
        border: none;
        cursor: pointer;
        font-size: 24px;
        font-weight: bold;
        opacity: 0;
        pointer-events: none;
        transition: all 0.3s ease;
        z-index: 999;
        box-shadow: 0 5px 20px rgba(255, 140, 66, 0.3);
    `;

    document.body.appendChild(backToTopBtn);

    // Show/hide button
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopBtn.style.opacity = '1';
            backToTopBtn.style.pointerEvents = 'auto';
        } else {
            backToTopBtn.style.opacity = '0';
            backToTopBtn.style.pointerEvents = 'none';
        }
    });

    // Scroll to top on click
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Initialize back to top
initBackToTop();

/* ===========================
   LAZY LOADING IMAGES
   =========================== */

function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');

    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.getAttribute('data-src');
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }
}

initLazyLoading();
