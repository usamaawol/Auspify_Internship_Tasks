# TechStore — Technology Storefront

**Internship Task 5** is a static, browser-based storefront demonstration. Visitors can browse a sample technology catalog, search and filter products, add items to a cart, adjust quantities, and see an estimated total.

## Project overview

TechStore models the discovery and cart portion of a simple technology shop. Its target users are visitors browsing sample laptops, phones, headphones, and accessories. The project is a frontend demonstration only: it does not sell products, reserve stock, create orders, or process payments.

## Objectives

- Render a product catalog from JavaScript data.
- Implement search, category filtering, and sorting.
- Manage cart quantities and calculate a running total.
- Persist the cart in browser storage.
- Practice responsive product grids and a slide-in cart panel.

## Features

- **Product catalog:** Eight hard-coded sample products include an ID, name, category, price in ETB, rating, and remote image URL.
- **Dynamic product cards:** `displayProducts()` builds cards with DOM APIs, category, rating, formatted price, and an Add to Cart button. Product images are lazy-loaded, with an error handler that removes a broken image source.
- **Search:** Filters product names by case-insensitive text.
- **Category filter:** Selects all products or a specific category.
- **Sorting:** Orders results by price low-to-high, high-to-low, or name A-to-Z.
- **Results and empty feedback:** Shows the number of matching products and a no-results message when appropriate.
- **Cart panel:** Opens as a right-side drawer with an overlay; the panel can be closed by its close button or the overlay.
- **Cart operations:** Add products, increment/decrement quantities, remove individual entries, and clear the cart.
- **Cart totals:** Displays the total item quantity in the header and the aggregate price in the panel.
- **Persistence:** Cart entries are saved under the `techStoreCart` local-storage key and loaded at startup when they still refer to valid product IDs.
- **Demo checkout:** Checkout displays an alert explaining that no payment is processed.
- **Dynamic footer year:** JavaScript inserts the current year.

The catalog is static and cart-only. There is no inventory service, checkout workflow, payment provider, user account, or product-management interface.

## Technologies

| Technology | Use |
|---|---|
| HTML5 | Storefront sections, search controls, product grid container, and cart panel |
| CSS3 | Blue-and-white shop theme, responsive grid, drawer, and overlay |
| Vanilla JavaScript | Product rendering, filters, sorting, cart state, and event handlers |
| Web Storage API | Local cart persistence |
| Unsplash image URLs | Remote sample product and hero imagery |

No frameworks, packages, backend services, API calls, or database are configured. Product imagery depends on external URLs and an internet connection.

## Architecture and data flow

`index.html` contains the storefront shell and element IDs used by the script. `script.js` owns the static `products` array, the mutable `cart` array, and the DOM behavior. `style.css` handles presentation and responsive layout.

At startup, the script reads `techStoreCart`, filters entries to valid product IDs and positive integer quantities, then calls `filterProducts()` and `displayCart()`. Search, category, and sort controls recompute a display list from the original catalog. Cart actions update the cart array, save it, and rerender the drawer and summary.

```text
Task5/
├── index.html
├── script.js
├── style.css
└── README.md
```

### Important functions

- `formatMoney(amount)` formats prices in ETB with two decimal places.
- `displayProducts(productArray)` constructs product cards and binds their Add to Cart actions.
- `filterProducts()` combines name search and category selection, then applies the selected sort.
- `addToCart()`, `changeQuantity()`, and `removeFromCart()` update cart records.
- `displayCart()` resolves IDs against the product list, calculates quantity and total, and builds cart item controls.
- `openCart()` / `closeCart()` toggle the drawer and overlay classes.

The cart data stores product IDs and quantities rather than duplicating product names and prices. The product catalog remains the source for display names and prices.

## UI and responsive design

The interface uses a dark text/nav base, blue controls, white product cards, and a darkened technology-image hero. The product grid uses four columns on larger screens, three below 900px, two below 650px, and one below 360px. On narrow screens, filters stack and product-card controls stretch for easier tapping.

The cart panel is fixed to the right, with a matching full-page overlay. CSS transitions expose and hide the drawer; the panel width is capped and adapts to viewport width.

## How to see/open the project
The page can be opened directly as `index.html`; use the server when testing the site at a consistent browser origin.

## How to use

1. Browse the product cards or enter a name in **Search products**.
2. Choose a category and/or sort order to refine the displayed catalog.
3. Select **Add to Cart** on a product.
4. Select **Cart** in the header to open the drawer.
5. Use `+` and `-` to adjust quantity, or **Remove** to delete an entry.
6. Use **Clear Cart** to empty it.
7. Select **Proceed to Checkout** to see the demonstration notice; it does not submit an order.
8. Refresh to check whether the cart is restored from local storage.

## Testing and verification

There are no automated test or lint commands. Manually verify:

- Search terms return matching product names and a no-results state for unmatched text.
- Category filter and each sort option update product order as expected.
- Adding the same product increases its quantity rather than creating duplicate entries.
- Quantity changes update the cart count and total; reducing quantity to zero removes it.
- Remove and Clear Cart update the drawer and disable checkout when empty.
- Closing the drawer works with both close button and overlay.
- Reloading restores a valid saved cart.
- Checkout only displays the demo alert and never claims to process payment.

## Challenges and implementation decisions

- **Catalog and cart are separate data:** Cart records reference product IDs, allowing display and total calculations to use the catalog's product values.
- **Changing filters should not mutate the source catalog:** Filtering begins with a new array from `.filter()`, and sorting is applied to that derived array.
- **Persisted cart data needs basic validation:** Startup loading accepts only arrays with known product IDs and positive integer quantities.
- **The checkout boundary is explicit:** The demo alerts the visitor that no payment has been processed rather than implying a working commerce backend.

## Learning outcomes

TechStore demonstrates array filtering and sorting, DOM construction, event binding, cart state modeling, local storage, number formatting, responsive grids, and a drawer overlay pattern. It also provides a concrete way to explain the difference between a shopping-cart UI and a complete e-commerce system.

## Future improvements

- Add automated validation around cart updates and total calculations.
- Guard local-storage writes and surface persistence errors to the user.
- Add product detail views or a cart empty-state design if the catalog expands.
- Replace remote demo images with managed assets if offline availability is needed.
- Connect checkout to a real backend and payment provider only with appropriate server-side validation and security.

## Conclusion

TechStore is a frontend catalog-and-cart exercise with useful shopping interactions and local persistence. Its static data and demonstration checkout make its limits clear while showcasing core JavaScript and responsive-interface techniques.
