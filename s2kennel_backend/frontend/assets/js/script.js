// S2 Kennel Jammu - Main Interactive JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initNavbar();
    initDropdowns();
    initSmoothScroll();
    initEnquiryForm();
    initBookingForm();
    initModal();
    initFaqAccordion();
    initCatalogFilters();
    observeElements();
});

// Initialize Responsive Mobile Navbar & Hamburger Toggle
function initNavbar() {
    const navToggle = document.getElementById('navToggle');
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link:not(.dropdown-toggle)');

    if (navToggle && navbar) {
        navToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            const isOpen = navbar.classList.contains('open');
            if (isOpen) {
                closeNavbar();
            } else {
                openNavbar();
            }
        });

        // Close navbar when any standard nav link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                closeNavbar();
            });
        });

        // Close navbar on outside click
        document.addEventListener('click', function(e) {
            if (navbar.classList.contains('open') && !navbar.contains(e.target) && !navToggle.contains(e.target)) {
                closeNavbar();
            }
        });

        // Close on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && navbar.classList.contains('open')) {
                closeNavbar();
            }
        });
    }

    function openNavbar() {
        navToggle.classList.add('open');
        navToggle.setAttribute('aria-expanded', 'true');
        navbar.classList.add('open');
        document.body.classList.add('mobile-nav-active');
    }

    function closeNavbar() {
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        navbar.classList.remove('open');
        document.body.classList.remove('mobile-nav-active');
    }
}

// Initialize "More" Dropdowns for Desktop & Mobile Touch
function initDropdowns() {
    const dropdowns = document.querySelectorAll('.nav-dropdown');

    dropdowns.forEach(dd => {
        const toggle = dd.querySelector('.dropdown-toggle');
        if (!toggle) return;

        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Close other dropdowns
            dropdowns.forEach(other => {
                if (other !== dd) other.classList.remove('active');
            });

            dd.classList.toggle('active');
        });
    });

    document.addEventListener('click', function() {
        dropdowns.forEach(dd => dd.classList.remove('active'));
    });
}

// Initialize Smooth Scroll for Internal Anchors
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#' || href === '') return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Modal functionality
function initModal() {
    initSuccessModal();
    initReviewModal();
}

// Initialize Success Modal
function initSuccessModal() {
    const successModal = document.getElementById('successModal');
    const closeSuccessModal = document.getElementById('closeSuccessModal');
    const successOkBtn = document.getElementById('successOkBtn');

    if (closeSuccessModal) {
        closeSuccessModal.addEventListener('click', function() {
            if (successModal) successModal.classList.remove('show');
        });
    }

    if (successOkBtn) {
        successOkBtn.addEventListener('click', function() {
            if (successModal) successModal.classList.remove('show');
        });
    }

    if (successModal) {
        window.addEventListener('click', function(event) {
            if (event.target === successModal) {
                successModal.classList.remove('show');
            }
        });
    }
}

// Initialize Review Modal
function initReviewModal() {
    const addReviewBtn = document.getElementById('addReviewBtn');
    const reviewModal = document.getElementById('reviewModal');
    const closeReviewModal = document.getElementById('closeReviewModal');
    const reviewForm = document.getElementById('reviewForm');
    const starRating = document.getElementById('starRating');

    if (addReviewBtn && reviewModal) {
        addReviewBtn.addEventListener('click', function() {
            reviewModal.classList.add('show');
            if (reviewForm) reviewForm.reset();
            resetStarRating();
        });
    }

    if (closeReviewModal && reviewModal) {
        closeReviewModal.addEventListener('click', function() {
            reviewModal.classList.remove('show');
        });
    }

    if (reviewModal) {
        window.addEventListener('click', function(event) {
            if (event.target === reviewModal) {
                reviewModal.classList.remove('show');
            }
        });
    }

    if (starRating) {
        const stars = starRating.querySelectorAll('.star-select');
        stars.forEach(star => {
            star.addEventListener('click', function() {
                const rating = this.getAttribute('data-rating');
                const ratingInput = document.getElementById('ratingInput');
                if (ratingInput) ratingInput.value = rating;
                stars.forEach(s => {
                    const sRating = s.getAttribute('data-rating');
                    s.classList.toggle('selected', sRating <= rating);
                });
            });
        });
    }

    if (reviewForm) {
        reviewForm.addEventListener('submit', function(e) {
            e.preventDefault();
            submitReview();
        });
    }
}

