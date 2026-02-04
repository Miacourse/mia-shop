
// --- Stats & Visitor Tracking ---
const visitorCountEl = document.getElementById('visitor-count');
const productsSoldEl = document.getElementById('products-sold');

// Simple Visitor Counter (LocalStorage)
const trackVisits = () => {
    let visits = localStorage.getItem('miaShopVisits');

    // Initial setup if not exists
    if (!visits)
        visits = 1024; // Start with some social proof

    // Check if distinct session (basic)
    // We update the count only if it's a new session, to avoid incrementing on refresh
    if (!sessionStorage.getItem('hasVisited')) {
        visits = parseInt(visits) + 1;
        localStorage.setItem('miaShopVisits', visits);
        sessionStorage.setItem('hasVisited', 'true');
    }

    // Update UI
    if (visitorCountEl) visitorCountEl.innerText = visits;
};

// --- FAQ Accordion ---
const accordionHeaders = document.querySelectorAll('.accordion-header');

accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
        const content = header.nextElementSibling;

        // Toggle active class
        header.classList.toggle('active');

        // Toggle max-height for animation
        if (header.classList.contains('active')) {
            content.style.maxHeight = content.scrollHeight + "px";
        } else {
            content.style.maxHeight = null;
        }

        // Close other items
        accordionHeaders.forEach(otherHeader => {
            if (otherHeader !== header && otherHeader.classList.contains('active')) {
                otherHeader.classList.remove('active');
                otherHeader.nextElementSibling.style.maxHeight = null;
            }
        });
    });
});

// Calculate products sold based on a multiplier of visits or static
// For now, keep it static or use a simple formula
if (productsSoldEl) {
    let visits = parseInt(localStorage.getItem('miaShopVisits')) || 1024;
    productsSoldEl.innerText = Math.floor(visits * 0.15) + "+"; // 15% conversion rate simulation
}

// Init Stats
trackVisits();
