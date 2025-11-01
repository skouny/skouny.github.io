// Navigation Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

function toggleMenu() {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');

    // Update ARIA attribute for accessibility
    const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
    hamburger.setAttribute('aria-expanded', !isExpanded);
}

hamburger.addEventListener('click', toggleMenu);

// Close menu when clicking on a nav link
const navLinks = document.querySelectorAll('.nav-menu a');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (navMenu.classList.contains('active')) {
            toggleMenu();
        }
    });
});

// Smooth Scrolling for Navigation Links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);

        if (targetSection) {
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });

            // Set focus to the section for accessibility
            targetSection.setAttribute('tabindex', '-1');
            targetSection.focus();
        }
    });
});

// Project Filter Functionality
const projectCards = document.querySelectorAll('.project-card');
const filterButtons = document.querySelectorAll('.filter-btn');

function filterProjects(category) {
    projectCards.forEach(card => {
        const tags = Array.from(card.querySelectorAll('.project-tags span'))
            .map(tag => tag.textContent.toLowerCase());

        let shouldShow = false;

        if (category === 'all') {
            shouldShow = true;
        } else if (category === 'cloud') {
            // Show if has cloud-related tags
            shouldShow = tags.some(tag =>
                tag === 'cloud' ||
                tag === 'firebase' ||
                tag === 'gcp' ||
                tag.includes('cloud')
            );
        } else {
            // Check for exact match
            shouldShow = tags.includes(category.toLowerCase());
        }

        if (shouldShow) {
            card.style.display = 'block';
            card.style.animation = 'fadeIn 0.5s ease-in';
        } else {
            card.style.display = 'none';
        }
    });
}

// Add click event listeners to filter buttons
filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));

        // Add active class to clicked button
        button.classList.add('active');

        // Get filter category and filter projects
        const filterCategory = button.getAttribute('data-filter');
        filterProjects(filterCategory);

        if (DEBUG) {
            console.log('Filter applied:', filterCategory);
        }
    });
});

// Add CSS animation for fade in effect
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// Lightbox functionality for project images
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.querySelector('.lightbox-image');
const lightboxClose = document.querySelector('.lightbox-close');
const projectImages = document.querySelectorAll('.project-image');

function openLightbox(imageSrc, imageAlt) {
    lightbox.classList.add('active');
    lightboxImage.src = imageSrc;
    lightboxImage.alt = imageAlt;
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

function closeLightbox() {
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = 'auto'; // Restore scrolling
}

projectImages.forEach((image, index) => {
    image.addEventListener('click', () => {
        // Since we don't have actual images, we'll use a placeholder
        const imageSrc = `https://via.placeholder.com/800x600/2563eb/ffffff?text=Project+${index + 1}`;
        const imageAlt = image.getAttribute('aria-label') || `Project ${index + 1}`;
        openLightbox(imageSrc, imageAlt);
    });

    // Add keyboard accessibility
    image.setAttribute('tabindex', '0');
    image.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            const imageSrc = `https://via.placeholder.com/800x600/2563eb/ffffff?text=Project+${index + 1}`;
            const imageAlt = image.getAttribute('aria-label') || `Project ${index + 1}`;
            openLightbox(imageSrc, imageAlt);
        }
    });
});

lightboxClose.addEventListener('click', closeLightbox);

// Close lightbox on background click
lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        closeLightbox();
    }
});

// Close lightbox with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        closeLightbox();
    }
});

// Success Modal
const successModal = document.getElementById('successModal');
const successModalClose = document.querySelector('.success-modal-close');

function showSuccessModal() {
    successModal.classList.add('active');
    successModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
}

function closeSuccessModal() {
    successModal.classList.remove('active');
    successModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = 'auto';
}

successModalClose.addEventListener('click', closeSuccessModal);

// Close success modal on background click
successModal.addEventListener('click', (e) => {
    if (e.target === successModal) {
        closeSuccessModal();
    }
});

// Close success modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && successModal.classList.contains('active')) {
        closeSuccessModal();
    }
});

// Form Validation
const contactForm = document.querySelector('.contact-form');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const messageInput = document.getElementById('message');

function showError(input, message) {
    const formGroup = input.parentElement;
    const errorMessage = formGroup.querySelector('.error-message');

    input.classList.add('error');
    errorMessage.textContent = message;
    errorMessage.classList.add('active');
}

function clearError(input) {
    const formGroup = input.parentElement;
    const errorMessage = formGroup.querySelector('.error-message');

    input.classList.remove('error');
    errorMessage.textContent = '';
    errorMessage.classList.remove('active');
}

function validateName(name) {
    if (name.trim() === '') {
        return 'Name is required';
    }
    if (name.trim().length < 2) {
        return 'Name must be at least 2 characters';
    }
    return null;
}

function validateEmail(email) {
    if (email.trim() === '') {
        return 'Email is required';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return 'Please enter a valid email address';
    }
    return null;
}

function validateMessage(message) {
    if (message.trim() === '') {
        return 'Message is required';
    }
    if (message.trim().length < 10) {
        return 'Message must be at least 10 characters';
    }
    return null;
}

// Real-time validation
nameInput.addEventListener('blur', () => {
    const error = validateName(nameInput.value);
    if (error) {
        showError(nameInput, error);
    } else {
        clearError(nameInput);
    }
});

nameInput.addEventListener('input', () => {
    if (nameInput.classList.contains('error')) {
        const error = validateName(nameInput.value);
        if (!error) {
            clearError(nameInput);
        }
    }
});

emailInput.addEventListener('blur', () => {
    const error = validateEmail(emailInput.value);
    if (error) {
        showError(emailInput, error);
    } else {
        clearError(emailInput);
    }
});