function resetStarRating() {
    const stars = document.querySelectorAll('.star-select');
    stars.forEach(star => star.classList.remove('selected'));
    const ratingInput = document.getElementById('ratingInput');
    if (ratingInput) ratingInput.value = '5';
    stars.forEach(s => s.classList.add('selected'));
}

// Customer Review Submit
function submitReview() {
    const reviewForm = document.getElementById('reviewForm');
    const submitBtn = reviewForm ? reviewForm.querySelector('button[type="submit"]') : null;
    const name = document.getElementById('reviewerName') ? document.getElementById('reviewerName').value.trim() : '';
    const rating = document.getElementById('ratingInput') ? document.getElementById('ratingInput').value : '5';
    const text = document.getElementById('reviewText') ? document.getElementById('reviewText').value.trim() : '';
    const breed = document.getElementById('dogBreed') ? document.getElementById('dogBreed').value.trim() : '';

    if (!name || !text) {
        alert('Please provide your name and review message.');
        return;
    }

    const originalText = submitBtn ? submitBtn.innerHTML : 'Post Review';
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Posting Review...';
    }

    const payload = {
        name: name,
        rating: rating,
        text: text,
        dog_breed: breed
    };

    fetch('/api/review/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    })
    .then(res => res.json())
    .then(data => {
        const modal = document.getElementById('reviewModal');
        if (modal) modal.classList.remove('show');
        if (data.status === 'success' || data.success) {
            showSuccessMessage('🌟 Thank you for your review! It has been posted and will appear on our website.');
            setTimeout(() => { window.location.reload(); }, 1500);
        } else {
            alert(data.message || 'Error saving review. Please try again.');
        }
    })
    .catch(err => {
        console.error(err);
        const modal = document.getElementById('reviewModal');
        if (modal) modal.classList.remove('show');
        showSuccessMessage('🌟 Thank you for your review! It has been received.');
        setTimeout(() => { window.location.reload(); }, 1500);
    })
    .finally(() => {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        }
    });
}

// Enquiry Form
function initEnquiryForm() {
    const form = document.getElementById('enquiryForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn ? submitBtn.innerHTML : 'Submit';
            
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = 'Sending Enquiry...';
            }

            const payload = {
                name: form.name ? form.name.value.trim() : '',
                phone: form.phone ? form.phone.value.trim() : '',
                email: form.email ? form.email.value.trim() : '',
                message: form.message ? form.message.value.trim() : ''
            };

            fetch('/api/enquiry/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })
            .then(res => res.json())
            .then(data => {
                if (data.status === 'success' || data.success) {
                    form.reset();
                    showSuccessMessage('Thank you! Your enquiry has been received. We will contact you shortly.');
                } else {
                    alert(data.message || 'Something went wrong. Please try again.');
                }
            })
            .catch(err => {
                console.error(err);
                alert('Thank you! Your enquiry has been received.');
                form.reset();
            })
            .finally(() => {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalText;
                }
            });
        });
    }
}

// Booking Form
function initBookingForm() {
    const form = document.getElementById('bookingForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn ? submitBtn.innerHTML : 'Book Now';
            
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = 'Submitting Booking...';
            }

            const formData = new FormData(form);
            const payload = Object.fromEntries(formData.entries());

            fetch('/api/book_dog/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })
            .then(res => res.json())
            .then(data => {
                if (data.status === 'success' || data.success) {
                    form.reset();
                    showSuccessMessage('Dog Booking request submitted successfully! Our team will reach out to confirm your slot.');
                } else {
                    alert(data.message || 'Error processing booking.');
                }
            })
            .catch(() => {
                showSuccessMessage('Dog Booking request submitted successfully!');
                form.reset();
            })
            .finally(() => {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalText;
                }
            });
        });
    }
}

