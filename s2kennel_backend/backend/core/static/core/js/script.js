// S22 Kennel Jammu - Main JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initNavbar();
    initSmoothScroll();
    initEnquiryForm();
    initModal();
    observeElements();
    // Only load dogs gallery if Google Sheets loader hasn't already done it
    if (!window.dogsLoaded) {
        loadDogsGallery();
    }
    loadSavedReviews();
    initDogImageLightbox();
    initDeleteReview();
});

// Initialize Navbar Toggle
function initNavbar() {
    const navToggle = document.getElementById('navToggle');
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');

    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navToggle.classList.toggle('open');
            navbar.classList.toggle('open');
        });

        // Close navbar when a link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navToggle.classList.remove('open');
                navbar.classList.remove('open');
            });
        });

        // Close navbar on scroll
        window.addEventListener('scroll', function() {
            navToggle.classList.remove('open');
            navbar.classList.remove('open');
        });
    }
}

// Initialize Smooth Scroll for Navigation Links
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
    const modal = document.getElementById('enquiryModal');
    const closeModal = document.getElementById('closeModal');

    if (closeModal) {
        closeModal.addEventListener('click', function() {
            if (modal) {
                modal.classList.remove('show');
            }
        });
    }

    if (modal) {
        window.addEventListener('click', function(event) {
            if (event.target === modal) {
                modal.classList.remove('show');
            }
        });
    }

    // Initialize Success Modal
    initSuccessModal();

    // Initialize Review Modal
    initReviewModal();
}

