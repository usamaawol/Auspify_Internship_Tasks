# NexusPanel — Modern Web Application Dashboard

**Internship Task 6 (Advanced)** is a responsive business dashboard built with React. It combines a revenue overview and analytics charts with separate pages for orders, products, customers, and account settings.

## Project overview

NexusPanel presents common small-business information in one interface: high-level performance metrics, revenue trends, traffic sources, recent orders, product inventory, and customer summaries. It was developed to demonstrate a dashboard-style application using reusable React components, state, responsive styling, and a charting library.

The project is a frontend demonstration for learning and presentation. It uses realistic sample data and local browser storage for selected changes. It is not connected to a live commerce system, database, authentication service, or analytics API.

## Objectives

- Preserve a clean dashboard layout with a dark navy sidebar, blue accents, and white cards.
- Use React components and hooks to organize a multi-page interface.
- Keep navigation, search, filters, product CRUD, and settings controls interactive.
- Visualize sample analytics using the installed chart library.
- Persist product and settings changes in the browser without adding a backend.
- Adapt the dashboard and tables for desktop, tablet, and mobile screens.

## Features and functionality

### Overview

- Four KPI cards show Total Revenue, Total Orders, Total Customers, and Conversion Rate.
- The reporting-period selector changes the displayed sample revenue, order, customer, growth, and revenue-chart data for week, month, or year.
- **Revenue Overview** is an area chart; **Traffic Sources** is a pie chart with Direct, Social Media, Search, and Referral sample proportions.
- Recent Orders shows sample transactions, and **View all** switches to the Orders page.

### Orders

- Displays order ID, customer, product, date, amount, and status.
- Search matches order ID, customer, or product.
- A status selector filters Completed, Pending, and Cancelled records.
- Five rows are displayed per page with Previous/Next controls and a range/count label.
- The sample order list is static and is not changed by actions on other pages.

### Products

- Displays product, category, ETB price, stock quantity, status, and actions.
- Search matches product name, category, or status.
- Add and edit use a modal form; fields are required, price and stock cannot be negative, and stock uses whole-number increments.
- Save adds a new record or updates the existing product.
- Status is derived when saving: zero stock is **Out of stock**, one to four is **Low stock**, and five or more is **Active**.
- Delete asks for browser confirmation before removing the product.
- Product changes persist under `nexuspanel-products` in `localStorage`.

### Customers

- Shows customer name, email, total orders, spending, and active/inactive status.
- Search matches name and email; a status filter narrows the sample list.
- The details button opens a modal with the selected customer's ID, order count, spending, and status.
- Customer records are static sample data.

### Settings

- Profile fields update the displayed account name, email, and avatar initials in the shared sidebar/header.
- Three notification preference checkboxes update UI state. They are preferences only; there is no email or notification service behind them.
- Account type, workspace, and member-since values are informational sample content.
- The appearance selector toggles the `dark-theme` class and uses the dark-theme CSS rules.
- Settings persist under `nexuspanel-settings` in `localStorage`.

The top-header search and notification icons are currently presentation controls without search or notification behavior. There is no backend, authentication, chart API, live order/customer data, or cross-device synchronization.

## Technologies

| Technology | Use |
|---|---|
| React | Functional components and UI state |
| Vite | Development server and production build |
| Recharts | Responsive area and pie charts |
| Lucide React | Sidebar, metric, action, and header icons |
| CSS | Dashboard theme, tables, dialogs, dark-theme rules, and responsive layout |
| Browser `localStorage` | Persisting product records and settings |
| ESLint | Source linting using the project's React Hooks and React Refresh rules |

The dependency list and available commands are in `package.json`; there is no router, server, database, or API client.

## System architecture and data flow

`src/main.jsx` mounts the app into the `#root` element with React Strict Mode. `src/App.jsx` owns the shared shell, sidebar navigation, Overview, reporting period, and top-level product/settings state. It conditionally displays Overview or passes the current page and state to `ManagementPages`.

The page selector is ordinary React state, not URL routing. Clicking a sidebar button changes `activePage`; the selected page is rendered inside the same dashboard shell. The mobile menu is another state value and closes when a page is selected.

Product and settings state initialize from `localStorage` using `loadSavedState()`. Effects call `saveState()` when these values change. The helpers catch storage/JSON errors and log them; reads fall back to the initial sample values. Orders and customers are defined as page-local sample arrays, while dashboard metrics and chart series are in `App.jsx`.

```text
Task6/
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
├── eslint.config.js
├── public/
│   ├── favicon.svg
│   └── icons.svg
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── App.css
    ├── index.css
    ├── data/
    │   └── managementData.js
    ├── pages/
    │   └── ManagementPages.jsx
    └── assets/
        ├── hero.png
        ├── react.svg
        └── vite.svg
```

`node_modules/` is installed dependency content and `dist/` is generated build output; neither is application source.

## Detailed implementation

### Shared dashboard shell

`App.jsx` defines `Sidebar`, `MetricCard`, `RevenueChart`, `TrafficChart`, and `RecentOrders`. `Sidebar` renders the five page buttons and a mobile overlay. The Overview continues to use the original KPI/chart structure; `RecentOrders` accepts an `onViewAll` callback to navigate to Orders.

The dashboard data uses fixed sample objects for week, month, and year. `ResponsiveContainer` adapts each Recharts visualization to its parent card. `RevenueChart` is an `AreaChart` with grid, axes, tooltip, and a blue area fill; `TrafficChart` is a `PieChart` with labels/legend and a color per source.