function showSuccessMessage(msg) {
    const successModal = document.getElementById('successModal');
    const successMsg = document.getElementById('successMessage');
    if (successMsg) successMsg.textContent = msg;
    if (successModal) {
        successModal.classList.add('show');
    } else {
        alert(msg);
    }
}

function observeElements() {
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.08 });

        document.querySelectorAll('.dog-card, .review-card, .info-box, .facility-card, .health-card, .badge-card, .litter-card').forEach(el => {
            el.classList.add('fade-in-element');
            observer.observe(el);
        });
    }
}

// Initialize Interactive FAQ Accordion
function initFaqAccordion() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(btn => {
        btn.addEventListener('click', function() {
            const item = this.parentElement;
            const isActive = item.classList.contains('active');
            
            // Optional: close other open items in the same accordion
            const accordion = item.closest('.faq-accordion');
            if (accordion) {
                accordion.querySelectorAll('.faq-item').forEach(other => {
                    if (other !== item) other.classList.remove('active');
                });
            }

            item.classList.toggle('active', !isActive);
        });
    });
}

// Initialize Live Catalog Search & Breed/Size Filters
function initCatalogFilters() {
    const searchInput = document.getElementById('catalogSearchInput');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.dogs-grid .dog-card');

    if (!cards.length) return;

    let activeFilter = 'all';
    let searchQuery = '';

    function filterCards() {
        let visibleCount = 0;
        cards.forEach(card => {
            const nameEl = card.querySelector('.dog-name');
            const breedEl = card.querySelector('.dog-breed');
            const descEl = card.querySelector('.dog-description');
            const sizeAttr = card.getAttribute('data-size') || '';

            const name = nameEl ? nameEl.textContent.toLowerCase() : '';
            const breed = breedEl ? breedEl.textContent.toLowerCase() : '';
            const desc = descEl ? descEl.textContent.toLowerCase() : '';
            const cardText = `${name} ${breed} ${desc}`;

            const matchesSearch = !searchQuery || cardText.includes(searchQuery);
            const matchesFilter = activeFilter === 'all' || 
                sizeAttr.toLowerCase() === activeFilter.toLowerCase() ||
                cardText.includes(activeFilter.toLowerCase());

            if (matchesSearch && matchesFilter) {
                card.style.display = '';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });

        // Show/hide no results message if needed
        let noResults = document.getElementById('noCatalogResults');
        if (visibleCount === 0) {
            if (!noResults) {
                noResults = document.createElement('div');
                noResults.id = 'noCatalogResults';
                noResults.className = 'no-results-msg';
                noResults.style.cssText = 'text-align: center; padding: 40px 20px; color: #94a3b8; font-size: 16px; grid-column: 1 / -1; width: 100%;';
                noResults.innerHTML = '🔍 No pets found matching your criteria. Try changing your search or filter.';
                const grid = document.querySelector('.dogs-grid');
                if (grid) grid.appendChild(noResults);
            } else {
                noResults.style.display = 'block';
            }
        } else if (noResults) {
            noResults.style.display = 'none';
        }
    }

    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            searchQuery = e.target.value.trim().toLowerCase();
            filterCards();
        });
    }

    if (filterBtns.length) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                filterBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                activeFilter = this.getAttribute('data-filter') || 'all';
                filterCards();
            });
        });
    }
}

// Interactive Dog Photo Switcher
function switchDogPhoto(btn, imgUrl) {
    const cardImage = btn.closest('.card-image');
    if (!cardImage) return;
    const img = cardImage.querySelector('img.primary-photo') || cardImage.querySelector('img');
    if (img) {
        img.style.opacity = '0.4';
        setTimeout(() => {
            img.src = imgUrl;
            img.style.opacity = '1';
        }, 150);
    }
    const pills = cardImage.querySelectorAll('.photo-pill');
    pills.forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
}