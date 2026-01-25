/* =====================================================
   NAVBAR LOG (DEBUG / OPTIONAL)
===================================================== */
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        console.log('Navigating:', link.textContent);
    });
});

/* =====================================================
   SCROLL REVEAL (NON-SLIDER SECTIONS ONLY)
===================================================== */
const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.15 });

document.querySelectorAll('.service-box, .blog-card').forEach(el => {
    revealObserver.observe(el);
});

/* =====================================================
   TESTIMONIALS SLIDER
===================================================== */
document.addEventListener('DOMContentLoaded', () => {
    initTestimonialSlider();
    initReviewSlider();
});

function initTestimonialSlider() {
    const track = document.querySelector('.testimonials-track');
    const cards = document.querySelectorAll('.testimonial-card');
    const slider = document.querySelector('.testimonials-slider');
    
    if (!track || cards.length <= 2) {
        console.log('Not enough testimonial cards for slider');
        return;
    }
    
    let index = 0;
    let autoSlideInterval;
    const totalCards = cards.length;
    
    function updateSlider() {
        const cardsPerView = window.innerWidth <= 900 ? 1 : 2;
        const gap = 30;
        const cardWidth = cards[0].offsetWidth + gap;
        
        // Calculate max index
        const maxIndex = Math.max(0, totalCards - cardsPerView);
        
        // Ensure index stays within bounds
        if (index > maxIndex) {
            index = 0;
        }
        
        const translateX = -index * cardWidth;
        track.style.transform = `translateX(${translateX}px)`;
    }
    
    function moveNext() {
        const cardsPerView = window.innerWidth <= 900 ? 1 : 2;
        const maxIndex = Math.max(0, totalCards - cardsPerView);
        
        index += cardsPerView;
        if (index > maxIndex) {
            index = 0;
        }
        
        updateSlider();
    }
    
    function startAutoSlide() {
        stopAutoSlide();
        autoSlideInterval = setInterval(moveNext, 4500);
    }
    
    function stopAutoSlide() {
        if (autoSlideInterval) {
            clearInterval(autoSlideInterval);
        }
    }
    
    // Initialize slider
    updateSlider();
    
    // Start auto-slide after delay
    setTimeout(() => {
        startAutoSlide();
    }, 1500);
    
    // Pause on hover
    slider?.addEventListener('mouseenter', stopAutoSlide);
    slider?.addEventListener('mouseleave', startAutoSlide);
    
    // Reset on resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            index = 0;
            updateSlider();
        }, 250);
    });
}

/* =====================================================
   REVIEWS SLIDER
===================================================== */
function initReviewSlider() {
    const track = document.querySelector('.reviews-track');
    const cards = document.querySelectorAll('.review-card');
    const slider = document.querySelector('.reviews-slider');
    
    if (!track || cards.length <= 2) {
        console.log('Not enough review cards for slider');
        return;
    }
    
    let index = 0;
    let autoSlideInterval;
    const totalCards = cards.length;
    
    function updateSlider() {
        const cardsPerView = window.innerWidth <= 900 ? 1 : 2;
        const gap = 25;
        const cardWidth = cards[0].offsetWidth + gap;
        
        // Calculate max index
        const maxIndex = Math.max(0, totalCards - cardsPerView);
        
        // Ensure index stays within bounds
        if (index > maxIndex) {
            index = 0;
        }
        
        const translateX = -index * cardWidth;
        track.style.transform = `translateX(${translateX}px)`;
    }
    
    function moveNext() {
        const cardsPerView = window.innerWidth <= 900 ? 1 : 2;
        const maxIndex = Math.max(0, totalCards - cardsPerView);
        
        index += cardsPerView;
        if (index > maxIndex) {
            index = 0;
        }
        
        updateSlider();
    }
    
    function startAutoSlide() {
        stopAutoSlide();
        autoSlideInterval = setInterval(moveNext, 5000);
    }
    
    function stopAutoSlide() {
        if (autoSlideInterval) {
            clearInterval(autoSlideInterval);
        }
    }
    
    // Initialize slider
    updateSlider();
    
    // Start auto-slide after delay
    setTimeout(() => {
        startAutoSlide();
    }, 2000);
    
    // Pause on hover
    slider?.addEventListener('mouseenter', stopAutoSlide);
    slider?.addEventListener('mouseleave', startAutoSlide);
    
    // Reset on resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            index = 0;
            updateSlider();
        }, 250);
    });
}

// Blog search (frontend only for now)
document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.querySelector(".search-input");

    if (searchInput) {
        searchInput.addEventListener("keyup", () => {
            console.log("Searching:", searchInput.value);
            // Later: debounce + backend search
        });
    }
});

/* ================= FLASH AUTO DISMISS ================= */

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".flash").forEach(flash => {

        const timer = setTimeout(() => {
            removeFlash(flash);
        }, 4000);

        flash.querySelector(".flash-close")?.addEventListener("click", () => {
            clearTimeout(timer);
            removeFlash(flash);
        });
    });
});

function removeFlash(flash) {
    flash.classList.add("fade-out");
    setTimeout(() => {
        flash.remove();
    }, 350);
}
