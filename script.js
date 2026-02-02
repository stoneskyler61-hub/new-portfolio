document.addEventListener('DOMContentLoaded', () => {

    /* --- 1. AR/VR SCROLL EFFECT (Background Only) --- */
    const arVrElements = document.querySelectorAll('.ar-vr-element');
    window.addEventListener('scroll', () => {
        arVrElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            if(rect.top < window.innerHeight && rect.bottom > 0) {
                const screenCenter = window.innerHeight / 2;
                const elCenter = rect.top + rect.height / 2;
                const dist = (elCenter - screenCenter) * 0.05; 
                const rotX = Math.max(-10, Math.min(10, dist));
                el.style.transform = `perspective(1000px) rotateX(${rotX}deg)`;
            }
        });
    });

    /* --- 2. MAGNETIC BUTTONS --- */
    const magnetics = document.querySelectorAll('.magnetic');
    magnetics.forEach((btn) => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            const strength = btn.getAttribute('data-strength') || 30;
            btn.style.transform = `translate(${x/strength * 10}px, ${y/strength * 10}px)`;
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0)';
        });
    });

    /* --- 3. 3D TILT CARDS --- */
    const cards = document.querySelectorAll('.tilt-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / 25) * -1;
            const rotateY = (x - centerX) / 25;
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        });
    });

    /* --- 4. CANVAS STARS --- */
    const canvas = document.getElementById('star-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    let stars = [];
    for(let i=0; i<150; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 2,
            opacity: Math.random()
        });
    }
    function animateStars() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        stars.forEach(star => {
            ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            ctx.fill();
            star.opacity += (Math.random() - 0.5) * 0.05;
            if(star.opacity < 0) star.opacity = 0;
            if(star.opacity > 1) star.opacity = 1;
        });
        requestAnimationFrame(animateStars);
    }
    animateStars();

    /* --- 5. METEORS --- */
    const meteorContainer = document.getElementById('meteor-shower');
    for (let i = 0; i < 15; i++) {
        const meteor = document.createElement('div');
        meteor.classList.add('meteor');
        meteor.style.left = Math.random() * 100 + 'vw';
        meteor.style.top = Math.random() * 100 + 'vh';
        meteor.style.animationDuration = Math.random() * 3 + 3 + 's';
        meteor.style.animationDelay = Math.random() * 5 + 's';
        meteorContainer.appendChild(meteor);
    }

    /* --- 6. TYPEWRITER EFFECT --- */
    const typeText = document.getElementById('typewriter-text');
    const textToType = "INITIALIZING SECURE CONNECTION...";
    let typeIndex = 0;

    function typeWriter() {
        if (typeIndex < textToType.length) {
            typeText.innerHTML += textToType.charAt(typeIndex);
            typeIndex++;
            setTimeout(typeWriter, 50);
        }
    }
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && typeIndex === 0) {
                typeWriter();
            }
        });
    }, { threshold: 0.5 });
    
    const contactSection = document.querySelector('#contact');
    if(contactSection) observer.observe(contactSection);

    /* --- 7. FORM SUBMISSION --- */
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.querySelector('.cyber-btn');

    if(contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            submitBtn.classList.add('loading');
            setTimeout(() => {
                submitBtn.classList.remove('loading');
                submitBtn.classList.add('success');
                contactForm.reset();
                setTimeout(() => {
                    submitBtn.classList.remove('success');
                }, 3000);
            }, 2000);
        });
    }
});