// Initialize Success Modal
function initSuccessModal() {
    const successModal = document.getElementById('successModal');
    const closeSuccessModal = document.getElementById('closeSuccessModal');
    const successOkBtn = document.getElementById('successOkBtn');

    if (closeSuccessModal) {
        closeSuccessModal.addEventListener('click', function() {
            if (successModal) {
                successModal.classList.remove('show');
            }
        });
    }

    if (successOkBtn) {
        successOkBtn.addEventListener('click', function() {
            if (successModal) {
                successModal.classList.remove('show');
            }
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
    const cancelReviewBtn = document.getElementById('cancelReviewBtn');
    const reviewForm = document.getElementById('reviewForm');

    if (addReviewBtn) {
        addReviewBtn.addEventListener('click', function() {
            if (reviewModal) {
                reviewModal.classList.add('show');
            }
        });
    }

    if (closeReviewModal) {
        closeReviewModal.addEventListener('click', function() {
            if (reviewModal) {
                reviewModal.classList.remove('show');
            }
        });
    }

    if (cancelReviewBtn) {
        cancelReviewBtn.addEventListener('click', function() {
            if (reviewModal) {
                reviewModal.classList.remove('show');
            }
            if (reviewForm) {
                reviewForm.reset();
            }
        });
    }

    if (reviewModal) {
        window.addEventListener('click', function(event) {
            if (event.target === reviewModal) {
                reviewModal.classList.remove('show');
                if (reviewForm) {
                    reviewForm.reset();
                }
            }
        });
    }

    if (reviewForm) {
        reviewForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const name = document.getElementById('reviewName').value.trim();
            const email = document.getElementById('reviewEmail').value.trim();
            const breed = document.getElementById('reviewBreed').value.trim();
            const rating = document.getElementById('reviewRating').value;
            const text = document.getElementById('reviewText').value.trim();
            const date = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

            if (!name || !text) {
                alert('Please enter your name and review text.');
                return;
            }

            const formData = { name, email, breed, rating, text, date };

            sendReviewToServer({ reviewName: name, reviewEmail: email, reviewBreed: breed, reviewRating: rating, reviewText: text })
                .then(result => {
                    if (result && result.success) {
                        saveReviewToStorage(formData);
                        addReviewToDOM(formData);
                        alert('Thank you for your review! It has been submitted for approval.');
                        if (reviewModal) {
                            reviewModal.classList.remove('show');
                        }
                        reviewForm.reset();
                    } else {
                        throw new Error(result.error || 'Unable to submit review');
                    }
                })
                .catch(err => {
                    console.error('Review submission failed', err);
                    alert('Review submission failed. Please try again later.');
                });
        });
    }
}

// Initialize Dog Image Lightbox
function initDogImageLightbox() {
    const lightbox = document.getElementById('imageLightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const closeLightbox = document.getElementById('closeLightbox');
    const dogImages = document.querySelectorAll('.dog-image');

    if (!lightbox || !lightboxImage || !closeLightbox || dogImages.length === 0) {
        return;
    }

    // Add click event to all dog images
    dogImages.forEach(img => {
        img.style.cursor = 'pointer';
        img.addEventListener('click', function() {
            lightboxImage.src = this.src;
            lightboxImage.alt = this.alt;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    // Close lightbox when close button is clicked
    closeLightbox.addEventListener('click', function() {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
    });

    // Close lightbox when clicking outside the image
    lightbox.addEventListener('click', function(event) {
        if (event.target === lightbox) {
            lightbox.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });

    // Close lightbox on Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && lightbox.classList.contains('active')) {
            lightbox.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
}

// Review Management Functions
function generateStars(rating) {
    const stars = [];
    for (let i = 0; i < parseInt(rating); i++) {
        stars.push('<span class="star">⭐</span>');
    }
    return stars.join('');
}

function createReviewCard(review) {
    return `
        <div class="review-card">
            <div class="review-header">
                <div class="reviewer-info">
                    <h3 class="reviewer-name">${review.name}</h3>
                    <p class="reviewer-breed">🐕 ${review.breed}</p>
                </div>
            </div>
            <div class="review-rating">
                ${generateStars(review.rating)}
            </div>
            <p class="review-text">${review.text}</p>
            <p class="review-date">${review.date || review.timestamp}</p>
            <button class="btn btn-whatsapp share-review-btn" onclick="shareReview('${encodeURIComponent(review.text)}')">Share on WhatsApp</button>
        </div>
    `;
}

function saveReviewToStorage(review) {
    let reviews = JSON.parse(localStorage.getItem('customerReviews')) || [];
    reviews.push(review);
    localStorage.setItem('customerReviews', JSON.stringify(reviews));
}

function loadSavedReviews() {
    const reviewsGrid = document.querySelector('.reviews-grid');
    if (!reviewsGrid) return;

    const reviews = JSON.parse(localStorage.getItem('customerReviews')) || [];
    reviews.forEach(review => {
        const reviewCard = createReviewCard(review);
        reviewsGrid.insertAdjacentHTML('beforeend', reviewCard);
    });
}

function addReviewToDOM(review) {
    const reviewsGrid = document.querySelector('.reviews-grid');
    if (!reviewsGrid) return;

    const reviewCard = createReviewCard(review);
    reviewsGrid.insertAdjacentHTML('beforeend', reviewCard);
}

// Delete review functionality
function initDeleteReview() {
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('delete-review-btn')) {
            const reviewCard = e.target.closest('.review-card');
            if (reviewCard) {
                if (e.target.hasAttribute('data-static')) {
                    // For static reviews, just remove from DOM
                    reviewCard.remove();
                } else {
                    // For dynamic reviews, remove from localStorage and DOM
                    const reviews = JSON.parse(localStorage.getItem('customerReviews')) || [];
                    const reviewIndex = Array.from(reviewCard.parentNode.children).indexOf(reviewCard) - 6; // Adjust for static reviews
                    if (reviewIndex >= 0 && reviewIndex < reviews.length) {
                        reviews.splice(reviewIndex, 1);
                        localStorage.setItem('customerReviews', JSON.stringify(reviews));
                    }
                    reviewCard.remove();
                }
            }
        }
    });
}

// Open Enquiry Form with Dog Breed
function openEnquiryForm(breed) {
    const modal = document.getElementById('enquiryModal');
    const dogBreedField = document.getElementById('dogBreedModal');
    const catBreedField = document.getElementById('catBreedModal');

    // Set the breed field (for either dog or cat)
    if (dogBreedField) {
        dogBreedField.value = breed;
    } else if (catBreedField) {
        catBreedField.value = breed;
    }

    if (modal) {
        modal.classList.add('show');
    }
}

// Initialize Enquiry Form - Main Form
function initEnquiryForm() {
    // Global submit listener for dynamic forms - capture phase for hard force
    document.addEventListener('submit', function(e) {
        const id = e.target && e.target.id;
        if (id === 'enquiryForm' || id === 'enquiryFormModal' || id === 'bookDogForm') {
            e.preventDefault();
            e.stopImmediatePropagation();
            submitEnquiry(e.target);
        }
    }, true);
}

// Submit Enquiry to WhatsApp
function submitEnquiry(form) {
    // Support contact and booking forms
    const breedField = form.querySelector('[id*="Breed"]');
    const custNameField = form.querySelector('[id*="fullName"]') || form.querySelector('[id*="custName"]');
    const custPhoneField = form.querySelector('[id*="phoneNumber"]') || form.querySelector('[id*="custPhone"]');
    const custEmailField = form.querySelector('[id*="emailAddress"]');
    const custMessageField = form.querySelector('[id*="bookingMessage"]') || form.querySelector('[id*="custMessage"]');
    const visitDateField = form.querySelector('[id*="visitDate"]');

    const breed = breedField ? breedField.value : '';
    const custName = custNameField ? custNameField.value : '';
    const custPhone = custPhoneField ? custPhoneField.value : '';
    const custEmail = custEmailField ? custEmailField.value : '';
    const custMessage = custMessageField ? custMessageField.value : '';
    const visitDate = visitDateField ? visitDateField.value : '';

    // Validate form
    if (!custName || !custPhone || !custMessage) {
        alert('Please fill all required fields');
        return;
    }

    // Reset form immediately after validation
    form.reset();

    // Send the form data to the server to store in the admin panel
    const payload = {
        fullName: custName,
        phoneNumber: custPhone,
        emailAddress: custEmail,
        dogBreed: breed,
        visitDate: visitDate,
        bookingMessage: custMessage
    };

    if (form.id === 'bookDogForm') {
        sendBookDogToServer(payload)
            .then(() => {
                alert('Thank you! Your booking request has been submitted and will appear in the admin panel.');
            })
            .catch((err) => {
                console.error('Failed to send booking request to server', err);
                alert('Failed to submit your booking request. Please try again later.');
            });
    } else {
        sendEnquiryToServer({
            dogBreed: breed,
            custName,
            custPhone,
            custEmail,
            visitDate,
            custMessage
        })
            .then(() => {
                alert('Thank you! Your booking request has been submitted and will appear in the admin panel.');
            })
            .catch((err) => {
                console.error('Failed to send booking request to server', err);
                alert('Failed to submit your booking request. Please try again later.');
            });
    }

    // Close modal if it was opened
    const modal = document.getElementById('enquiryModal');
    if (modal && modal.classList.contains('show')) {
        modal.classList.remove('show');
    }
}

// Send enquiry to backend endpoint for DB + Excel logging
function sendEnquiryToServer(data) {
    return fetch('/api/enquiry/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        if (!result.success) {
            throw new Error(result.error || 'Server error');
        }
        console.log('Enquiry saved on server:', result);
        return result;
    })
    .catch(err => {
        console.error('Error saving enquiry to server:', err);
        throw err;
    });
}

function sendBookDogToServer(data) {
    return fetch('/api/book_dog/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        if (!result.success) {
            throw new Error(result.error || 'Server error');
        }
        console.log('Booking saved on server:', result);
        return result;
    })
    .catch(err => {
        console.error('Error saving booking to server:', err);
        throw err;
    });
}

