// Custom Cursor
const cursor = document.querySelector('.cursor-glow');

document.addEventListener('mousemove', (e) => {
    cursor.style.transform = `translate(calc(${e.clientX}px - 50%), calc(${e.clientY}px - 50%))`;
});

// Interactive hover effect for links and buttons to expand cursor glow
const interactables = document.querySelectorAll('a, button, .project-card');

interactables.forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.style.background = 'radial-gradient(circle, rgba(255, 0, 85, 0.2) 0%, rgba(0,0,0,0) 70%)';
        cursor.style.width = '400px';
        cursor.style.height = '400px';
    });
    
    el.addEventListener('mouseleave', () => {
        cursor.style.background = 'radial-gradient(circle, rgba(0, 240, 255, 0.15) 0%, rgba(0,0,0,0) 70%)';
        cursor.style.width = '300px';
        cursor.style.height = '300px';
    });
});

// Intersection Observer for Scroll Animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-in-up').forEach(element => {
    observer.observe(element);
});

// Smooth Scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});
