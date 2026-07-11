// ==========================================================================
// NEXTGEN FITNESS INTERACTIVE INTERFACE LOGIC
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
    initMobileNav();
    initScrollRevealFallback();
    initActiveNavLinkObserver();
    initTestimonialsSlider();
    initReviewModal();
    initHeroParallax();
    initDottedSurface();
    initFolderGallery();
});

/* ==========================================================================
   MOBILE NAVIGATION MENU TOGGLE
   ========================================================================== */
function initMobileNav() {
    const navToggle = document.getElementById('mobile-nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (!navToggle || !navMenu) return;

    // Toggle menu visibility
    navToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = navMenu.classList.toggle('open');
        navToggle.classList.toggle('active');
        navToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close menu when clicking navigation link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('open');
            navToggle.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
            navMenu.classList.remove('open');
            navToggle.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
        }
    });
}

/* ==========================================================================
   SCROLL-DRIVEN ANIMATION FALLBACK
   ========================================================================== */
function initScrollRevealFallback() {
    // Check if browser natively supports CSS scroll timelines
    const supportsScrollTimeline = CSS.supports('(animation-timeline: view()) and (animation-range: entry)');
    
    if (!supportsScrollTimeline) {
        const revealElements = document.querySelectorAll('.scroll-reveal');
        
        const observerOptions = {
            root: null, // Viewport
            rootMargin: '0px 0px -10% 0px', // Trigger slightly before entering fully
            threshold: 0.05
        };

        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('scroll-reveal-visible');
                    // Once visible, stop observing to optimize performance
                    revealObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);

        revealElements.forEach(el => {
            el.classList.add('scroll-reveal-init');
            revealObserver.observe(el);
        });
    }
}

/* ==========================================================================
   ACTIVE LINK SPY ON SCROLL
   ========================================================================== */
function initActiveNavLinkObserver() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    const spyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.getAttribute('id');
                
                navLinks.forEach(link => {
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
            }
        });
    }, {
        root: null,
        rootMargin: '-40% 0px -50% 0px' // Focus on the middle of the viewport
    });

    sections.forEach(section => spyObserver.observe(section));
}

/* ==========================================================================
   TESTIMONIALS SLIDER
   ========================================================================== */
let currentSlide = 0;
let slidesCount = 3;

function initTestimonialsSlider() {
    const track = document.getElementById('carousel-track');
    const prevBtn = document.getElementById('carousel-prev');
    const nextBtn = document.getElementById('carousel-next');
    const dotsContainer = document.getElementById('carousel-dots');
    
    if (!track || !prevBtn || !nextBtn || !dotsContainer) return;

    // Refresh slides status
    updateSliderStatus();

    prevBtn.addEventListener('click', () => {
        if (currentSlide > 0) {
            goToSlide(currentSlide - 1);
        } else {
            goToSlide(slidesCount - 1); // Wrap to last
        }
    });

    nextBtn.addEventListener('click', () => {
        if (currentSlide < slidesCount - 1) {
            goToSlide(currentSlide + 1);
        } else {
            goToSlide(0); // Wrap to first
        }
    });

    // Delegate dot clicks
    dotsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('dot')) {
            const slideIndex = parseInt(e.target.getAttribute('data-slide'));
            goToSlide(slideIndex);
        }
    });
}

