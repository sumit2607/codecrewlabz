// DOM Elements
const navbar = document.querySelector('.navbar');
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');
const sections = document.querySelectorAll('section');
const faqItems = document.querySelectorAll('.faq-item');
const countdownElement = document.getElementById('countdown');
const slotsElement = document.getElementById('slots-left');
const themeToggle = document.getElementById('theme-toggle');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    startCountdown();
    initializeAnimations();
    checkTheme();
});

// Theme Toggle Logic
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        updateThemeIcon(isDark);
    });
}

function checkTheme() {
    const savedTheme = localStorage.getItem('theme');
    const isDark = savedTheme === 'dark';
    if (isDark) {
        document.body.classList.add('dark-mode');
    }
    updateThemeIcon(isDark);
}

function updateThemeIcon(isDark) {
    const icon = themeToggle.querySelector('i');
    if (icon) {
        if (isDark) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    }
}

// Sticky Navbar Effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile Menu Toggle
mobileMenuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    const icon = mobileMenuBtn.querySelector('i');
    if (navLinks.classList.contains('active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
    } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    }
});

// Close mobile menu when clicking a link
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        mobileMenuBtn.querySelector('i').classList.remove('fa-times');
        mobileMenuBtn.querySelector('i').classList.add('fa-bars');
    });
});

// FAQ Accordion
faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
        // Close other items
        faqItems.forEach(otherItem => {
            if (otherItem !== item) {
                const otherAnswer = otherItem.querySelector('.faq-answer');
                otherItem.classList.remove('active');
                otherAnswer.style.maxHeight = null;
            }
        });

        // Toggle current item
        const answer = item.querySelector('.faq-answer');
        item.classList.toggle('active');
        if (item.classList.contains('active')) {
            answer.style.maxHeight = answer.scrollHeight + "px";
        } else {
            answer.style.maxHeight = null;
        }
    });
});

// Countdown Timer Logic
function startCountdown() {
    // Set deadline to 5 hours from now for demo
    let time = 5 * 60 * 60; // seconds

    // Check local storage for persistent countdown
    const savedTime = localStorage.getItem('codecrew_timer');
    const savedTimestamp = localStorage.getItem('codecrew_timestamp');

    if (savedTime && savedTimestamp) {
        const elapsed = Math.floor((Date.now() - parseInt(savedTimestamp)) / 1000);
        time = parseInt(savedTime) - elapsed;
        if (time < 0) time = 5 * 60 * 60; // Reset if expired
    }

    const interval = setInterval(() => {
        const hours = Math.floor(time / 3600);
        const minutes = Math.floor((time % 3600) / 60);
        const seconds = time % 60;

        countdownElement.textContent = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;

        if (time > 0) {
            time--;
            // Save state
            localStorage.setItem('codecrew_timer', time);
            localStorage.setItem('codecrew_timestamp', Date.now());
        } else {
            // Reset loop
            time = 5 * 60 * 60;
        }
    }, 1000);
}

function pad(num) {
    return num.toString().padStart(2, '0');
}

// Slot Counter Animation (Fake Drop)
let slots = 7;
setInterval(() => {
    if (Math.random() > 0.7 && slots > 2) {
        slots--;
        slotsElement.style.transform = "scale(1.5)";
        slotsElement.style.color = "red";
        setTimeout(() => {
            slotsElement.textContent = slots;
            slotsElement.style.transform = "scale(1)";
            slotsElement.style.color = "inherit";
        }, 300);
    }
}, 15000 * Math.random() + 10000); // Randomly drop every 10-25 seconds

// Form Submission
document.getElementById('leadForm').addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const business = document.getElementById('business').value;
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;
    const type = document.getElementById('type').value;

    const btn = e.target.querySelector('button');
    const originalText = btn.textContent;

    btn.textContent = 'Redirecting to WhatsApp...';
    btn.disabled = true;

    // Construct WhatsApp Message
    const message = `Hello CodeCrewLabz, I want to secure my website slot for ₹9999 Only.%0a%0aName: ${name}%0aBusiness: ${business}%0aPhone: ${phone}%0aEmail: ${email}%0aType: ${type}`;

    const whatsappUrl = `https://wa.me/919076573857?text=${message}`;

    // Redirect after a short delay
    setTimeout(() => {
        window.open(whatsappUrl, '_blank');
        btn.textContent = originalText;
        btn.disabled = false;
        e.target.reset();
    }, 1000);
});

// Intersection Observer for Scroll Animations
function initializeAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.feature-card, .portfolio-card, .timeline-item, .pricing-card, .comparison-table-wrapper').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });

    // Add CSS class for animation via JS to keep CSS clean
    const style = document.createElement('style');
    style.innerHTML = `
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
}
