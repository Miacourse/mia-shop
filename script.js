// Product Data
const products = [
    {
        id: 1,
        title: "Polo Premium Noir",
        price: 15000,
        category: "polo",
        image: "https://images.unsplash.com/photo-1626557981101-aae6f84aa6ff?q=80&w=2070&auto=format&fit=crop",
        isNew: true
    },
    {
        id: 2,
        title: "Polo Gold Edition",
        price: 18000,
        category: "polo",
        image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=1974&auto=format&fit=crop",
        isNew: false
    },
    {
        id: 3,
        title: "Polo Blanc Classique",
        price: 12000,
        category: "polo",
        image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=1964&auto=format&fit=crop",
        isNew: false
    },
    {
        id: 4,
        title: "Jean Slim Bleu",
        price: 25000,
        category: "jean",
        image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=1997&auto=format&fit=crop", // Fixed URL
        isNew: true
    },
    {
        id: 5,
        title: "Jean Noir Délavé",
        price: 28000,
        category: "jean",
        image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=1974&auto=format&fit=crop",
        isNew: false
    },
    {
        id: 6,
        title: "Polo Sport Rouge",
        price: 14000,
        category: "polo",
        image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=2070&auto=format&fit=crop",
        isNew: true
    }
];

// State
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// DOM Elements
const productGrid = document.getElementById('product-grid');
const newArrivalsGrid = document.getElementById('new-arrivals-grid');
const cartCount = document.getElementById('cart-count');
const cartItemsContainer = document.getElementById('cart-items');
const totalPriceEl = document.getElementById('total-price');
const orderForm = document.getElementById('order-form');
const filterBtns = document.querySelectorAll('.filter-btn');
const searchInput = document.getElementById('search-input');
const loginBtn = document.getElementById('login-btn');
const modal = document.getElementById('login-modal');
const closeModal = document.querySelector('.close-modal');
const loginForm = document.getElementById('login-form');
const userLabel = document.getElementById('user-label');

// --- Functions ---

// Format Price
const formatPrice = (price) => {
    return price.toLocaleString('fr-FR') + ' FCFA';
};

// Create Product Card HTML
const createCardHtml = (product) => {
    const newBadge = product.isNew ? '<span class="badge-new">Nouveau</span>' : '';
    return `
        <div class="product-card">
            ${newBadge}
            <img src="${product.image}" alt="${product.title}" class="product-img">
            <div class="product-info">
                <h3 class="product-title">${product.title}</h3>
                <span class="product-price">${formatPrice(product.price)}</span>
                <button class="add-to-cart" onclick="addToCart(${product.id})">
                    <i class="fa-solid fa-cart-plus"></i> Ajouter
                </button>
            </div>
        </div>
    `;
};

// Render Logic
const renderProducts = (category = 'all', searchTerm = '') => {
    productGrid.innerHTML = '';

    let filtered = products;

    // Category Filter
    if (category !== 'all') {
        filtered = filtered.filter(p => p.category === category);
    }

    // Search Filter
    if (searchTerm) {
        filtered = filtered.filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    if (filtered.length === 0) {
        productGrid.innerHTML = '<p style="text-align:center; grid-column: 1/-1;">Aucun produit trouvé.</p>';
        return;
    }

    filtered.forEach(product => {
        const card = document.createElement('div');
        card.innerHTML = createCardHtml(product);
        productGrid.appendChild(card.firstElementChild); // Append inner div to keep grid structure cleaner if needed, or just append card
    });
};

const renderNewArrivals = () => {
    newArrivalsGrid.innerHTML = '';
    const newItems = products.filter(p => p.isNew);

    newItems.forEach(product => {
        const card = document.createElement('div');
        card.innerHTML = createCardHtml(product);
        newArrivalsGrid.appendChild(card.firstElementChild);
    });
};

// Add to Cart
window.addToCart = (id) => {
    const product = products.find(p => p.id === id);
    cart.push(product);
    updateCart();
    alert(`Ajouté: ${product.title}`);
};

// Remove from Cart
window.removeFromCart = (index) => {
    cart.splice(index, 1);
    updateCart();
};

// Update Cart Display & Storage
const updateCart = () => {
    cartCount.innerText = cart.length;
    localStorage.setItem('cart', JSON.stringify(cart));

    cartItemsContainer.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-msg">Votre panier est vide.</p>';
    } else {
        cart.forEach((item, index) => {
            total += item.price;
            const itemEl = document.createElement('div');
            itemEl.className = 'cart-item';
            itemEl.innerHTML = `
                <div class="item-info">
                    <h4>${item.title}</h4>
                    <span class="item-price">${formatPrice(item.price)}</span>
                </div>
                <button class="remove-btn" onclick="removeFromCart(${index})">
                    <i class="fa-solid fa-trash"></i>
                </button>
            `;
            cartItemsContainer.appendChild(itemEl);
        });
    }

    totalPriceEl.innerText = formatPrice(total);
};

// Handle Checkout
orderForm.addEventListener('submit', (e) => {
    e.preventDefault();

    if (cart.length === 0) {
        alert("Votre panier est vide !");
        return;
    }

    const name = document.getElementById('name').value;
    const neighborhood = document.getElementById('neighborhood').value;
    const phone = document.getElementById('phone').value;
    const payment = document.getElementById('payment').value;

    let message = `*Nouvelle Commande - Mia Shop*\n\n`;
    message += `👤 *Client:* ${name}\n`;
    message += `📍 *Quartier:* ${neighborhood}\n`;
    message += `📞 *Tel:* ${phone}\n`;
    message += `💳 *Paiement:* ${payment}\n\n`;
    message += `*Articles:*\n`;

    let total = 0;
    cart.forEach(item => {
        message += `- ${item.title}: ${formatPrice(item.price)}\n`;
        total += item.price;
    });

    message += `\n*TOTAL: ${formatPrice(total)}*`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/22661111250?text=${encodedMessage}`;

    window.open(whatsappUrl, '_blank');
});

// Category Filtering
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderProducts(btn.dataset.category, searchInput.value);
    });
});

// Search functionality
searchInput.addEventListener('input', (e) => {
    const term = e.target.value;
    // Find active category
    const activeCategory = document.querySelector('.filter-btn.active').dataset.category;
    renderProducts(activeCategory, term);
});

// Login Modal functionality
loginBtn.addEventListener('click', () => {
    modal.style.display = 'flex';
});

closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target == modal) {
        modal.style.display = 'none';
    }
});

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    // Simulate Login
    const email = e.target.querySelector('input[type="email"]').value;
    const name = email.split('@')[0]; // Simple mock name extraction

    userLabel.innerText = `Bonjour, ${name.charAt(0).toUpperCase() + name.slice(1)}`;
    loginBtn.innerHTML = `<i class="fa-solid fa-user-check"></i> <span id="user-label">Bonjour, ${name.charAt(0).toUpperCase() + name.slice(1)}</span>`;

    modal.style.display = 'none';
    alert("Connexion réussie !");
});

// Init
renderProducts();
renderNewArrivals();
updateCart();

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

