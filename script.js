// 1. Initialize Lenis for Smooth Scrolling
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

// Register GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// 2. Custom Cursor Logic
const cursor = document.querySelector('.cursor-glow');
const hoverElements = document.querySelectorAll('[data-cursor="hover"]');

document.addEventListener('mousemove', (e) => {
    gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1,
        ease: "power2.out"
    });
});

hoverElements.forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
});

// 3. Hero Video Scrubbing Logic (Simulated with scaling/opacity since we don't have real video yet)
// In a real scenario, you'd use GSAP to scrub video.currentTime
gsap.to('.hero-bg-video-container', {
    scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true,
    },
    yPercent: 30,
    opacity: 0.2
});

// 4. Mission & Story Text Reveal (Split text style animation)
// Wrap words in span for staggered animation
const revealText = document.querySelector('.reveal-text');
const textContent = revealText.innerHTML;
// Simple split by space for demonstration without extra libraries
const splitWords = textContent.split(' ').map(word => `<span class="word">${word}</span>`).join(' ');
revealText.innerHTML = splitWords;

gsap.fromTo('.reveal-text .word', 
    { opacity: 0.1, y: 20 },
    {
        opacity: 1, 
        y: 0,
        stagger: 0.05,
        scrollTrigger: {
            trigger: '.story',
            start: 'top 70%',
            end: 'bottom 50%',
            scrub: 1,
        }
    }
);

// 5. Horizontal Scroll for Featured Work
const horizontalSection = document.querySelector('.featured-work');
const scrollContainer = document.querySelector('.horizontal-scroll-container');

// Only apply horizontal scroll on desktop
if (window.innerWidth > 768) {
    let scrollWidth = scrollContainer.scrollWidth - window.innerWidth;
    
    gsap.to(scrollContainer, {
        x: -scrollWidth,
        ease: "none",
        scrollTrigger: {
            trigger: horizontalSection,
            start: 'top top',
            end: () => `+=${scrollWidth}`,
            scrub: 1,
            pin: true,
            anticipatePin: 1
        }
    });
}

// 6. Pillars Card Staggered Entrance
gsap.from('.pillar-card', {
    y: 100,
    opacity: 0,
    duration: 1,
    stagger: 0.2,
    ease: "power3.out",
    scrollTrigger: {
        trigger: '.pillars',
        start: 'top 60%',
    }
});
