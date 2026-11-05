
// Product data
const products = [
    {
        id: 1,
        name: "MacBook Pro M3",
        category: "Laptop",
        price: 85000,
        rating: 4.9,
        image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600"
    },
    {
        id: 2,
        name: "iPhone 15 Pro",
        category: "Phone",
        price: 65000,
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=600"
    },
    {
        id: 3,
        name: "Wireless Headphones",
        category: "Headphones",
        price: 4500,
        rating: 4.7,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600"
    },
    {
        id: 4,
        name: "Gaming Laptop",
        category: "Laptop",
        price: 72000,
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600"
    },
    {
        id: 5,
        name: "Smart Watch",
        category: "Accessories",
        price: 6500,
        rating: 4.5,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600"
    },
    {
        id: 6,
        name: "Android Smartphone",
        category: "Phone",
        price: 18000,
        rating: 4.6,
        image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600"
    },
    {
        id: 7,
        name: "Bluetooth Speaker",
        category: "Accessories",
        price: 3200,
        rating: 4.4,
        image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600"
    },
    {
        id: 8,
        name: "Studio Headphones",
        category: "Headphones",
        price: 8500,
        rating: 4.9,
        image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600"
    }
];

// Get HTML elements
const productGrid = document.getElementById("product-grid");
const searchInput = document.getElementById("search-input");
const categoryFilter = document.getElementById("category-filter");
const sortFilter = document.getElementById("sort-filter");

const resultsCount = document.getElementById("results-count");
const noResults = document.getElementById("no-results");

const cartPanel = document.getElementById("cart-panel");
const cartOverlay = document.getElementById("cart-overlay");
const cartItemsElement = document.getElementById("cart-items");

const cartCount = document.getElementById("cart-count");
const cartTotal = document.getElementById("cart-total");

const checkoutButton = document.getElementById("checkout-button");

// Load saved cart
let cart = [];

try {
    const savedCart = JSON.parse(
        localStorage.getItem("techStoreCart")
    );

    if (Array.isArray(savedCart)) {
        cart = savedCart.filter(function (item) {
            return (
                Number.isInteger(item.id) &&
                Number.isInteger(item.quantity) &&
                item.quantity > 0 &&
                products.some(function (product) {
                    return product.id === item.id;
                })
            );
        });
    }
} catch (error) {
    cart = [];
}

// Format money
function formatMoney(amount) {
    return "ETB " + amount.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

// Display products
function displayProducts(productArray) {
    productGrid.innerHTML = "";

    resultsCount.textContent =
        productArray.length + " product(s) found";

    noResults.hidden = productArray.length !== 0;

    productArray.forEach(function (product) {
        const card = document.createElement("article");
        card.className = "product-card";

        const image = document.createElement("img");
        image.className = "product-image";
        image.src = product.image;
        image.alt = product.name;
        image.loading = "lazy";

        image.addEventListener("error", function () {
            image.alt = "Product image unavailable";
            image.removeAttribute("src");
        });

        const info = document.createElement("div");
        info.className = "product-info";

        const category = document.createElement("p");
        category.className = "product-category";
        category.textContent = product.category;

        const name = document.createElement("h3");
        name.textContent = product.name;

        const rating = document.createElement("p");
        rating.className = "product-rating";
        rating.textContent = "★ " + product.rating + " / 5";

        const bottom = document.createElement("div");
        bottom.className = "product-bottom";

        const price = document.createElement("span");
        price.className = "product-price";
        price.textContent = formatMoney(product.price);

        const button = document.createElement("button");
        button.className = "add-button";
        button.textContent = "Add to Cart";

        button.addEventListener("click", function () {
            addToCart(product.id);
        });

        bottom.appendChild(price);
        bottom.appendChild(button);

        info.appendChild(category);
        info.appendChild(name);
        info.appendChild(rating);
        info.appendChild(bottom);

        card.appendChild(image);
        card.appendChild(info);

        productGrid.appendChild(card);
    });
}

// Search, filter and sort products
function filterProducts() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    const selectedCategory = categoryFilter.value;
    const selectedSort = sortFilter.value;

    let filteredProducts = products.filter(function (product) {
        const matchesSearch = product.name
            .toLowerCase()
            .includes(searchTerm);

        const matchesCategory =
            selectedCategory === "all" ||
            product.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    if (selectedSort === "low-high") {
        filteredProducts.sort(function (a, b) {
            return a.price - b.price;
        });
    } else if (selectedSort === "high-low") {
        filteredProducts.sort(function (a, b) {
            return b.price - a.price;
        });
    } else if (selectedSort === "name") {
        filteredProducts.sort(function (a, b) {
            return a.name.localeCompare(b.name);
        });
    }

    displayProducts(filteredProducts);
}

// Add product to cart
function addToCart(productId) {
    const existingItem = cart.find(function (item) {
        return item.id === productId;
    });

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            id: productId,
            quantity: 1
        });
    }

    saveCart();
    displayCart();
}