emailInput.addEventListener('input', () => {
    if (emailInput.classList.contains('error')) {
        const error = validateEmail(emailInput.value);
        if (!error) {
            clearError(emailInput);
        }
    }
});

messageInput.addEventListener('blur', () => {
    const error = validateMessage(messageInput.value);
    if (error) {
        showError(messageInput, error);
    } else {
        clearError(messageInput);
    }
});

messageInput.addEventListener('input', () => {
    if (messageInput.classList.contains('error')) {
        const error = validateMessage(messageInput.value);
        if (!error) {
            clearError(messageInput);
        }
    }
});

// Form submission
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Clear all previous errors
    clearError(nameInput);
    clearError(emailInput);
    clearError(messageInput);

    // Validate all fields
    const nameError = validateName(nameInput.value);
    const emailError = validateEmail(emailInput.value);
    const messageError = validateMessage(messageInput.value);

    let isValid = true;

    if (nameError) {
        showError(nameInput, nameError);
        isValid = false;
    }

    if (emailError) {
        showError(emailInput, emailError);
        isValid = false;
    }

    if (messageError) {
        showError(messageInput, messageError);
        isValid = false;
    }
    if (isValid) {
        // Form is valid, show success message
        console.log('Form submitted successfully!');
        console.log('Name:', nameInput.value);
        console.log('Email:', emailInput.value);
        console.log('Subject:', document.getElementById('subject').value);
        console.log('Message:', messageInput.value);

        // Show success modal instead of alert
        showSuccessModal();

        // Reset form
        contactForm.reset();

        // Auto-close modal after 5 seconds
        setTimeout(() => {
            if (successModal.classList.contains('active')) {
                closeSuccessModal();
            }
        }, 5000);
    } else {
        // Focus on first error field
        if (nameError) {
            nameInput.focus();
        } else if (emailError) {
            emailInput.focus();
        } else if (messageError) {
            messageInput.focus();
        }
    }
});

// Scroll to Top functionality
const scrollToTopBtn = document.getElementById('scrollToTop');

window.addEventListener('scroll', () => {
    const scrollPosition = window.scrollY;
    const header = document.querySelector('header');

    // Update header shadow
    if (scrollPosition > 100) {
        header.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
    } else {
        header.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
    }

    // Show/hide scroll to top button
    if (scrollPosition > 300) {
        scrollToTopBtn.classList.add('visible');
    } else {
        scrollToTopBtn.classList.remove('visible');
    }
});

// Scroll to top when button is clicked
scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Keyboard accessibility for scroll to top button
scrollToTopBtn.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
});

// Add active state to navigation based on scroll position
const sections = document.querySelectorAll('section[id]');

function highlightNavigation() {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-menu a[href="#${sectionId}"]`);

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLink?.classList.add('active');
        } else {
            navLink?.classList.remove('active');
        }
    });
}

window.addEventListener('scroll', highlightNavigation);

// Add animation on scroll for project cards
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '0';
            entry.target.style.transform = 'translateY(30px)';

            setTimeout(() => {
                entry.target.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, 100);

            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

projectCards.forEach(card => {
    observer.observe(card);
});

// Debug mode - log events to console
const DEBUG = true;

if (DEBUG) {
    console.log('%c Portfolio Site Loaded Successfully! ', 'background: #2563eb; color: white; padding: 5px 10px; border-radius: 5px; font-weight: bold;');
    console.log('📊 Site Statistics:');
    console.log('  - Navigation links:', navLinks.length);
    console.log('  - Project cards:', projectCards.length);
    console.log('  - Filter buttons:', filterButtons.length);
    console.log('✅ Features enabled:');
    console.log('  - Form validation');
    console.log('  - Project filtering');
    console.log('  - Lightbox gallery');
    console.log('  - Smooth scrolling');
    console.log('  - Scroll to top');
    console.log('  - Success modal');
}

// Handle browser back/forward buttons
window.addEventListener('popstate', () => {
    const hash = window.location.hash;
    if (hash) {
        const target = document.querySelector(hash);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    }
});

// Performance monitoring
window.addEventListener('load', () => {
    if (DEBUG) {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        const domReady = performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart;

        console.log('%c Page Fully Loaded ', 'background: #10b981; color: white; padding: 5px 10px; border-radius: 5px; font-weight: bold;');
        console.log('⚡ Performance Metrics:');
        console.log('  - Total Load Time:', loadTime + 'ms');
        console.log('  - DOM Ready Time:', domReady + 'ms');
        console.log('  - Resources Loaded:', performance.getEntriesByType('resource').length);
    }

    // Add entrance animations to sections
    document.querySelectorAll('section').forEach((section, index) => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';

        setTimeout(() => {
            section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
        }, index * 100);
    });
});

// Error handling for better debugging
window.addEventListener('error', (e) => {
    if (DEBUG) {
        console.error('%c JavaScript Error Detected ', 'background: #ef4444; color: white; padding: 5px 10px; border-radius: 5px; font-weight: bold;');
        console.error('Error:', e.message);
        console.error('File:', e.filename);
        console.error('Line:', e.lineno);
    }
});

// Add keyboard navigation hints
document.addEventListener('DOMContentLoaded', () => {
    if (DEBUG) {
        console.log('%c Keyboard Shortcuts ', 'background: #8b5cf6; color: white; padding: 5px 10px; border-radius: 5px; font-weight: bold;');
        console.log('  - Tab: Navigate through interactive elements');
        console.log('  - Escape: Close modals and lightbox');
        console.log('  - Enter/Space: Activate buttons and links');
    }
});
