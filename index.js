/**
 * REEFIT GYM - INTERACTIVE JAVASCRIPT
 */

document.addEventListener('DOMContentLoaded', () => {
    // 0. Theme Toggle (Light & Dark Mode with Ripple Transition)
    const themeToggleBtn = document.getElementById('theme-toggle');
    const savedTheme = localStorage.getItem('reefit-theme');

    if (savedTheme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const targetTheme = currentTheme === 'light' ? 'dark' : 'light';

            // Smooth subtle icon spin feedback
            themeToggleBtn.style.transform = 'scale(0.9) rotate(180deg)';

            if (targetTheme === 'light') {
                document.documentElement.setAttribute('data-theme', 'light');
                localStorage.setItem('reefit-theme', 'light');
            } else {
                document.documentElement.removeAttribute('data-theme');
                localStorage.setItem('reefit-theme', 'dark');
            }

            setTimeout(() => {
                themeToggleBtn.style.transform = '';
            }, 400);
        });
    }

    // 1. Mobile Navigation Menu Toggle
    const mobileToggle = document.getElementById('mobile-nav-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
            mobileToggle.setAttribute('aria-expanded', !isExpanded);
            navMenu.classList.toggle('active');
        });

        // Close menu on link click
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                mobileToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // 2. Sticky Header Shadow on Scroll
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.8), 0 0 15px rgba(212, 175, 55, 0.2)';
        } else {
            header.style.boxShadow = 'none';
        }
    });

    // 3. Modal Overlay Logic
    const modalOverlay = document.getElementById('modal-overlay');
    const btnOpenModal = document.getElementById('btn-open-modal');
    const heroBtnModal = document.getElementById('hero-btn-modal');
    const btnTourModal = document.getElementById('btn-tour-modal');
    const modalClose = document.getElementById('modal-close');
    const modalPassForm = document.getElementById('modal-pass-form');
    const modalSuccess = document.getElementById('modal-success');
    const modalDoneBtn = document.getElementById('modal-done-btn');

    function openModal(defaultGoal = 'Body Transformation') {
        if (modalOverlay) {
            modalOverlay.classList.add('active');
            if (modalPassForm) modalPassForm.style.display = 'block';
            if (modalSuccess) modalSuccess.style.display = 'none';
            const goalSelect = document.getElementById('m-goal');
            if (goalSelect) goalSelect.value = defaultGoal;
        }
    }

    function closeModal() {
        if (modalOverlay) {
            modalOverlay.classList.remove('active');
        }
    }

    if (btnOpenModal) btnOpenModal.addEventListener('click', () => openModal());
    if (heroBtnModal) heroBtnModal.addEventListener('click', () => openModal());
    if (btnTourModal) btnTourModal.addEventListener('click', () => openModal('Live Gym Tour'));
    if (modalClose) modalClose.addEventListener('click', closeModal);

    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) closeModal();
        });
    }

    if (modalPassForm) {
        modalPassForm.addEventListener('submit', (e) => {
            e.preventDefault();
            modalPassForm.style.display = 'none';
            if (modalSuccess) modalSuccess.style.display = 'block';
        });
    }

    if (modalDoneBtn) {
        modalDoneBtn.addEventListener('click', closeModal);
    }

    // 4. Plan Selection Trigger Modal
    document.querySelectorAll('.btn-plan').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const planName = e.target.getAttribute('data-plan') || 'Membership Plan';
            openModal(`Plan Enrollment: ${planName}`);
        });
    });

    // 5. Section Contact Form
    const freePassForm = document.getElementById('free-pass-form');
    if (freePassForm) {
        freePassForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('form-name').value;
            alert(`Thank you, ${name}! Your Free Pass at Reefit Gym (Sector 46) has been reserved. Our team will contact you on your mobile number shortly!`);
            freePassForm.reset();
        });
    }

    // 6. Interactive BMI Calculator
    const btnCalc = document.getElementById('btn-calculate-bmi');
    const calcWeight = document.getElementById('calc-weight');
    const calcHeight = document.getElementById('calc-height');
    const calcResult = document.getElementById('calc-result');
    const resBmiVal = document.getElementById('res-bmi-val');
    const resStatusBadge = document.getElementById('res-status-badge');
    const resAdvice = document.getElementById('res-advice');

    if (btnCalc && calcWeight && calcHeight && calcResult) {
        btnCalc.addEventListener('click', () => {
            const weight = parseFloat(calcWeight.value);
            const heightCm = parseFloat(calcHeight.value);

            if (!weight || !heightCm || heightCm <= 0 || weight <= 0) {
                alert('Please enter valid weight and height values.');
                return;
            }

            const heightM = heightCm / 100;
            const bmi = (weight / (heightM * heightM)).toFixed(1);

            resBmiVal.textContent = bmi;
            calcResult.style.display = 'block';

            let status = 'Normal Weight';
            let advice = 'You have a healthy body weight! Ashish Sir recommends focus on lean muscle building and progressive overload training at Reefit Gym.';
            let badgeBg = 'rgba(74, 222, 128, 0.2)';

            if (bmi < 18.5) {
                status = 'Underweight';
                advice = 'Ashish Sir recommends a targeted mass gain program with high-protein nutrition and heavy compound lifting to build dense muscle.';
                badgeBg = 'rgba(250, 204, 21, 0.2)';
            } else if (bmi >= 25 && bmi < 29.9) {
                status = 'Overweight';
                advice = 'Our Body Transformation Protocol at Reefit Gym will help you burn fat while retaining strength through high-intensity resistance training.';
                badgeBg = 'rgba(251, 146, 60, 0.2)';
            } else if (bmi >= 30) {
                status = 'Obese';
                advice = 'Personalized 1-on-1 coaching with Mr. Vishal or Ashish Sir is highly recommended to safely start your weight-loss transformation journey.';
                badgeBg = 'rgba(248, 113, 113, 0.2)';
            }

            resStatusBadge.textContent = status;
            resStatusBadge.style.background = badgeBg;
            resAdvice.textContent = advice;
        });
    }

    // 7. Google Reviews Filter Chips
    const filterChips = document.querySelectorAll('.filter-chip');
    const reviewCards = document.querySelectorAll('.review-card');

    filterChips.forEach(chip => {
        chip.addEventListener('click', () => {
            filterChips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');

            const filter = chip.getAttribute('data-filter');

            reviewCards.forEach(card => {
                const categories = card.getAttribute('data-category') || '';
                if (filter === 'all' || categories.includes(filter)) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // 8. Premium Smooth Scroll Reveal (IntersectionObserver)
    const revealTargets = document.querySelectorAll('.section-header, .glass-card, .plan-card, .review-card, .trainer-card, .about-text, .about-visual, .timing-row, .google-business-bar');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-revealed');
            }
        });
    }, {
        root: null,
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    });

    revealTargets.forEach((el) => {
        el.classList.add('reveal-on-scroll');
        revealObserver.observe(el);
    });

    // Stagger grid child cards smoothly
    document.querySelectorAll('.grid, .pricing-grid, .reviews-grid').forEach(grid => {
        const children = grid.children;
        Array.from(children).forEach((child, index) => {
            if (child.classList.contains('reveal-on-scroll')) {
                const delayClass = `reveal-delay-${(index % 4) + 1}`;
                child.classList.add(delayClass);
            }
        });
    });

    // 9. Smooth Anchor Link Navigation Scrolling (Header Offset Aware)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#' || targetId === '') return;
            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                e.preventDefault();
                const headerOffset = 85;
                const elementPosition = targetEl.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    console.log('Reefit Gym Gold website scripts & scroll animations loaded successfully!');
});