// Save cart
function saveCart() {
    localStorage.setItem("techStoreCart", JSON.stringify(cart));
}

// Change product quantity
function changeQuantity(productId, change) {
    const item = cart.find(function (item) {
        return item.id === productId;
    });

    if (!item) return;

    item.quantity += change;

    if (item.quantity <= 0) {
        cart = cart.filter(function (cartItem) {
            return cartItem.id !== productId;
        });
    }

    saveCart();
    displayCart();
}

// Remove product from cart
function removeFromCart(productId) {
    cart = cart.filter(function (item) {
        return item.id !== productId;
    });

    saveCart();
    displayCart();
}

// Display cart
function displayCart() {
    cartItemsElement.innerHTML = "";

    let total = 0;
    let totalQuantity = 0;

    cart.forEach(function (item) {
        const product = products.find(function (product) {
            return product.id === item.id;
        });

        if (!product) return;

        total += product.price * item.quantity;
        totalQuantity += item.quantity;

        const cartItem = document.createElement("div");
        cartItem.className = "cart-item";

        const image = document.createElement("img");
        image.src = product.image;
        image.alt = product.name;

        const info = document.createElement("div");
        info.className = "cart-item-info";

        const name = document.createElement("h3");
        name.textContent = product.name;

        const price = document.createElement("p");
        price.textContent = formatMoney(product.price);

        const controls = document.createElement("div");
        controls.className = "quantity-controls";

        const decreaseButton = document.createElement("button");
        decreaseButton.textContent = "-";
        decreaseButton.setAttribute("aria-label", "Decrease quantity");

        decreaseButton.addEventListener("click", function () {
            changeQuantity(product.id, -1);
        });

        const quantity = document.createElement("span");
        quantity.textContent = item.quantity;

        const increaseButton = document.createElement("button");
        increaseButton.textContent = "+";
        increaseButton.setAttribute("aria-label", "Increase quantity");

        increaseButton.addEventListener("click", function () {
            changeQuantity(product.id, 1);
        });

        controls.appendChild(decreaseButton);
        controls.appendChild(quantity);
        controls.appendChild(increaseButton);

        info.appendChild(name);
        info.appendChild(price);
        info.appendChild(controls);

        const removeButton = document.createElement("button");
        removeButton.className = "remove-button";
        removeButton.textContent = "Remove";

        removeButton.addEventListener("click", function () {
            removeFromCart(product.id);
        });

        cartItem.appendChild(image);
        cartItem.appendChild(info);
        cartItem.appendChild(removeButton);

        cartItemsElement.appendChild(cartItem);
    });

    if (cart.length === 0) {
        const emptyMessage = document.createElement("p");
        emptyMessage.className = "cart-empty";
        emptyMessage.textContent = "Your shopping cart is empty.";

        cartItemsElement.appendChild(emptyMessage);
    }

    cartCount.textContent = totalQuantity;
    cartTotal.textContent = formatMoney(total);

    checkoutButton.disabled = cart.length === 0;
}

// Open cart
function openCart() {
    cartPanel.classList.add("active");
    cartOverlay.classList.add("active");
}

// Close cart
function closeCart() {
    cartPanel.classList.remove("active");
    cartOverlay.classList.remove("active");
}

// Event listeners
searchInput.addEventListener("input", filterProducts);

categoryFilter.addEventListener("change", filterProducts);

sortFilter.addEventListener("change", filterProducts);

document.getElementById("open-cart").addEventListener("click", openCart);

document.getElementById("close-cart").addEventListener("click", closeCart);

cartOverlay.addEventListener("click", closeCart);

// Clear cart
document.getElementById("clear-cart").addEventListener("click", function () {
    cart = [];
    saveCart();
    displayCart();
});

// Demo checkout
checkoutButton.addEventListener("click", function () {
    if (cart.length === 0) return;

    alert(
        "This is a frontend demonstration. " +
        "No real payment has been processed."
    );
});

// Display current year
document.getElementById("year").textContent =
    new Date().getFullYear();

// Initial display
filterProducts();
displayCart();
