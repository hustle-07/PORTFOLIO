/* =========================================================
   $50K AGENCY-TIER PORTFOLIO — SCRIPT
   Preloader / Lenis / GSAP / Custom Cursor / Canvas / Magnetic
   ========================================================= */

// ---- Wait for DOM ----
document.addEventListener('DOMContentLoaded', () => {

    // =============================================
    // 1. PRELOADER
    // =============================================
    const preloaderEl = document.getElementById('preloader');
    const preloaderNumber = document.getElementById('preloader-number');
    const preloaderBarFill = document.getElementById('preloader-bar-fill');

    let count = 0;
    const preloaderInterval = setInterval(() => {
        count += Math.floor(Math.random() * 3) + 1;
        if (count > 100) count = 100;
        preloaderNumber.textContent = count;
        preloaderBarFill.style.width = count + '%';
        if (count >= 100) {
            clearInterval(preloaderInterval);
            setTimeout(() => {
                gsap.to(preloaderEl, {
                    yPercent: -100,
                    duration: 1.2,
                    ease: 'power4.inOut',
                    onComplete: () => {
                        preloaderEl.style.display = 'none';
                        revealHero();
                    }
                });
            }, 400);
        }
    }, 30);

    // =============================================
    // 2. LENIS SMOOTH SCROLL
    // =============================================
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

    // Sync Lenis with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);

    // =============================================
    // 3. GSAP REGISTER
    // =============================================
    gsap.registerPlugin(ScrollTrigger);

    // =============================================
    // 4. CUSTOM CURSOR
    // =============================================
    const cursor = document.getElementById('cursor');
    const follower = document.getElementById('cursor-follower');
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let followerX = 0, followerY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateCursor() {
        // Cursor (fast)
        cursorX += (mouseX - cursorX) * 0.2;
        cursorY += (mouseY - cursorY) * 0.2;
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';

        // Follower (slow, trailing)
        followerX += (mouseX - followerX) * 0.08;
        followerY += (mouseY - followerY) * 0.08;
        follower.style.left = followerX + 'px';
        follower.style.top = followerY + 'px';

        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Cursor hover states
    const magneticElements = document.querySelectorAll('[data-magnetic]');
    magneticElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('active');
            follower.classList.add('active');
        });
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('active');
            follower.classList.remove('active');
        });
    });

    // =============================================
    // 5. MAGNETIC BUTTONS
    // =============================================
    magneticElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            gsap.to(el, {
                x: x * 0.3,
                y: y * 0.3,
                duration: 0.4,
                ease: 'power2.out'
            });
        });
        el.addEventListener('mouseleave', () => {
            gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.3)' });
        });
    });

    // =============================================
    // 6. HERO CANVAS (Fluid / Particle Background)
    // =============================================
    const canvas = document.getElementById('hero-canvas');
    const ctx = canvas.getContext('2d');

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle system
    const particles = [];
    const PARTICLE_COUNT = 80;

    class Particle {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5;
            this.opacity = Math.random() * 0.5 + 0.1;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            // Mouse interaction
            const dx = mouseX - this.x;
            const dy = mouseY - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 150) {
                this.x -= dx * 0.01;
                this.y -= dy * 0.01;
            }

            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 95, 31, ${this.opacity})`;
            ctx.fill();
        }
    }

    for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(new Particle());
    }

    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(255, 95, 31, ${0.08 * (1 - dist / 120)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
    }

    function animateCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        drawConnections();
        requestAnimationFrame(animateCanvas);
    }
    animateCanvas();

    // =============================================
    // 7. HERO REVEAL ANIMATION
    // =============================================
    function revealHero() {
        const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

        tl.to('.line-inner', {
            y: 0,
            duration: 1.4,
            stagger: 0.15,
        })
        .from('.hero-badge', {
            opacity: 0, y: 20,
            duration: 0.8,
        }, '-=0.8')
        .from('.hero-description', {
            opacity: 0, y: 30,
            duration: 0.8,
        }, '-=0.5')
        .from('.hero-scroll-indicator', {
            opacity: 0, x: -20,
            duration: 0.6,
        }, '-=0.4')
        .from('.hero-image', {
            scale: 1.3, opacity: 0,
            duration: 1.5,
            ease: 'power3.out'
        }, '-=1.2');
    }

    // =============================================
    // 8. ABOUT — WORD-BY-WORD REVEAL
    // =============================================
    const aboutHeading = document.querySelector('.about-heading');
    if (aboutHeading) {
        const text = aboutHeading.textContent;
        aboutHeading.innerHTML = text.split(' ').map(word =>
            `<span class="word">${word}</span>`
        ).join(' ');

        const words = aboutHeading.querySelectorAll('.word');

        ScrollTrigger.create({
            trigger: '#about',
            start: 'top 60%',
            end: 'bottom 40%',
            onUpdate: (self) => {
                const progress = self.progress;
                words.forEach((word, i) => {
                    const wordProgress = i / words.length;
                    if (wordProgress < progress) {
                        word.classList.add('active');
                    } else {
                        word.classList.remove('active');
                    }
                });
            }
        });
    }

    // =============================================
    // 9. STAT COUNTER ANIMATION
    // =============================================
    document.querySelectorAll('.stat-number').forEach(stat => {
        const target = parseInt(stat.getAttribute('data-count'));
        ScrollTrigger.create({
            trigger: stat,
            start: 'top 80%',
            once: true,
            onEnter: () => {
                gsap.to(stat, {
                    textContent: target,
                    duration: 2,
                    ease: 'power2.out',
                    snap: { textContent: 1 },
                    onUpdate: function() {
                        stat.textContent = Math.round(parseFloat(stat.textContent));
                    }
                });
            }
        });
    });

    // =============================================
    // 10. SERVICE ITEMS STAGGER
    // =============================================
    gsap.from('.service-item', {
        y: 60,
        opacity: 0,
        stagger: 0.15,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '#services',
            start: 'top 60%',
        }
    });

    // =============================================
    // 11. WORK ITEMS PARALLAX
    // =============================================
    document.querySelectorAll('.work-item').forEach((item, i) => {
        gsap.from(item, {
            y: 80,
            opacity: 0,
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: item,
                start: 'top 80%',
            }
        });

        // Image parallax
        const img = item.querySelector('.work-item-image img');
        if (img) {
            gsap.to(img, {
                yPercent: -10,
                ease: 'none',
                scrollTrigger: {
                    trigger: item,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1,
                }
            });
        }
    });

    // =============================================
    // 12. CTA REVEAL
    // =============================================
    ScrollTrigger.create({
        trigger: '#cta',
        start: 'top 60%',
        once: true,
        onEnter: () => {
            gsap.to('#cta .line-inner', {
                y: 0,
                duration: 1.2,
                stagger: 0.12,
                ease: 'power4.out'
            });
            gsap.from('.cta-button', {
                opacity: 0, y: 40,
                duration: 0.8,
                delay: 0.5,
                ease: 'power3.out'
            });
        }
    });

    // =============================================
    // 13. MARQUEE SPEED ON SCROLL
    // =============================================
    const marqueeContent = document.querySelector('.marquee-content');
    if (marqueeContent) {
        let scrollSpeed = 0;
        lenis.on('scroll', ({ velocity }) => {
            scrollSpeed = velocity;
            const skew = Math.min(Math.max(velocity * 0.5, -5), 5);
            gsap.to(marqueeContent, { skewX: skew, duration: 0.3 });
        });
    }

    // =============================================
    // 14. NAVBAR HIDE ON SCROLL DOWN
    // =============================================
    let lastScroll = 0;
    const navbar = document.getElementById('navbar');
    
    lenis.on('scroll', ({ scroll }) => {
        if (scroll > lastScroll && scroll > 100) {
            gsap.to(navbar, { y: -100, duration: 0.4, ease: 'power2.out' });
        } else {
            gsap.to(navbar, { y: 0, duration: 0.4, ease: 'power2.out' });
        }
        lastScroll = scroll;
    });

});
