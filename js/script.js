// Page Loader
window.addEventListener('load', function() {
    const loader = document.getElementById('pageLoader');
    setTimeout(() => {
        loader.classList.add('hidden');
        document.body.style.overflow = 'visible';

        // Trigger entrance animations
        setTimeout(() => {
            const heroElements = document.querySelectorAll('.hero-title, .hero-subtitle, .hero-buttons');
            heroElements.forEach((el, index) => {
                el.style.animation = `fadeInUp 0.8s ease-out ${index * 0.2}s both`;
            });
        }, 300);
    }, 1500);
});

// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle mobile menu
    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }
    });
});

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.offsetTop;
            const offsetPosition = elementPosition - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Enhanced Header Effects on Scroll
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    const scrollY = window.scrollY;

    if (scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }

    // Add parallax effect to hero
    const hero = document.querySelector('.hero');
    if (hero && scrollY < hero.offsetHeight) {
        hero.style.transform = `translateY(${scrollY * 0.3}px)`;
    }
});

// Telegram Bot Configuration
const TELEGRAM_CONFIG = {
    botToken: '8472996468:AAHZkSXe7_paEYxTFJxw1vKP9VjR-dcu3bY', // Replace with your actual bot token
    chatId: '-1002878130463'      // Replace with your actual chat ID
};

// Contact Form Handling
document.getElementById('contactForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    // Get form data
    const formData = new FormData(this);
    const name = formData.get('name');
    const email = formData.get('email');
    const phone = formData.get('phone') || 'Not provided';
    const service = formData.get('service');
    const message = formData.get('message');

    // Basic validation
    if (!name || !email || !service || !message) {
        showNotification('Please fill in all required fields.', 'error');
        return;
    }

    if (!isValidEmail(email)) {
        showNotification('Please enter a valid email address.', 'error');
        return;
    }

    // Show loading state
    const submitButton = this.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;

    try {
        // Send to Telegram
        await sendToTelegram(name, email, phone, service, message);
        showNotification('✅ Message sent successfully! We will contact you within 24 hours.', 'success');
        this.reset();
    } catch (error) {
        console.error('Error sending message:', error);

        // If Telegram is not configured, show alternative contact methods
        if (error.message.includes('configuration not set')) {
            showNotification('📧 Please contact us directly at blueriverbusinessgroup@gmail.com or call +251 97 055 5566', 'info');
        } else {
            showNotification('⚠️ Message could not be sent. Please contact us directly at blueriverbusinessgroup@gmail.com', 'error');
        }
    } finally {
        // Reset button state
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }
});

// Function to send message to Telegram
async function sendToTelegram(name, email, phone, service, message) {
    // Check if Telegram config is set
    if (TELEGRAM_CONFIG.botToken === 'YOUR_BOT_TOKEN_HERE' || TELEGRAM_CONFIG.chatId === 'YOUR_CHAT_ID_HERE') {
        throw new Error('Telegram configuration not set');
    }

    // Format message for Telegram
    const telegramMessage = `
🚛 *New Inquiry - Blue River Business Group*

👤 *Name:* ${name}
📧 *Email:* ${email}
📱 *Phone:* ${phone}
🔧 *Service:* ${service}

💬 *Message:*
${message}

⏰ *Time:* ${new Date().toLocaleString()}
    `.trim();

    // Send to Telegram Bot API
    const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_CONFIG.botToken}/sendMessage`;

    const response = await fetch(telegramUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            chat_id: TELEGRAM_CONFIG.chatId,
            text: telegramMessage,
            parse_mode: 'Markdown'
        })
    });

    if (!response.ok) {
        throw new Error(`Telegram API error: ${response.status}`);
    }

    return response.json();
}

// Email validation function
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification system
function showNotification(message, type) {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles
    let backgroundColor;
    switch(type) {
        case 'success':
            backgroundColor = '#10B981';
            break;
        case 'error':
            backgroundColor = '#EF4444';
            break;
        case 'info':
            backgroundColor = '#3B82F6';
            break;
        default:
            backgroundColor = '#6B7280';
    }

    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${backgroundColor};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 450px;
        line-height: 1.4;
    `;
    
    notification.querySelector('.notification-content').style.cssText = `
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
    `;
    
    notification.querySelector('.notification-close').style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0;
        line-height: 1;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Close button functionality
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Advanced Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');

            // Add staggered animation for grid items
            if (entry.target.parentElement.classList.contains('services-grid') ||
                entry.target.parentElement.classList.contains('values-grid') ||
                entry.target.parentElement.classList.contains('why-us-grid')) {

                const siblings = Array.from(entry.target.parentElement.children);
                const index = siblings.indexOf(entry.target);
                entry.target.style.animationDelay = `${index * 0.1}s`;
            }
        }
    });
}, observerOptions);

// Parallax effect for hero section
function addParallaxEffect() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        const heroHeight = hero.offsetHeight;

        if (scrolled < heroHeight) {
            const parallaxSpeed = scrolled * 0.5;
            hero.style.transform = `translateY(${parallaxSpeed}px)`;
        }
    });
}

// Smooth reveal animations
function addRevealAnimations() {
    const revealElements = document.querySelectorAll('.section-title, .section-subtitle');

    revealElements.forEach(element => {
        observer.observe(element);
    });
}

