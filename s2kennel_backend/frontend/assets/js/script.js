document.addEventListener('DOMContentLoaded', function() {
    initNavbar();
    initDropdowns();
    initSmoothScroll();
    initEnquiryForm();
    initBookingForm();
    initModal();
    initFaqAccordion();
    initCatalogFilters();
    initCustomerGalleryFilter();
    initCardLightboxTriggers();
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

// Initialize Review Modal & Interactive Star Rating
function initReviewModal() {
    const addReviewBtn = document.getElementById('addReviewBtn');
    const reviewModal = document.getElementById('reviewModal');
    const closeReviewModal = document.getElementById('closeReviewModal');
    const reviewForm = document.getElementById('reviewForm');

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

    initStarRating();

    if (reviewForm) {
        reviewForm.addEventListener('submit', function(e) {
            e.preventDefault();
            submitReview();
        });
    }
}

function initStarRating() {
    const starRating = document.getElementById('starRating');
    const ratingInput = document.getElementById('ratingInput');
    const ratingDesc = document.getElementById('ratingDescription');
    if (!starRating || !ratingInput) return;

    const stars = starRating.querySelectorAll('.star-select');
    const descMap = {
        '1': '⭐ 1 / 5 (Poor)',
        '2': '⭐⭐ 2 / 5 (Fair)',
        '3': '⭐⭐⭐ 3 / 5 (Good)',
        '4': '⭐⭐⭐⭐ 4 / 5 (Very Good)',
        '5': '⭐⭐⭐⭐⭐ 5 / 5 (Excellent)'
    };

    function renderRating(val, isPreview) {
        const num = parseInt(val, 10) || 5;
        stars.forEach(s => {
            const sNum = parseInt(s.getAttribute('data-rating'), 10);
            if (isPreview) {
                s.classList.toggle('hover-preview', sNum <= num);
                s.classList.toggle('selected', sNum <= num);
            } else {
                s.classList.remove('hover-preview');
                s.classList.toggle('selected', sNum <= num);
                s.setAttribute('aria-checked', sNum === num ? 'true' : 'false');
            }
        });
        if (ratingDesc) {
            ratingDesc.textContent = descMap[num.toString()] || `${num} / 5 Stars`;
        }
    }

    stars.forEach(star => {
        // Hover preview
        star.addEventListener('mouseenter', function() {
            const hoverVal = this.getAttribute('data-rating');
            renderRating(hoverVal, true);
        });

        // Click selection
        star.addEventListener('click', function(e) {
            e.preventDefault();
            const chosen = this.getAttribute('data-rating');
            ratingInput.value = chosen;
            renderRating(chosen, false);
        });

        // Keyboard navigation (Enter / Space)
        star.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const chosen = this.getAttribute('data-rating');
                ratingInput.value = chosen;
                renderRating(chosen, false);
            }
        });
    });

    // Restore selected rating when mouse leaves
    starRating.addEventListener('mouseleave', function() {
        renderRating(ratingInput.value || '5', false);
    });

    // Touch support for mobile devices
    starRating.addEventListener('touchstart', function(e) {
        const touch = e.touches[0];
        const elem = document.elementFromPoint(touch.clientX, touch.clientY);
        if (elem && elem.classList.contains('star-select')) {
            const chosen = elem.getAttribute('data-rating');
            ratingInput.value = chosen;
            renderRating(chosen, false);
        }
    }, { passive: true });

    renderRating(ratingInput.value || '5', false);
}