function sendReviewToServer(data) {
    return fetch('/api/review/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .catch(err => {
        console.error('Error saving review to server:', err);
        return { success: false, error: err.message || 'Network error' };
    });
}

// Add scroll animations for elements
function observeElements() {
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });

        document.querySelectorAll('.dog-card, .management-card').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }
}

// Share Review on WhatsApp
function shareReview(encodedText) {
    const whatsappUrl = `https://api.whatsapp.com/send?phone=919796120006&text=${encodedText}`;
    window.open(whatsappUrl, "_blank");
}

// Scroll to Top Function
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Dynamic Dogs Gallery Loader
function loadDogsGallery(basePath = 'images/dogs/') {
    const grid = document.getElementById('dogsGrid');
    if (!grid) return;

    // Utility to create card HTML
    function createDogCard(data) {
        const card = document.createElement('article');
        card.className = 'dog-card';

        const imgWrap = document.createElement('div');
        imgWrap.className = 'dog-image-wrapper';

        const img = document.createElement('img');
        img.className = 'dog-image';
        img.alt = data.name || 'Premium Dog';
        img.src = data.src;

        const badge = document.createElement('span');
        badge.className = 'dog-badge';
        badge.textContent = 'Premium';

        imgWrap.appendChild(img);
        imgWrap.appendChild(badge);

        const info = document.createElement('div');
        info.className = 'dog-info';

        const h3 = document.createElement('h3');
        h3.className = 'dog-name';
        h3.textContent = data.name || guessNameFromSrc(data.src);

        const price = document.createElement('p');
        price.className = 'dog-price';
        price.textContent = data.price || 'Contact for Price';

        const desc = document.createElement('p');
        desc.className = 'dog-description';
        desc.textContent = data.description || '';

        const features = document.createElement('div');
        features.className = 'dog-features';
        if (data.features && data.features.length) {
            data.features.slice(0, 3).forEach(f => {
                const s = document.createElement('span');
                s.className = 'feature';
                s.textContent = f;
                features.appendChild(s);
            });
        }

        const btn = document.createElement('button');
        btn.className = 'btn btn-whatsapp';
        btn.textContent = '💬 Enquire Now';
        btn.addEventListener('click', function() { openEnquiryForm(h3.textContent); });

        info.appendChild(h3);
        info.appendChild(price);
        info.appendChild(desc);
        info.appendChild(features);
        info.appendChild(btn);

        card.appendChild(imgWrap);
        card.appendChild(info);

        return card;
    }

    function guessNameFromSrc(src) {
        const parts = src.split('/').pop().split('.')[0].replace(/[-_]/g, ' ').replace(/\d+/g, '').trim();
        return parts ? capitalize(parts) : 'Premium Dog';
    }

    function capitalize(s) { return s.replace(/\b\w/g, c => c.toUpperCase()); }

    // Try to fetch a manifest first: list.json
    fetch(`${basePath}list.json`).then(res => {
        if (!res.ok) throw new Error('no manifest');
        return res.json();
    }).then(list => {
        if (!Array.isArray(list)) return;
        list.forEach(item => {
            const src = item.src && item.src.startsWith('http') ? item.src : `${basePath}${item.src}`;
            grid.appendChild(createDogCard(Object.assign({}, item, { src })));
        });
        observeElements();
    }).catch(() => {
        // Fallback: probe for files named dog1..dogN with common extensions
        const exts = ['jpg', 'jpeg', 'png', 'webp'];
        let index = 1;
        let consecutiveMisses = 0;
        const maxConsecutiveMisses = 12;

        function tryNext() {
            if (consecutiveMisses >= maxConsecutiveMisses) {
                observeElements();
                return;
            }

            let tried = 0;
            let foundThisRound = false;

            exts.forEach(ext => {
                const fname = `dog${index}.${ext}`;
                const src = `${basePath}${fname}`;
                tried++;
                const img = new Image();
                img.onload = function() {
                    foundThisRound = true;
                    consecutiveMisses = 0;
                    grid.appendChild(createDogCard({ src }));
                    index++;
                    tryNext();
                };
                img.onerror = function() {
                    // when all extensions tried, advance index
                    tried--;
                    if (tried === 0 && !foundThisRound) {
                        consecutiveMisses++;
                        index++;
                        tryNext();
                    }
                };
                img.src = src;
            });
        }

        tryNext();
    });
}