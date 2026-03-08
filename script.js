/* MR SMILEY Portfolio - Complete JavaScript */
/* Enhanced with Backend API Integration */

(function() {
    'use strict';

    // Wait for DOM to be ready
    document.addEventListener('DOMContentLoaded', function() {
        console.log('MR SMILEY Portfolio - JavaScript Loaded');
        
        // Initialize theme
        initTheme();
        
        // Initialize all features
        initThemeToggle();
        initMobileMenu();
        initNavbarScroll();
        initSearchModal();
        initDownloadModal();
        initPrivateGallery();
        initGalleryFilter();
        initGalleryActions();
        initFaqAccordion();
        initContactForm();
        initBookingForm();
        initPaymentForm();
        initNewsletter();
        initSmoothScroll();
        initActiveNav();
        initScrollReveal();
        initCounterAnimation();
        initVideoUpload();
        initBackToTop();
        initImageUpload();
    });

    // ======================
    // Theme Functions
    // ======================
    function initTheme() {
        const savedTheme = localStorage.getItem('theme') || 'dark';
        document.documentElement.setAttribute('data-theme', savedTheme);
        updateThemeIcon(savedTheme);
    }

    function initThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', function() {
                const currentTheme = document.documentElement.getAttribute('data-theme');
                const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
                document.documentElement.setAttribute('data-theme', newTheme);
                localStorage.setItem('theme', newTheme);
                updateThemeIcon(newTheme);
                showToast('Switched to ' + newTheme.charAt(0).toUpperCase() + newTheme.slice(1) + ' Mode');
            });
        }
    }

    function updateThemeIcon(theme) {
        const icon = document.querySelector('.theme-toggle i');
        if (icon) {
            icon.className = theme === 'light' ? 'fas fa-sun' : 'fas fa-moon';
        }
    }

    // ======================
    // Mobile Menu
    // ======================
    function initMobileMenu() {
        const menuBtn = document.getElementById('menuToggle');
        const navLinks = document.getElementById('navLinks');
        
        if (menuBtn && navLinks) {
            menuBtn.addEventListener('click', function() {
                navLinks.classList.toggle('open');
            });

            // Close menu when clicking a link
            navLinks.querySelectorAll('a').forEach(function(link) {
                link.addEventListener('click', function() {
                    navLinks.classList.remove('open');
                });
            });
        }
    }

    // ======================
    // Navbar Scroll Effect
    // ======================
    function initNavbarScroll() {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            window.addEventListener('scroll', function() {
                navbar.classList.toggle('scrolled', window.scrollY > 50);
            });
        }
    }

    // ======================
    // Search Modal
    // ======================
    function initSearchModal() {
        const searchBtn = document.getElementById('searchBtn');
        const searchModal = document.getElementById('searchModal');
        const searchClose = document.getElementById('searchClose');
        
        if (searchBtn && searchModal) {
            searchBtn.addEventListener('click', function() {
                searchModal.classList.add('open');
                document.body.style.overflow = 'hidden';
                const searchInput = document.getElementById('searchInput');
                if (searchInput) searchInput.focus();
            });

            if (searchClose) {
                searchClose.addEventListener('click', function() {
                    searchModal.classList.remove('open');
                    document.body.style.overflow = '';
                });
            }

            searchModal.addEventListener('click', function(e) {
                if (e.target === searchModal) {
                    searchModal.classList.remove('open');
                    document.body.style.overflow = '';
                }
            });
        }
    }

    // ======================
    // Download Modal
    // ======================
    function initDownloadModal() {
        const downloadModal = document.getElementById('downloadModal');
        const downloadClose = document.getElementById('downloadClose');
        
        if (downloadModal && downloadClose) {
            downloadClose.addEventListener('click', function() {
                downloadModal.classList.remove('open');
                document.body.style.overflow = '';
            });

            downloadModal.addEventListener('click', function(e) {
                if (e.target === downloadModal) {
                    downloadModal.classList.remove('open');
                    document.body.style.overflow = '';
                }
            });
        }
    }

    window.openDownload = function(btn) {
        const downloadModal = document.getElementById('downloadModal');
        const downloadPreviewImg = document.getElementById('downloadPreviewImg');
        if (downloadModal && downloadPreviewImg && btn) {
            const galleryItem = btn.closest('.gallery-item');
            const img = galleryItem.querySelector('img');
            if (img) {
                downloadPreviewImg.src = img.src;
            }
            downloadModal.classList.add('open');
            document.body.style.overflow = 'hidden';
        }
    };

    window.downloadImage = function() {
        showToast('Download started!');
        setTimeout(function() {
            document.getElementById('downloadModal').classList.remove('open');
            document.body.style.overflow = '';
        }, 1000);
    };

    // ======================
    // Private Gallery
    // ======================
    function initPrivateGallery() {
        const privateGalleryBtn = document.getElementById('privateGalleryBtn');
        const privateGalleryModal = document.getElementById('privateGalleryModal');
        
        if (privateGalleryBtn && privateGalleryModal) {
            privateGalleryBtn.addEventListener('click', function() {
                privateGalleryModal.classList.add('open');
                document.body.style.overflow = 'hidden';
            });

            privateGalleryModal.addEventListener('click', function(e) {
                if (e.target === privateGalleryModal) {
                    privateGalleryModal.classList.remove('open');
                    document.body.style.overflow = '';
                }
            });
        }
    }

    window.accessGallery = async function(e) {
        if (e) e.preventDefault();
        const accessCode = document.getElementById('accessCode');
        if (!accessCode || !accessCode.value) {
            showToast('Please enter access code');
            return;
        }

        try {
            const response = await fetch('/api/gallery/access', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ accessCode: accessCode.value })
            });
            const data = await response.json();
            
            if (data.success) {
                showToast('Access granted!');
                document.getElementById('privateGalleryModal').classList.remove('open');
                accessCode.value = '';
            } else {
                showToast(data.message || 'Invalid access code');
            }
        } catch (err) {
            showToast('Access denied');
        }
    };

    // ======================
    // Gallery Filter
    // ======================
    function initGalleryFilter() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        const galleryItems = document.querySelectorAll('.gallery-item');

        filterBtns.forEach(function(btn) {
            btn.addEventListener('click', function() {
                filterBtns.forEach(function(b) { b.classList.remove('active'); });
                this.classList.add('active');

                const filter = this.getAttribute('data-filter');
                galleryItems.forEach(function(item) {
                    const category = item.getAttribute('data-category');
                    item.style.display = (filter === 'all' || category === filter) ? 'block' : 'none';
                });
            });
        });
    }

    // ======================
    // Gallery Actions
    // ======================
    function initGalleryActions() {
        // View button
        document.querySelectorAll('.gallery-action-btn[data-action="view"]').forEach(function(btn) {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const img = this.closest('.gallery-item').querySelector('img');
                if (img) window.open(img.src, '_blank');
            });
        });

        // Download button
        document.querySelectorAll('.gallery-action-btn[data-action="download"]').forEach(function(btn) {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                window.openDownload(this);
            });
        });

        // Share button
        document.querySelectorAll('.gallery-action-btn[data-action="share"]').forEach(function(btn) {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const title = this.closest('.gallery-item').getAttribute('data-title') || 'Photo';
                if (navigator.share) {
                    navigator.share({ title: title, url: window.location.href });
                } else {
                    navigator.clipboard.writeText(window.location.href);
                    showToast('Link copied!');
                }
            });
        });
    }

    // ======================
    // FAQ Accordion
    // ======================
    function initFaqAccordion() {
        document.querySelectorAll('.faq-question').forEach(function(question) {
            question.addEventListener('click', function() {
                const item = this.parentElement;
                const isActive = item.classList.contains('active');
                
                // Close all
                document.querySelectorAll('.faq-item').forEach(function(i) {
                    i.classList.remove('active');
                });
                
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        });
    }

    // ======================
    // Contact Form (with Backend)
    // ======================
    function initContactForm() {
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', async function(e) {
                e.preventDefault();
                
                const formData = new FormData(contactForm);
                const data = {
                    name: formData.get('name'),
                    email: formData.get('email'),
                    subject: formData.get('subject'),
                    message: formData.get('message')
                };

                try {
                    const response = await fetch('/api/contact', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(data)
                    });
                    const result = await response.json();
                    
                    if (result.success) {
                        showToast('Message sent successfully!');
                        contactForm.reset();
                    } else {
                        showToast(result.message || 'Failed to send message');
                    }
                } catch (err) {
                    // Fallback: localStorage
                    saveToLocalStorage('contacts', data);
                    showToast('Message saved! (Offline mode)');
                    contactForm.reset();
                }
            });
        }
    }

    // ======================
    // Booking Form (with Backend)
    // ======================
    function initBookingForm() {
        const bookingForm = document.getElementById('bookingForm');
        if (bookingForm) {
            bookingForm.addEventListener('submit', async function(e) {
                e.preventDefault();
                
                const formData = new FormData(bookingForm);
                const data = {
                    name: formData.get('name'),
                    email: formData.get('email'),
                    phone: formData.get('phone'),
                    service: formData.get('service'),
                    package: formData.get('package'),
                    date: formData.get('date'),
                    message: formData.get('message')
                };

                try {
                    const response = await fetch('/api/booking', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(data)
                    });
                    const result = await response.json();
                    
                    if (result.success) {
                        showToast('Booking confirmed! Booking ID: ' + result.bookingId);
                        bookingForm.reset();
                    } else {
                        showToast(result.message || 'Booking failed');
                    }
                } catch (err) {
                    // Fallback
                    saveToLocalStorage('bookings', data);
                    showToast('Booking saved! (Offline mode)');
                    bookingForm.reset();
                }
            });
        }
    }

    // ======================
    // Payment Form (with Backend)
    // ======================
    function initPaymentForm() {
        const paymentForm = document.getElementById('paymentForm');
        if (paymentForm) {
            // Payment method selection
            document.querySelectorAll('.payment-method-btn').forEach(function(btn) {
                btn.addEventListener('click', function() {
                    document.querySelectorAll('.payment-method-btn').forEach(function(b) {
                        b.classList.remove('active');
                    });
                    this.classList.add('active');
                });
            });

            // Card number formatting
            const cardInput = paymentForm.querySelector('input[name="cardNumber"]');
            if (cardInput) {
                cardInput.addEventListener('input', function(e) {
                    let value = e.target.value.replace(/\D/g, '');
                    let formatted = value.match(/.{1,4}/g) ? value.match(/.{1,4}/g).join(' ') : value;
                    e.target.value = formatted;
                });
            }

            // Expiry formatting
            const expiryInput = paymentForm.querySelector('input[name="expiry"]');
            if (expiryInput) {
                expiryInput.addEventListener('input', function(e) {
                    let value = e.target.value.replace(/\D/g, '');
                    if (value.length >= 2) {
                        value = value.substring(0, 2) + '/' + value.substring(2);
                    }
                    e.target.value = value;
                });
            }

            // Form submission
            paymentForm.addEventListener('submit', async function(e) {
                e.preventDefault();
                
                const formData = new FormData(paymentForm);
                const data = {
                    cardName: formData.get('cardName'),
                    cardNumber: formData.get('cardNumber'),
                    expiry: formData.get('expiry'),
                    cvv: formData.get('cvv'),
                    amount: formData.get('amount')
                };

                try {
                    const response = await fetch('/api/payment', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(data)
                    });
                    const result = await response.json();
                    
                    if (result.success) {
                        showToast('Payment successful! Transaction ID: ' + result.transactionId);
                        paymentForm.reset();
                        document.querySelectorAll('.payment-method-btn').forEach(function(b) {
                            b.classList.remove('active');
                        });
                        document.querySelector('.payment-method-btn')?.classList.add('active');
                    } else {
                        showToast(result.message || 'Payment failed');
                    }
                } catch (err) {
                    showToast('Payment processed! (Demo mode)');
                    paymentForm.reset();
                }
            });
        }
    }

    // ======================
    // Newsletter (with Backend)
    // ======================
    function initNewsletter() {
        const newsletterBtn = document.getElementById('newsletterBtn');
        const newsletterEmail = document.getElementById('newsletterEmail');
        
        if (newsletterBtn && newsletterEmail) {
            newsletterBtn.addEventListener('click', async function() {
                const email = newsletterEmail.value.trim();
                if (!email) {
                    showToast('Please enter your email');
                    return;
                }

                try {
                    const response = await fetch('/api/subscribe', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email })
                    });
                    const result = await response.json();
                    
                    if (result.success) {
                        showToast('Thank you for subscribing!');
                        newsletterEmail.value = '';
                    } else {
                        showToast(result.message || 'Subscription failed');
                    }
                } catch (err) {
                    // Fallback
                    saveToLocalStorage('subscriptions', { email: email });
                    showToast('Subscribed! (Offline mode)');
                    newsletterEmail.value = '';
                }
            });
        }
    }

    // ======================
    // Smooth Scroll
    // ======================
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(function(link) {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href && href !== '#' && href.length > 1) {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) {
                        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }
            });
        });
    }

    // ======================
    // Active Navigation
    // ======================
    function initActiveNav() {
        const sections = document.querySelectorAll('section[id]');
        const navItems = document.querySelectorAll('.nav-links a');

        function updateActiveLink() {
            const scrollPos = window.scrollY + 150;
            
            sections.forEach(function(section, index) {
                const sectionTop = section.offsetTop;
                if (scrollPos >= sectionTop) {
                    navItems.forEach(function(nav) { nav.classList.remove('active'); });
                    if (navItems[index]) navItems[index].classList.add('active');
                }
            });
        }
        
        updateActiveLink();
        window.addEventListener('scroll', updateActiveLink);
    }

    // ======================
    // Scroll Reveal Animation
    // ======================
    function initScrollReveal() {
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('in');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.12 });

            document.querySelectorAll('.gallery-item, .pricing-card, .service-detail-card, .blog-card, .video-card, .testimonial-card, .contact-item').forEach(function(el) {
                el.classList.add('reveal');
                observer.observe(el);
            });
        }
    }

    // ======================
    // Counter Animation
    // ======================
    function initCounterAnimation() {
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        const target = entry.target;
                        const text = target.textContent;
                        const num = parseInt(text.replace(/\D/g, ''));
                        
                        if (num) {
                            let current = 0;
                            const increment = num / 50;
                            const timer = setInterval(function() {
                                current += increment;
                                if (current >= num) {
                                    current = num;
                                    clearInterval(timer);
                                }
                                target.textContent = Math.floor(current) + '+';
                            }, 30);
                        }
                        observer.unobserve(target);
                    }
                });
            }, { threshold: 0.5 });

            document.querySelectorAll('.hero-stat-number, .stat-number').forEach(function(el) {
                observer.observe(el);
            });
        }
    }

    // ======================
    // Video Upload
    // ======================
    function initVideoUpload() {
        const uploadArea = document.getElementById('uploadArea');
        const videoUpload = document.getElementById('videoUpload');
        
        if (uploadArea && videoUpload) {
            uploadArea.addEventListener('click', function() {
                videoUpload.click();
            });

            uploadArea.addEventListener('dragover', function(e) {
                e.preventDefault();
                uploadArea.classList.add('dragover');
            });

            uploadArea.addEventListener('dragleave', function() {
                uploadArea.classList.remove('dragover');
            });

            uploadArea.addEventListener('drop', function(e) {
                e.preventDefault();
                uploadArea.classList.remove('dragover');
                const file = e.dataTransfer.files[0];
                if (file && file.type.startsWith('video/')) {
                    uploadVideoToServer(file);
                }
            });

            videoUpload.addEventListener('change', function(e) {
                if (e.target.files && e.target.files[0]) {
                    uploadVideoToServer(e.target.files[0]);
                }
            });
        }
        
        // Load uploaded videos on page load
        loadUploadedVideos();
    }
    
    // Upload video to server
    async function uploadVideoToServer(file) {
        showToast('Uploading video: ' + file.name + '...');
        
        const formData = new FormData();
        formData.append('video', file);
        
        try {
            const response = await fetch('/api/upload/video', {
                method: 'POST',
                body: formData
            });
            const result = await response.json();
            
            if (result.success) {
                showToast('Video uploaded successfully!');
                loadUploadedVideos();
                // Also refresh the video gallery section
                loadVideoGallery();
            } else {
                showToast(result.message || 'Video upload failed');
            }
        } catch (err) {
            showToast('Video upload failed. Please try again.');
            console.error('Video upload error:', err);
        }
    }
    
    // Load uploaded videos and display in video gallery
    async function loadUploadedVideos() {
        const videoGrid = document.querySelector('.video-grid');
        if (!videoGrid) return;
        
        try {
            const response = await fetch('/api/gallery/videos');
            const result = await response.json();
            
            if (result.success && result.videos && result.videos.length > 0) {
                // We'll append new videos to existing ones
                const existingVideos = videoGrid.querySelectorAll('.video-card').length;
                if (result.videos.length > existingVideos) {
                    // Add new videos to gallery
                    result.videos.forEach(function(video, index) {
                        // Check if video already exists in DOM
                        const existingCards = videoGrid.querySelectorAll('.video-card');
                        let exists = false;
                        existingCards.forEach(function(card) {
                            if (card.dataset.videoId === video.id) {
                                exists = true;
                            }
                        });
                        
                        if (!exists) {
                            const videoCard = createVideoCard(video);
                            videoGrid.appendChild(videoCard);
                        }
                    });
                }
            }
        } catch (err) {
            console.error('Error loading videos:', err);
        }
    }
    
    // Create video card element
    function createVideoCard(video) {
        const card = document.createElement('div');
        card.className = 'video-card';
        card.dataset.videoId = video.id;
        
        card.innerHTML = `
            <div class="video-thumbnail" onclick="playVideo('${video.path}')">
                <i class="fas fa-play-circle"></i>
                <span class="video-duration">Video</span>
            </div>
            <div class="video-info">
                <h3>${video.originalName || 'Uploaded Video'}</h3>
                <p>${new Date(video.uploadedAt).toLocaleDateString()}</p>
                <button class="btn-delete-video" onclick="deleteVideo('${video.id}', event)" style="margin-top: 10px; padding: 8px 16px; background: #ff6b6b; color: white; border: none; border-radius: 4px; cursor: pointer;">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        `;
        
        return card;
    }
    
    // Load video gallery section
    async function loadVideoGallery() {
        const videoGrid = document.querySelector('.video-grid');
        if (!videoGrid) return;
        
        try {
            const response = await fetch('/api/gallery/videos');
            const result = await response.json();
            
            if (result.success && result.videos && result.videos.length > 0) {
                // Clear existing and rebuild
                const existingCards = videoGrid.querySelectorAll('.video-card');
                existingCards.forEach(function(card) {
                    if (card.dataset.uploaded === 'true') {
                        card.remove();
                    }
                });
                
                result.videos.forEach(function(video) {
                    const card = createVideoCard(video);
                    card.dataset.uploaded = 'true';
                    videoGrid.appendChild(card);
                });
            }
        } catch (err) {
            console.error('Error loading video gallery:', err);
        }
    }
    
    // Play video function
    window.playVideo = function(path) {
        // Create video modal
        let videoModal = document.getElementById('videoPlayerModal');
        if (!videoModal) {
            videoModal = document.createElement('div');
            videoModal.id = 'videoPlayerModal';
            videoModal.className = 'video-modal';
            videoModal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.9);z-index:9999;display:none;align-items:center;justify-content:center;';
            videoModal.innerHTML = `
                <div style="position:relative;max-width:90%;max-height:90%;">
                    <video controls style="max-width:100%;max-height:80vh;border-radius:10px;" id="videoPlayer"></video>
                    <button onclick="closeVideoModal()" style="position:absolute;top:-40px;right:0;background:none;border:none;color:white;font-size:24px;cursor:pointer;">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `;
            document.body.appendChild(videoModal);
            
            // Close on click outside
            videoModal.addEventListener('click', function(e) {
                if (e.target === videoModal) {
                    closeVideoModal();
                }
            });
        }
        
        const player = document.getElementById('videoPlayer');
        player.src = path;
        videoModal.style.display = 'flex';
        player.play();
    };
    
    window.closeVideoModal = function() {
        const videoModal = document.getElementById('videoPlayerModal');
        const player = document.getElementById('videoPlayer');
        if (player) {
            player.pause();
            player.src = '';
        }
        if (videoModal) {
            videoModal.style.display = 'none';
        }
    };
    
    // Delete video function
    window.deleteVideo = async function(id, event) {
        if (event) {
            event.stopPropagation();
        }
        
        if (!confirm('Are you sure you want to delete this video?')) return;
        
        try {
            const response = await fetch('/api/gallery/videos/' + id, {
                method: 'DELETE'
            });
            const result = await response.json();
            
            if (result.success) {
                showToast('Video deleted');
                loadUploadedVideos();
                loadVideoGallery();
            } else {
                showToast(result.message || 'Delete failed');
            }
        } catch (err) {
            showToast('Delete failed');
        }
    };

    // ======================
    // Back to Top
    // ======================
    function initBackToTop() {
        const backToTop = document.getElementById('backToTop');
        if (backToTop) {
            window.addEventListener('scroll', function() {
                backToTop.classList.toggle('visible', window.scrollY > 400);
            });

            backToTop.addEventListener('click', function() {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }
    }

    // ======================
    // Helper Functions
    // ======================
    function showToast(message) {
        let toast = document.getElementById('toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'toast';
            toast.className = 'toast';
            document.body.appendChild(toast);
        }
        
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(function() {
            toast.classList.remove('show');
        }, 3000);
    }

    function saveToLocalStorage(key, data) {
        const storage = JSON.parse(localStorage.getItem('mrSmiley_' + key) || '[]');
        storage.push({ ...data, id: Date.now(), date: new Date().toISOString() });
        localStorage.setItem('mrSmiley_' + key, JSON.stringify(storage));
    }

    // Global functions for inline onclick handlers
    window.toggleMenu = function() {
        document.getElementById('navLinks').classList.toggle('open');
    };

    window.openSearch = function() {
        document.getElementById('searchModal').classList.add('open');
    };

    window.closeSearch = function() {
        document.getElementById('searchModal').classList.remove('open');
    };

    window.openPrivateGallery = function() {
        document.getElementById('privateGalleryModal').classList.add('open');
    };

    window.toggleFaq = function(btn) {
        btn.parentElement.classList.toggle('active');
    };

    window.filterGallery = function(filter) {
        const items = document.querySelectorAll('.gallery-item');
        const btns = document.querySelectorAll('.filter-btn');
        btns.forEach(function(b) { b.classList.remove('active'); });
        event.target.classList.add('active');
        items.forEach(function(item) {
            const cat = item.getAttribute('data-category');
            item.style.display = (filter === 'all' || cat === filter) ? 'block' : 'none';
        });
    };

    // ======================
    // Image Upload Functions
    // ======================
    function initImageUpload() {
        // Single Image Upload
        const singleForm = document.getElementById('singleImageUploadForm');
        const singleInput = document.getElementById('singleImageInput');
        const singleZone = document.getElementById('singleUploadZone');
        const singlePreview = document.getElementById('singleUploadPreview');

        if (singleInput && singleZone) {
            singleInput.addEventListener('change', function(e) {
                if (this.files && this.files[0]) {
                    showImagePreview(this.files[0], singlePreview);
                }
            });

            singleZone.addEventListener('dragover', function(e) {
                e.preventDefault();
                this.classList.add('dragover');
            });

            singleZone.addEventListener('dragleave', function() {
                this.classList.remove('dragover');
            });

            singleZone.addEventListener('drop', function(e) {
                e.preventDefault();
                this.classList.remove('dragover');
                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                    singleInput.files = e.dataTransfer.files;
                    showImagePreview(e.dataTransfer.files[0], singlePreview);
                }
            });
        }

        if (singleForm) {
            singleForm.addEventListener('submit', async function(e) {
                e.preventDefault();
                const formData = new FormData(singleForm);
                
                try {
                    const response = await fetch('/api/upload', {
                        method: 'POST',
                        body: formData
                    });
                    const result = await response.json();
                    
                    if (result.success) {
                        showToast('Image uploaded successfully!');
                        singleForm.reset();
                        singlePreview.innerHTML = '';
                        loadUploadedImages();
                    } else {
                        showToast(result.message || 'Upload failed');
                    }
                } catch (err) {
                    showToast('Upload failed. Please try again.');
                }
            });
        }

        // Multiple Image Upload
        const multipleForm = document.getElementById('multipleImageUploadForm');
        const multipleInput = document.getElementById('multipleImageInput');
        const multipleZone = document.getElementById('multipleUploadZone');
        const multiplePreview = document.getElementById('multipleUploadPreview');

        if (multipleInput && multipleZone) {
            multipleInput.addEventListener('change', function(e) {
                if (this.files) {
                    multiplePreview.innerHTML = '';
                    Array.from(this.files).forEach(function(file) {
                        showImagePreview(file, multiplePreview);
                    });
                }
            });

            multipleZone.addEventListener('dragover', function(e) {
                e.preventDefault();
                this.classList.add('dragover');
            });

            multipleZone.addEventListener('dragleave', function() {
                this.classList.remove('dragover');
            });

            multipleZone.addEventListener('drop', function(e) {
                e.preventDefault();
                this.classList.remove('dragover');
                if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                    multipleInput.files = e.dataTransfer.files;
                    multiplePreview.innerHTML = '';
                    Array.from(e.dataTransfer.files).forEach(function(file) {
                        showImagePreview(file, multiplePreview);
                    });
                }
            });
        }

        if (multipleForm) {
            multipleForm.addEventListener('submit', async function(e) {
                e.preventDefault();
                const formData = new FormData(multipleForm);
                
                try {
                    const response = await fetch('/api/upload/multiple', {
                        method: 'POST',
                        body: formData
                    });
                    const result = await response.json();
                    
                    if (result.success) {
                        showToast(result.message || 'Images uploaded successfully!');
                        multipleForm.reset();
                        multiplePreview.innerHTML = '';
                        loadUploadedImages();
                    } else {
                        showToast(result.message || 'Upload failed');
                    }
                } catch (err) {
                    showToast('Upload failed. Please try again.');
                }
            });
        }

        // Load uploaded images on page load
        loadUploadedImages();
    }

    function showImagePreview(file, container) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const div = document.createElement('div');
            div.className = 'preview-item';
            div.innerHTML = '<img src="' + e.target.result + '" alt="Preview"><span class="preview-name">' + file.name + '</span>';
            container.appendChild(div);
        };
        reader.readAsDataURL(file);
    }

    async function loadUploadedImages() {
        const grid = document.getElementById('uploadedImagesGrid');
        if (!grid) return;

        try {
            const response = await fetch('/api/gallery/images');
            const result = await response.json();
            
            if (result.success && result.images && result.images.length > 0) {
                grid.innerHTML = result.images.map(function(img) {
                    return '<div class="uploaded-image-item">' +
                        '<img src="' + img.path + '" alt="' + img.originalName + '">' +
                        '<div class="uploaded-image-overlay">' +
                        '<button onclick="viewImage(\'' + img.path + '\')"><i class="fas fa-eye"></i></button>' +
                        '<button onclick="deleteImage(\'' + img.id + '\')"><i class="fas fa-trash"></i></button>' +
                        '</div>' +
                        '</div>';
                }).join('');
            } else {
                grid.innerHTML = '<p class="no-images">No images uploaded yet</p>';
            }
        } catch (err) {
            grid.innerHTML = '<p class="no-images">No images uploaded yet</p>';
        }
    }

    window.viewImage = function(path) {
        window.open(path, '_blank');
    };

    window.deleteImage = async function(id) {
        if (!confirm('Are you sure you want to delete this image?')) return;
        
        try {
            const response = await fetch('/api/gallery/images/' + id, {
                method: 'DELETE'
            });
            const result = await response.json();
            
            if (result.success) {
                showToast('Image deleted');
                loadUploadedImages();
            } else {
                showToast(result.message || 'Delete failed');
            }
        } catch (err) {
            showToast('Delete failed');
        }
    };

})();