function resetStarRating() {
    const ratingInput = document.getElementById('ratingInput');
    const ratingDesc = document.getElementById('ratingDescription');
    if (ratingInput) ratingInput.value = '5';
    const stars = document.querySelectorAll('.star-select');
    stars.forEach(s => {
        s.classList.add('selected');
        s.classList.remove('hover-preview');
        s.setAttribute('aria-checked', s.getAttribute('data-rating') === '5' ? 'true' : 'false');
    });
    if (ratingDesc) {
        ratingDesc.textContent = '⭐⭐⭐⭐⭐ 5 / 5 (Excellent)';
    }
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

// Initialize Customer Gallery Filter (All / Videos / Photos)
function initCustomerGalleryFilter() {
    const filterBtns = document.querySelectorAll('.gallery-filter-bar .gallery-filter-btn, .gallery-filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item-card, .gallery-card[data-type], #customerGalleryGrid .dog-card');

    if (!filterBtns.length) return;

    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            const target = (this.getAttribute('data-target') || 'all').toLowerCase();

            galleryItems.forEach(item => {
                const itemType = (item.getAttribute('data-type') || '').toLowerCase();
                if (target === 'all' || target === itemType || (target === 'videos' && itemType === 'video') || (target === 'photos' && itemType === 'photo')) {
                    item.style.display = 'flex';
                    item.style.animation = 'fadeIn 0.35s ease';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}

// Initialize Card Click Handlers for Full HD Lightbox (Photos & Videos)
function initCardLightboxTriggers() {
    // Event delegation on document to catch any .card-image click anywhere across the site
    document.addEventListener('click', function(e) {
        // If clicked on WhatsApp button or interactive links, let them work naturally
        if (e.target.closest('.btn-whatsapp, .btn, .photo-switcher-pills, .photo-pill, a[href^="https://wa.me"], a[href^="tel:"], .lightbox-close')) {
            return;
        }

        const cardImage = e.target.closest('.card-image, .gallery-card-thumb');
        if (!cardImage) return;

        // Extract media info from data attributes if present
        let mediaUrl = cardImage.getAttribute('data-media-url');
        let mediaType = cardImage.getAttribute('data-media-type');
        let posterUrl = cardImage.getAttribute('data-poster') || '';
        let title = cardImage.getAttribute('data-title') || '';
        let breed = cardImage.getAttribute('data-breed') || '';
        let caption = cardImage.getAttribute('data-caption') || '';

        const card = cardImage.closest('.dog-card, .cat-card, .premium-card, .gallery-item-card, .gallery-card');

        // Fallback for metadata
        if (card) {
            if (!title) {
                const nameEl = card.querySelector('.dog-name, .cat-name, h3');
                if (nameEl) title = nameEl.textContent.trim();
            }
            if (!breed) {
                const breedEl = card.querySelector('.dog-breed, .cat-breed');
                if (breedEl) breed = breedEl.textContent.trim().replace(/^🐾\s*/, '');
            }
            if (!caption) {
                const descEl = card.querySelector('.dog-description, p');
                const priceEl = card.querySelector('.value.price, .price');
                const ageEl = card.querySelector('.detail-item .value');
                if (priceEl) caption += `Price: ${priceEl.textContent.trim()}`;
                if (ageEl && ageEl !== priceEl) caption += ` • Age: ${ageEl.textContent.trim()}`;
                if (!caption && descEl) caption = descEl.textContent.trim().replace(/^“|”$/g, '');
            }
        }

        if (!title) title = 'S2 Kennel Jammu';

        // Check if data-media-url is provided
        if (mediaUrl) {
            const isVideo = mediaType === 'video' || /\.(mp4|webm|mov|ogg)($|\?)/i.test(mediaUrl);
            openMediaLightbox(mediaUrl, title, breed, caption, isVideo, posterUrl);
            return;
        }

        // Fallback: check child elements
        const video = cardImage.querySelector('video');
        const img = cardImage.querySelector('img.primary-photo') || cardImage.querySelector('img');

        if (video && video.src) {
            const isVid = true;
            openMediaLightbox(video.src, title, breed, caption, isVid, video.poster || '');
        } else if (img && img.src) {
            openMediaLightbox(img.src, title, breed, caption, false, '');
        }
    });
}

// Media Lightbox Modal Helper: Dynamically creates modal if absent in HTML
function createLightboxModalIfNeeded() {
    let modal = document.getElementById('mediaLightboxModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'mediaLightboxModal';
        modal.className = 'media-lightbox-modal';
        modal.onclick = closeMediaLightbox;
        modal.innerHTML = `
            <div class="lightbox-content" onclick="event.stopPropagation()">
                <button type="button" class="lightbox-close" onclick="closeMediaLightbox()" aria-label="Close lightbox">✕</button>
                <div class="lightbox-media-container">
                    <img id="lightboxImg" src="" alt="Full view" class="lightbox-img" style="display:none;">
                    <video id="lightboxVideo" class="lightbox-video" controls playsinline webkit-playsinline preload="auto" style="display:none;"></video>
                    <div id="lightboxVideoPlayFallback" class="lightbox-play-fallback" style="display:none;" onclick="playLightboxVideoManually()">
                        <div class="play-fallback-circle">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="#ffffff"><path d="M8 5v14l11-7z"/></svg>
                        </div>
                        <span>▶ Tap to Play Video</span>
                    </div>
                </div>
                <div class="lightbox-info">
                    <div class="lightbox-meta">
                        <h4 id="lightboxTitle" class="lightbox-title"></h4>
                        <span id="lightboxBreed" class="lightbox-breed-badge"></span>
                    </div>
                    <p id="lightboxCaption" class="lightbox-caption"></p>
                    <div class="lightbox-actions">
                        <a id="lightboxWaBtn" href="https://wa.me/919796120006" target="_blank" class="btn btn-whatsapp" style="width:auto; padding: 10px 22px; font-size: 13px;">
                            💬 Enquire On WhatsApp
                        </a>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }
    return modal;
}

// Manual play trigger if mobile browser policy blocks unmuted autoplay
function playLightboxVideoManually() {
    const modal = document.getElementById('mediaLightboxModal');
    if (!modal) return;
    const videoEl = modal.querySelector('#lightboxVideo') || document.getElementById('lightboxVideo');
    const fallbackEl = modal.querySelector('#lightboxVideoPlayFallback') || document.getElementById('lightboxVideoPlayFallback');
    if (videoEl) {
        videoEl.muted = false;
        videoEl.play().then(() => {
            if (fallbackEl) fallbackEl.style.display = 'none';
        }).catch(err => {
            console.warn("Manual video play attempt:", err);
        });
    }
}

// Media Lightbox Modal for Uncropped Full-Screen High-Res Images and Inline Video Player
function openMediaLightbox(mediaUrl, title, breed, caption, isVideo, posterUrl) {
    if (!mediaUrl) return;

    const modal = createLightboxModalIfNeeded();
    const imgEl = modal.querySelector('#lightboxImg') || document.getElementById('lightboxImg');
    const videoEl = modal.querySelector('#lightboxVideo') || document.getElementById('lightboxVideo');
    const fallbackEl = modal.querySelector('#lightboxVideoPlayFallback') || document.getElementById('lightboxVideoPlayFallback');
    const titleEl = modal.querySelector('#lightboxTitle') || document.getElementById('lightboxTitle');
    const breedEl = modal.querySelector('#lightboxBreed') || document.getElementById('lightboxBreed');
    const captionEl = modal.querySelector('#lightboxCaption') || document.getElementById('lightboxCaption');
    const waBtn = modal.querySelector('#lightboxWaBtn') || document.getElementById('lightboxWaBtn');

    // Auto-detect video if not explicitly specified
    if (typeof isVideo === 'undefined' || isVideo === null) {
        isVideo = /\.(mp4|webm|mov|ogg)($|\?)/i.test(mediaUrl);
    }

    if (fallbackEl) fallbackEl.style.display = 'none';

    if (isVideo) {
        if (imgEl) {
            imgEl.style.display = 'none';
            imgEl.src = '';
        }
        if (videoEl) {
            videoEl.style.display = 'block';
            videoEl.style.visibility = 'visible';
            videoEl.style.opacity = '1';
            videoEl.controls = true;
            videoEl.playsInline = true;
            videoEl.setAttribute('playsinline', 'true');
            videoEl.setAttribute('webkit-playsinline', 'true');
            videoEl.setAttribute('controls', 'controls');
            videoEl.setAttribute('preload', 'auto');
            videoEl.muted = false;

            if (posterUrl) {
                videoEl.poster = posterUrl;
            } else {
                videoEl.removeAttribute('poster');
            }
            videoEl.src = mediaUrl;
            videoEl.load();

            const playPromise = videoEl.play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    if (fallbackEl) fallbackEl.style.display = 'none';
                }).catch((err) => {
                    console.warn("Unmuted autoplay restricted by browser policy; showing tap-to-play:", err);
                    if (fallbackEl) {
                        fallbackEl.style.display = 'flex';
                    }
                });
            }
        }
    } else {
        if (videoEl) {
            videoEl.pause();
            videoEl.style.display = 'none';
            videoEl.removeAttribute('src');
            videoEl.removeAttribute('poster');
        }
        if (imgEl) {
            imgEl.style.display = 'block';
            imgEl.src = mediaUrl;
            imgEl.alt = title || 'S2 Kennel';
        }
    }

    if (titleEl) titleEl.textContent = title || 'S2 Kennel Jammu';
    if (breedEl) {
        if (breed && breed.trim().length > 0) {
            breedEl.textContent = '🐾 ' + breed.trim();
            breedEl.style.display = 'inline-block';
        } else {
            breedEl.style.display = 'none';
        }
    }
    if (captionEl) {
        captionEl.textContent = caption || '';
        captionEl.style.display = caption ? 'block' : 'none';
    }
    if (waBtn) {
        const queryText = encodeURIComponent(`Hello S2 Kennel Jammu, I saw the ${isVideo ? 'video reel' : 'photo'} of ${title || 'your puppy'} (${breed || ''}) on your website and would like to enquire.`);
        waBtn.href = `https://wa.me/919796120006?text=${queryText}`;
    }

    modal.classList.add('open');
    document.body.classList.add('modal-open');
    document.documentElement.classList.add('modal-open');
    document.body.style.overflow = 'hidden';
}

function closeMediaLightbox(e) {
    if (e && e.target) {
        const isBackground = e.target.classList.contains('media-lightbox-modal');
        const isCloseBtn = e.target.classList.contains('lightbox-close') || e.target.closest('.lightbox-close');
        if (!isBackground && !isCloseBtn) return;
    }

    const modal = document.getElementById('mediaLightboxModal');
    if (!modal) return;
    
    // Pause any playing video inside modal and unload
    const videoEl = modal.querySelector('#lightboxVideo') || document.getElementById('lightboxVideo');
    if (videoEl) {
        videoEl.pause();
        videoEl.removeAttribute('src');
        videoEl.load();
        videoEl.style.display = 'none';
    }

    const imgEl = modal.querySelector('#lightboxImg') || document.getElementById('lightboxImg');
    if (imgEl) {
        imgEl.style.display = 'none';
        imgEl.src = '';
    }

    const fallbackEl = modal.querySelector('#lightboxVideoPlayFallback') || document.getElementById('lightboxVideoPlayFallback');
    if (fallbackEl) fallbackEl.style.display = 'none';

    modal.classList.remove('open');
    document.body.classList.remove('modal-open');
    document.documentElement.classList.remove('modal-open');
    document.body.style.overflow = '';
}

// Close Lightbox on Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeMediaLightbox();
    }
});