// Counter animation for stats
function animateCounters() {
    const counters = document.querySelectorAll('.stat h3, .stat-number');

    counters.forEach(counter => {
        const updateCounter = () => {
            const target = counter.getAttribute('data-target');
            if (!target) return;

            const count = +counter.innerText.replace(/[^\d]/g, '');
            const targetNum = +target;
            const increment = targetNum / 100;

            if (count < targetNum) {
                const newCount = Math.ceil(count + increment);

                // Format based on original content
                if (counter.classList.contains('stat-number')) {
                    if (targetNum >= 1000) {
                        counter.innerText = newCount.toLocaleString() + '+';
                    } else {
                        counter.innerText = newCount + '+';
                    }
                } else {
                    const text = counter.getAttribute('data-original');
                    if (text && text.includes('24/7')) {
                        counter.innerText = '24/7';
                    } else if (text && text.includes('100%')) {
                        counter.innerText = newCount + '%';
                    }
                }

                setTimeout(updateCounter, 50);
            } else {
                // Final value
                if (counter.classList.contains('stat-number')) {
                    if (targetNum >= 1000) {
                        counter.innerText = targetNum.toLocaleString() + '+';
                    } else {
                        counter.innerText = targetNum + '+';
                    }
                } else {
                    const text = counter.getAttribute('data-original');
                    if (text && text.includes('24/7')) {
                        counter.innerText = '24/7';
                    } else if (text && text.includes('100%')) {
                        counter.innerText = targetNum + '%';
                    }
                }
            }
        };

        // Set data-target for different types of stats
        if (counter.classList.contains('stat-number')) {
            // These are the new client stats
            const target = counter.getAttribute('data-target');
            if (target) {
                counter.innerText = '0';

                // Create intersection observer for this counter
                const counterObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            updateCounter();
                            counterObserver.unobserve(entry.target);
                        }
                    });
                }, { threshold: 0.5 });

                counterObserver.observe(counter);
            }
        } else {
            // These are the hero stats
            const text = counter.textContent;
            if (text.includes('24/7')) {
                counter.setAttribute('data-target', '24');
                counter.setAttribute('data-original', text);
                counter.textContent = '0/7';
            } else if (text.includes('100%')) {
                counter.setAttribute('data-target', '100');
                counter.setAttribute('data-original', text);
                counter.textContent = '0%';
            }

            observer.observe(counter);
            counter.addEventListener('animationstart', updateCounter);
        }
    });
}

// Hero Background Slideshow
function initHeroSlideshow() {
    const slides = document.querySelectorAll('.hero-bg-slide');
    const indicators = document.querySelectorAll('.hero-indicator');
    let currentSlide = 0;
    let slideInterval;

    function goToSlide(slideIndex) {
        // Remove active classes
        slides[currentSlide].classList.remove('active');
        indicators[currentSlide].classList.remove('active');

        // Set new slide
        currentSlide = slideIndex;

        // Add active classes
        slides[currentSlide].classList.add('active');
        indicators[currentSlide].classList.add('active');
    }

    function nextSlide() {
        const nextIndex = (currentSlide + 1) % slides.length;
        goToSlide(nextIndex);
    }

    function startSlideshow() {
        slideInterval = setInterval(nextSlide, 7000);
    }

    function stopSlideshow() {
        clearInterval(slideInterval);
    }

    // Add click handlers to indicators
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            goToSlide(index);
            stopSlideshow();
            // Restart slideshow after manual selection
            setTimeout(startSlideshow, 10000);
        });
    });

    // Start automatic slideshow
    startSlideshow();
}

// Initialize all animations
document.addEventListener('DOMContentLoaded', function() {
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.service-card, .value-item, .why-us-item, .sector-item, .mission-vision-item, .contact-item, .transport-item, .client-logo-card');
    animateElements.forEach(el => {
        el.classList.add('loading');
        observer.observe(el);
    });

    // Initialize advanced animations
    addParallaxEffect();
    addRevealAnimations();
    animateCounters();
    initHeroSlideshow();

    // Add floating animation to hero elements
    setTimeout(() => {
        const heroElements = document.querySelectorAll('.hero-title, .hero-subtitle, .hero-buttons');
        heroElements.forEach((el, index) => {
            el.style.animation = `fadeInUp 0.8s ease-out ${index * 0.2}s both`;
        });
    }, 100);
});

// Add loading animation class
const style = document.createElement('style');
style.textContent = `
    .loading {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.6s ease;
    }
    
    .loading.fade-in-up {
        opacity: 1;
        transform: translateY(0);
    }
`;
document.head.appendChild(style);

// Counter animation for stats
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    function updateCounter() {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    }
    
    updateCounter();
}

// Initialize counter animations when stats section is visible
const statsObserver = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const counters = entry.target.querySelectorAll('.stat h3');
            counters.forEach(counter => {
                const text = counter.textContent;
                if (text.includes('24/7')) {
                    // Handle 24/7 text
                    return;
                } else if (text.includes('100%')) {
                    // Handle 100% text
                    return;
                } else if (text.includes('East Africa')) {
                    // Handle text
                    return;
                }
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const statsSection = document.querySelector('.hero-stats');
if (statsSection) {
    statsObserver.observe(statsSection);
}

// Lazy loading for images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => imageObserver.observe(img));
}

// Scroll to top functionality
window.addEventListener('scroll', function() {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    
    // Show/hide scroll to top button
    let scrollButton = document.querySelector('.scroll-to-top');
    if (!scrollButton && scrollTop > 300) {
        scrollButton = document.createElement('button');
        scrollButton.className = 'scroll-to-top';
        scrollButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
        scrollButton.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            background: #1E3A8A;
            color: white;
            border: none;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            transition: all 0.3s ease;
            z-index: 1000;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        
        scrollButton.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        
        scrollButton.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
        });
        
        scrollButton.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
        
        document.body.appendChild(scrollButton);
    } else if (scrollButton && scrollTop <= 300) {
        scrollButton.remove();
    }
});

// Auto-update copyright year
function updateCopyrightYear() {
    const currentYear = new Date().getFullYear();
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
        yearElement.textContent = currentYear;
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    updateCopyrightYear();
});

console.log('Blue River Business Group website loaded successfully!');
