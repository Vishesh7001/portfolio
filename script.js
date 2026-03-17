// Ensure the page always loads at the top, ignoring previous scroll position or hashes
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);
if (window.location.hash) {
    window.history.replaceState('', document.title, window.location.pathname + window.location.search);
}

document.addEventListener('DOMContentLoaded', () => {

    // Mobile Navigation Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navbar = document.querySelector('.navbar');

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        document.body.classList.toggle('nav-active');
    });

    // Close mobile menu when a link is clicked
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            document.body.classList.remove('nav-active');
        });
    });

    // Navbar Scroll Effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Active Link Highlight on Scroll
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href').includes(current)) {
                item.classList.add('active');
            }
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
                // Optional: Stop observing once animated
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Select elements to animate
    const animatedElements = document.querySelectorAll('.fade-up, .fade-in');
    
    animatedElements.forEach(el => {
        observer.observe(el);
    });

    // EmailJS Form Handling
    // Initialize EmailJS with the provided public key
    emailjs.init("Ao8MGCaZuPqspk4F_");

    const contactForm = document.getElementById('contact-form');
    const submitBtnText = document.getElementById('submit-btn-text');
    const submitBtn = document.querySelector('.submit-btn');
    let isSubmitting = false;

    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();

            if (isSubmitting) return;
            isSubmitting = true;

            // Store original text and show loading state
            const originalText = submitBtnText.innerText;
            submitBtnText.innerText = "Sending...";
            submitBtn.style.opacity = "0.7";
            submitBtn.style.pointerEvents = "none";

            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;

            // Prepare template parameters
            // By default, EmailJS creates variables like: user_name, user_email, message
            const templateParams = {
                user_name: name,
                user_email: email,
                message: message,
                from_name: name, // keeping these just in case they used the other common defaults
                reply_to: email,
                to_name: "Vishesh"
            };

            // Send the email
            emailjs.send('service_jo48wlv', 'template_a0m6se7', templateParams)
                .then(function(response) {
                    console.log('SUCCESS!', response.status, response.text);
                    submitBtnText.innerText = "Message Sent!";
                    submitBtn.style.background = "linear-gradient(135deg, #10b981, #059669)"; // Green success color
                    
                    // Reset form
                    contactForm.reset();

                    // Reset button after 3 seconds
                    setTimeout(() => {
                        submitBtnText.innerText = originalText;
                        submitBtn.style.background = "";
                        submitBtn.style.opacity = "1";
                        submitBtn.style.pointerEvents = "auto";
                        isSubmitting = false;
                    }, 3000);
                }, function(error) {
                    console.log('FAILED...', error);
                    submitBtnText.innerText = "Error: Try Again";
                    submitBtn.style.background = "linear-gradient(135deg, #ef4444, #b91c1c)"; // Red error color
                    
                    // Reset button after 3 seconds
                    setTimeout(() => {
                        submitBtnText.innerText = originalText;
                        submitBtn.style.background = "";
                        submitBtn.style.opacity = "1";
                        submitBtn.style.pointerEvents = "auto";
                        isSubmitting = false;
                    }, 3000);
                });
        });
    }

});