function goToSlide(index) {
    const track = document.getElementById('carousel-track');
    const dots = document.querySelectorAll('#carousel-dots .dot');
    
    if (!track) return;
    
    currentSlide = index;
    
    // Shift track
    const translation = -currentSlide * (100 / slidesCount);
    track.style.transform = `translateX(${translation}%)`;
    
    // Update active dot
    dots.forEach((dot, idx) => {
        if (idx === currentSlide) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

function updateSliderStatus() {
    const track = document.getElementById('carousel-track');
    const dotsContainer = document.getElementById('carousel-dots');
    if (!track || !dotsContainer) return;

    const slides = track.querySelectorAll('.review-slide');
    slidesCount = slides.length;
    track.style.width = `${slidesCount * 100}%`;
    slides.forEach(slide => {
        slide.style.width = `${100 / slidesCount}%`;
    });

    // Rebuild dots
    dotsContainer.innerHTML = '';
    for (let i = 0; i < slidesCount; i++) {
        const dot = document.createElement('span');
        dot.classList.add('dot');
        if (i === currentSlide) dot.classList.add('active');
        dot.setAttribute('data-slide', i);
        dotsContainer.appendChild(dot);
    }
}

/* ==========================================================================
   WRITE A REVIEW MODAL
   ========================================================================== */
function initReviewModal() {
    const modal = document.getElementById('review-modal');
    const openBtn = document.getElementById('open-review-modal');
    const closeBtn = document.getElementById('close-review-modal');
    const cancelBtn = document.getElementById('cancel-review');

    if (!modal || !openBtn || !closeBtn || !cancelBtn) return;

    openBtn.addEventListener('click', () => {
        modal.showModal();
    });

    const closeModal = () => {
        modal.close();
        document.getElementById('review-form').reset();
    };

    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);

    // Close when clicking backdrop outside dialog-content
    modal.addEventListener('click', (e) => {
        const rect = modal.getBoundingClientRect();
        const isInDialog = (
            rect.top <= e.clientY && 
            e.clientY <= rect.top + rect.height && 
            rect.left <= e.clientX && 
            e.clientX <= rect.left + rect.width
        );
        if (!isInDialog) {
            closeModal();
        }
    });
}

// Global submit handler for new reviews (called inline on form submit)
window.handleNewReviewSubmit = function() {
    const nameInput = document.getElementById('review-author-name');
    const contentInput = document.getElementById('review-content-text');
    const starsRadio = document.querySelector('input[name="rating"]:checked');
    const track = document.getElementById('carousel-track');
    const modal = document.getElementById('review-modal');

    if (!nameInput || !contentInput || !track || !modal) return;

    const authorName = nameInput.value.trim();
    const reviewText = contentInput.value.trim();
    const ratingValue = starsRadio ? parseInt(starsRadio.value) : 5;
    
    // Create star string
    let starsString = '';
    for (let i = 0; i < ratingValue; i++) {
        starsString += '★';
    }
    for (let i = ratingValue; i < 5; i++) {
        starsString += '☆';
    }

    // Create slide elements
    const newSlide = document.createElement('div');
    newSlide.classList.add('review-slide');
    
    newSlide.innerHTML = `
        <div class="review-card">
            <div class="review-stars">${starsString}</div>
            <p class="review-text">"${reviewText}"</p>
            <div class="review-author">
                <div class="author-info">
                    <h4>${authorName}</h4>
                    <span>Google Reviewer • Just now</span>
                </div>
            </div>
        </div>
    `;

    // Append to slide track
    track.appendChild(newSlide);
    
    // Update slides counts and track sizes
    updateSliderStatus();
    
    // Animate to the newly added review
    goToSlide(slidesCount - 1);

    // Close modal
    modal.close();
    document.getElementById('review-form').reset();
    
    alert('Thank you! Your review has been added to our testimonial slider.');
};

/* ==========================================================================
   HERO IMAGE SCROLL PARALLAX FALLBACK
   ========================================================================== */
function initHeroParallax() {
    const heroImage = document.querySelector('.hero-athlete-img');
    if (!heroImage) return;

    // Only apply JS parallax if browser doesn't support CSS scroll timelines
    const supportsScrollTimeline = CSS.supports('(animation-timeline: scroll()) or (animation-timeline: view())');
    
    if (!supportsScrollTimeline) {
        window.addEventListener('scroll', () => {
            const scrollPos = window.scrollY;
            if (scrollPos < 600) {
                // Translate down slowly relative to scroll position (12% speed multiplier)
                const translateVal = scrollPos * 0.12;
                heroImage.style.transform = `translateY(${translateVal}px)`;
            }
        });
    }
}

/* ==========================================================================
   DOTTED SURFACE WAVE BACKGROUND EFFECT (THREE.JS)
   ========================================================================== */
function initDottedSurface() {
    const container = document.getElementById('dotted-surface-container');
    if (!container || typeof THREE === 'undefined') return;

    const SEPARATION = 150;
    const AMOUNTX = 40;
    const AMOUNTY = 60;

    let scene, camera, renderer, particles;
    let count = 0;
    let animationId;

    // Initialize Three.js setup
    function init() {
        const width = container.clientWidth;
        const height = container.clientHeight;

        scene = new THREE.Scene();
        // Fog color matches cta-banner bg-dark (#080808)
        scene.fog = new THREE.Fog(0x080808, 2000, 10000);

        camera = new THREE.PerspectiveCamera(60, width / height, 1, 10000);
        camera.position.set(0, 355, 1220);

        renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(width, height);
        renderer.setClearColor(scene.fog.color, 0);

        // Clear container if any existing canvas exists (prevent duplication)
        container.innerHTML = '';
        container.appendChild(renderer.domElement);

        // Create particles positions and colors
        const positions = [];
        const colors = [];

        const geometry = new THREE.BufferGeometry();

        for (let ix = 0; ix < AMOUNTX; ix++) {
            for (let iy = 0; iy < AMOUNTY; iy++) {
                const x = ix * SEPARATION - (AMOUNTX * SEPARATION) / 2;
                const y = 0; // Will be animated
                const z = iy * SEPARATION - (AMOUNTY * SEPARATION) / 2;

                positions.push(x, y, z);
                
                // Gym theme dark mode dots: Neon green accent colors (0.62, 1.0, 0.0)
                colors.push(0.62, 1.0, 0.0);
            }
        }

        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

        // Material matches size: 8, transparent: true
        const material = new THREE.PointsMaterial({
            size: 8,
            vertexColors: true,
            transparent: true,
            opacity: 0.65,
            sizeAttenuation: true
        });

        particles = new THREE.Points(geometry, material);
        scene.add(particles);

        // Start animating
        animate();
    }

    // Animation Loop
    function animate() {
        animationId = requestAnimationFrame(animate);

        const positionAttribute = particles.geometry.attributes.position;
        const positions = positionAttribute.array;

        let i = 0;
        for (let ix = 0; ix < AMOUNTX; ix++) {
            for (let iy = 0; iy < AMOUNTY; iy++) {
                const index = i * 3;

                // Animate Y position with sine waves
                positions[index + 1] =
                    Math.sin((ix + count) * 0.3) * 50 +
                    Math.sin((iy + count) * 0.5) * 50;

                i++;
            }
        }

        positionAttribute.needsUpdate = true;

        renderer.render(scene, camera);
        count += 0.1;
    }

    // Resize Handler
    function handleResize() {
        if (!container || !renderer || !camera) return;
        const width = container.clientWidth;
        const height = container.clientHeight;

        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
    }

    window.addEventListener('resize', handleResize);

    // Initial load
    init();

    // Store cleanup listener for page lifecycle
    window.addEventListener('beforeunload', () => {
        window.removeEventListener('resize', handleResize);
        if (animationId) cancelAnimationFrame(animationId);
        if (particles) {
            particles.geometry.dispose();
            particles.material.dispose();
        }
        if (renderer) renderer.dispose();
    });
}

/* ==========================================================================
   INTERACTIVE FOLDER GALLERY GESTURES
   ========================================================================== */
function initFolderGallery() {
    const gallery = document.querySelector('.interactive-folder-gallery');
    const folderTrigger = document.getElementById('folder-front-trigger');
    const hintText = document.getElementById('gallery-hint-text');
    const cards = document.querySelectorAll('.photo-card');

    if (!gallery || !folderTrigger || !hintText) return;

    // Open folder on click
    folderTrigger.addEventListener('click', () => {
        gallery.classList.add('folder-open');
        hintText.textContent = 'Drag any photo down to close';
    });

    // Handle dragging on each card
    cards.forEach((card, idx) => {
        let startY = 0;
        let currentY = 0;
        let isDragging = false;
        
        // Define base transform styles for fanned out card (desktop reference)
        const baseTransforms = [
            'translateY(-130px) translateX(-300px) rotate(-12deg) scale(1.02)',
            'translateY(-130px) translateX(-200px) rotate(-8deg) scale(1.04)',
            'translateY(-135px) translateX(-100px) rotate(-4deg) scale(1.06)',
            'translateY(-140px) translateX(0) rotate(0deg) scale(1.1)',
            'translateY(-135px) translateX(100px) rotate(4deg) scale(1.06)',
            'translateY(-130px) translateX(200px) rotate(8deg) scale(1.04)',
            'translateY(-130px) translateX(300px) rotate(12deg) scale(1.02)'
        ];

        // Define mobile fanned out coordinates
        const baseTransformsMobile = [
            'translateY(-100px) translateX(-135px) rotate(-12deg) scale(0.92)',
            'translateY(-100px) translateX(-90px) rotate(-8deg) scale(0.94)',
            'translateY(-105px) translateX(-45px) rotate(-4deg) scale(0.96)',
            'translateY(-110px) translateX(0) rotate(0deg) scale(1.0)',
            'translateY(-105px) translateX(45px) rotate(4deg) scale(0.96)',
            'translateY(-100px) translateX(90px) rotate(8deg) scale(0.94)',
            'translateY(-100px) translateX(135px) rotate(12deg) scale(0.92)'
        ];

        function getActiveTransformBase() {
            return window.innerWidth <= 768 ? baseTransformsMobile[idx] : baseTransforms[idx];
        }

        function onStart(e) {
            if (!gallery.classList.contains('folder-open')) return;
            isDragging = true;
            startY = e.clientY || (e.touches ? e.touches[0].clientY : 0);
            card.style.transition = 'none'; // Disable transition during drag for 1:1 response
            card.style.zIndex = '150'; // Bring dragged card to front

            // Add mouse/touch movement listeners to window dynamically
            window.addEventListener('mousemove', onMove);
            window.addEventListener('mouseup', onEnd);
            window.addEventListener('touchmove', onMove, { passive: false });
            window.addEventListener('touchend', onEnd);
        }

        function onMove(e) {
            if (!isDragging) return;
            // Prevent page swipe scrolling on mobile while dragging cards
            if (e.cancelable) e.preventDefault();

            const clientY = e.clientY || (e.touches ? e.touches[0].clientY : 0);
            const deltaY = clientY - startY;

            if (deltaY > 0) {
                currentY = deltaY;
                // Add vertical drag offset on top of the fanned transform base
                card.style.transform = `${getActiveTransformBase()} translateY(${deltaY}px) rotate(${deltaY * 0.05}deg)`;
            }
        }

        function onEnd() {
            if (!isDragging) return;
            isDragging = false;
            card.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.8, 0.25, 1)';
            
            // Clean up window listeners immediately when gesture ends
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('mouseup', onEnd);
            window.removeEventListener('touchmove', onMove);
            window.removeEventListener('touchend', onEnd);

            if (currentY > 100) {
                // Dragged down past threshold -> CLOSE FOLDER
                gallery.classList.remove('folder-open');
                hintText.textContent = 'Click folder to explore photos';
                // Reset all card styles to default css stacks
                cards.forEach(c => {
                    c.style.transform = '';
                    c.style.zIndex = '';
                });
            } else {
                // Return to fanned out position
                card.style.transform = getActiveTransformBase();
                card.style.zIndex = '';
            }
            currentY = 0;
        }

        // Initialize start triggers only
        card.addEventListener('mousedown', onStart);
        card.addEventListener('touchstart', onStart, { passive: true });
    });
}