### Management page components

`src/pages/ManagementPages.jsx` selects `OrdersPage`, `ProductsPage`, `CustomersPage`, or `SettingsPage` based on the `page` prop. Shared UI pieces in that module include `Button`, `SearchInput`, `StatusBadge`, `DataTable`, `Modal`, `PageHeading`, and `SettingToggle`.

- `OrdersPage` uses `useMemo` to derive filtered rows, then slices the result into five-row pages.
- `ProductsPage` receives product state and its setter from `App`. `ProductForm` manages form inputs locally; `saveProduct` updates or prepends a product.
- `CustomersPage` derives visible customers from local search/filter state and stores the selected customer to control its details modal.
- `SettingsPage` updates fields through a functional state setter so each input changes one settings property without replacing the others.

### Data and persistence

`src/data/managementData.js` holds the initial product list and initial account/preferences object. Sample orders and customers are defined in `ManagementPages.jsx`. None of these lists are fetched from a remote service.

The local-storage keys are `nexuspanel-products` and `nexuspanel-settings`. Clearing browser site data resets the locally persisted lists/preferences to their initial samples. A storage write failure is logged in the console; the dashboard does not show a dedicated persistence-error banner.

## User interface and responsive behavior

The design uses a fixed dark navy sidebar, blue active/primary controls, white panels, slate text, and a light gray workspace background. Tables sit in horizontal overflow containers so their columns remain usable on narrow screens. Reusable page headings, search fields, badges, tables, and modals keep management views visually consistent.

At widths below 1100px, KPI cards reduce to two columns and chart cards stack. At widths below 700px, the sidebar slides in as an overlay menu, the main content expands to full width, page controls stack, and settings forms use one column. The dashboard CSS also includes dark-theme rules for the appearance choice; that theme is a frontend style toggle rather than a system-wide preference integration.


### Prerequisites

- Node.js and npm compatible with the Vite version in the project.
- A browser with JavaScript enabled.

There are no environment variables, API keys, or backend services to configure.

### Install and run

From the `Task6` folder:
```bash
npm install
npm run dev
```

Open the local URL printed by Vite (by default, `http://localhost:5173`). Stop the development server with `Ctrl+C`.

Available project checks:
```bash
npm run lint
npm run build
npm run preview
```

`npm run preview` serves the already-built `dist/` output; run `npm run build` first when previewing updated source.

## How to use

1. Select **Overview**, **Orders**, **Products**, **Customers**, or **Settings** in the sidebar.
2. On Overview, change the reporting period to change the sample KPI values and revenue series.
3. In Orders, search, choose a status, and page through the results.
4. In Products, search the catalog, add/edit a product, or confirm deletion. Refresh to confirm saved products return.
5. In Customers, search/filter records and open the details view.
6. In Settings, change profile values, toggle preferences, and choose an appearance. Refresh to confirm saved settings return.
7. On a narrow viewport, open and close navigation with the menu control.

## Testing and verification

The project includes lint and production-build commands but no dedicated automated unit or browser test suite.

Run:
```bash
npm run lint
npm run build
```

Manual verification checklist:
- Confirm each sidebar item renders its named page and Overview retains the KPI cards and two charts.
- Change the reporting period and confirm the chart and related totals update.
- Search/filter orders and use pagination; test an empty-result search.
- Add, edit, search, and delete products; check derived stock status and persistence after refresh.
- Search/filter customers and open/close a customer details modal.
- Change each settings control, inspect profile text/initials and theme behavior, then refresh.
- Resize to mobile and test the menu overlay and horizontally scrollable tables.

The build may print a non-blocking advisory that the generated JavaScript chunk exceeds Vite's default 500 kB warning threshold; a successful build still completes.

## Challenges and implementation decisions

- **Multiple pages without a routing dependency:** A single `activePage` state switches page content while preserving a shared header and sidebar.
- **Product CRUD without a server:** React state keeps the list interactive, and `localStorage` preserves it for the same browser.
- **Search/filter/pagination consistency:** Orders derives filtered data before slicing it into pages and resets the current page when search or status changes.
- **Charts without live analytics:** Recharts visualizes clearly defined sample datasets, allowing the chart layout and tooltips to work without inventing an API.
- **Mobile sidebar behavior:** A separate boolean state and overlay support opening and closing the fixed sidebar on small screens.

## Learning outcomes

NexusPanel demonstrates component composition, props, `useState`, `useEffect`, `useMemo`, controlled form fields, derived lists, local persistence, responsive CSS, and Recharts configuration. It is also a useful example of explaining the distinction between an interactive frontend prototype and a production dashboard backed by authenticated, live data.

## Future improvements

- Add a real backend, authentication, authorization, and validation before storing business information.
- Connect orders, customers, product inventory, and analytics to a consistent data source.
- Add automated tests for CRUD, filters, local-storage failure cases, and responsive navigation.
- Provide visible user feedback if local-storage writes fail.
- Implement real header search/notifications or present those icons as non-interactive decoration.
- Consider code splitting the chart-heavy bundle if the project grows.

## Conclusion

NexusPanel is a frontend dashboard prototype that combines the original analytics overview with working navigation and distinct management pages. Its sample data, React state, browser persistence, reusable UI pieces, and responsive layout demonstrate the core ideas required for an advanced dashboard task while keeping the architecture approachable for a student.
