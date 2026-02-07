document.addEventListener('DOMContentLoaded', () => {

    /* --- 1. AR/VR SCROLL EFFECT (Background Only) --- */
    const arVrElements = document.querySelectorAll('.ar-vr-element');
    window.addEventListener('scroll', () => {
        // Disable on small screens for performance and to prevent overflow
        if (window.innerWidth < 768) return;

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
    // Only active on non-touch devices
    if (window.matchMedia("(hover: hover)").matches) {
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
    }

    /* --- 3. 3D TILT CARDS --- */
    // Only active on non-touch devices
    if (window.matchMedia("(hover: hover)").matches) {
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
    }

    /* --- 4. CANVAS STARS --- */
    const canvas = document.getElementById('star-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        
        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

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
    }

    /* --- 5. METEORS --- */
    const meteorContainer = document.getElementById('meteor-shower');
    if(meteorContainer) {
        for (let i = 0; i < 15; i++) {
            const meteor = document.createElement('div');
            meteor.classList.add('meteor');
            meteor.style.left = Math.random() * 100 + 'vw';
            meteor.style.top = Math.random() * 100 + 'vh';
            meteor.style.animationDuration = Math.random() * 3 + 3 + 's';
            meteor.style.animationDelay = Math.random() * 5 + 's';
            meteorContainer.appendChild(meteor);
        }
    }

    /* --- 6. TYPEWRITER EFFECT --- */
    const typeText = document.getElementById('typewriter-text');
    const textToType = "INITIALIZING SECURE CONNECTION...";
    let typeIndex = 0;

    function typeWriter() {
        if (typeText && typeIndex < textToType.length) {
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

    /* --- 7. FORM SUBMISSION (INTEGRATED WITH FORMSPREE) --- */
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.querySelector('.cyber-btn');

    if(contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Prevent standard redirect
            
            if(submitBtn) {
                // 1. Activate Loading Animation
                submitBtn.classList.add('loading');

                // 2. Gather Data
                const formData = new FormData(contactForm);

                try {
                    // 3. Send to Formspree via AJAX
                    const response = await fetch(contactForm.action, {
                        method: 'POST',
                        body: formData,
                        headers: {
                            'Accept': 'application/json'
                        }
                    });

                    // 4. Handle Response
                    if (response.ok) {
                        // Success: Trigger the "LINKED" animation
                        submitBtn.classList.remove('loading');
                        submitBtn.classList.add('success');
                        contactForm.reset();
                        
                        // Reset button state after 3 seconds
                        setTimeout(() => {
                            submitBtn.classList.remove('success');
                        }, 3000);
                    } else {
                        // Error from Formspree
                        const data = await response.json();
                        if (Object.hasOwn(data, 'errors')) {
                            alert(data["errors"].map(error => error["message"]).join(", "));
                        } else {
                            alert("Transmission Failed. Please check your data and try again.");
                        }
                        submitBtn.classList.remove('loading');
                    }
                } catch (error) {
                    // Network Error
                    alert("Network Error. Connection lost.");
                    submitBtn.classList.remove('loading');
                }
            }
        });
    }

    /* --- 8. CINEMATIC BLINK (Clean Fill, No Border/Glow) --- */
    const footerText = document.querySelector('.footer-cta');
    if(footerText) {
        
        const triggerBurst = () => {
            // Randomly choose 2 or 3 blinks for this sequence
            let totalBlinks = Math.floor(Math.random() * 2) + 2; 
            let blinkCount = 0;

            const performBlink = () => {
                // 1. Turn ON (Apply Color, Remove Border/Shadow)
                footerText.style.color = '#CBACF9';
                footerText.style.webkitTextStroke = '0px transparent'; // Remove the white border
                footerText.style.textShadow = 'none'; // Remove the glow
                
                // 2. Stay ON for longer (150ms to 300ms)
                setTimeout(() => {
                    
                    // 3. Turn OFF (Revert to default CSS)
                    footerText.style.color = '';
                    footerText.style.webkitTextStroke = '';
                    footerText.style.textShadow = '';

                    blinkCount++;

                    if (blinkCount < totalBlinks) {
                        // Wait 100ms to 200ms before the next blink in this burst
                        setTimeout(performBlink, Math.random() * 100 + 100);
                    } else {
                        // Burst finished. Wait 3 to 5 seconds before starting the entire cycle again
                        setTimeout(triggerBurst, Math.random() * 2000 + 3000);
                    }

                }, Math.random() * 150 + 150); // ON duration
            };
            
            performBlink();
        };

        // Start the effect
        setTimeout(triggerBurst, 2000);
    }

});
