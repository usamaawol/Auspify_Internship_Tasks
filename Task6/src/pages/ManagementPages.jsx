import { useMemo, useState } from "react";
import {
  Eye,
  Pencil,
  Plus,
  Search,
  Trash2,
  X
} from "lucide-react";

const initialOrders = [
  { id: "ORD-1001", customer: "Abebe Kebede", product: "MacBook Pro", date: "Nov 05, 2026", amount: "ETB 85,000", status: "Completed" },
  { id: "ORD-1002", customer: "Sara Ahmed", product: "iPhone 15", date: "Nov 04, 2026", amount: "ETB 65,000", status: "Pending" },
  { id: "ORD-1003", customer: "Daniel Bekele", product: "Headphones", date: "Nov 03, 2026", amount: "ETB 4,500", status: "Completed" },
  { id: "ORD-1004", customer: "Hana Mohammed", product: "Smart Watch", date: "Nov 02, 2026", amount: "ETB 6,500", status: "Cancelled" },
  { id: "ORD-1005", customer: "Mimi Tesfaye", product: "USB-C Hub", date: "Nov 01, 2026", amount: "ETB 1,800", status: "Completed" },
  { id: "ORD-1006", customer: "Yonas Girma", product: "MacBook Pro", date: "Oct 30, 2026", amount: "ETB 85,000", status: "Pending" },
  { id: "ORD-1007", customer: "Rahel Solomon", product: "iPhone 15", date: "Oct 29, 2026", amount: "ETB 65,000", status: "Completed" },
  { id: "ORD-1008", customer: "Khalid Osman", product: "Headphones", date: "Oct 28, 2026", amount: "ETB 4,500", status: "Cancelled" },
  { id: "ORD-1009", customer: "Liya Mekonnen", product: "USB-C Hub", date: "Oct 27, 2026", amount: "ETB 1,800", status: "Completed" }
];

const customers = [
  { id: "CUS-301", name: "Abebe Kebede", email: "abebe.k@example.com", orders: 14, spending: "ETB 245,000", status: "Active" },
  { id: "CUS-302", name: "Sara Ahmed", email: "sara.ahmed@example.com", orders: 8, spending: "ETB 128,500", status: "Active" },
  { id: "CUS-303", name: "Daniel Bekele", email: "daniel.b@example.com", orders: 5, spending: "ETB 32,400", status: "Active" },
  { id: "CUS-304", name: "Hana Mohammed", email: "hana.m@example.com", orders: 2, spending: "ETB 11,000", status: "Inactive" },
  { id: "CUS-305", name: "Mimi Tesfaye", email: "mimi.t@example.com", orders: 11, spending: "ETB 96,700", status: "Active" },
  { id: "CUS-306", name: "Yonas Girma", email: "yonas.g@example.com", orders: 1, spending: "ETB 85,000", status: "Inactive" },
  { id: "CUS-307", name: "Rahel Solomon", email: "rahel.s@example.com", orders: 6, spending: "ETB 71,200", status: "Active" }
];

function Button({ children, className = "", ...props }) {
  return <button className={`action-button ${className}`} {...props}>{children}</button>;
}

function SearchInput({ value, onChange, placeholder = "Search..." }) {
  return (
    <label className="search-input">
      <Search size={17} aria-hidden="true" />
      <input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} />
    </label>
  );
}

function StatusBadge({ status }) {
  const statusClass = status.toLowerCase().replaceAll(" ", "-");
  return <span className={`status ${statusClass}`}>{status}</span>;
}

function DataTable({ columns, rows, emptyMessage }) {
  return (
    <div className="table-wrapper">
      <table className="data-table">
        <thead>
          <tr>{columns.map((column) => <th key={column}>{column}</th>)}</tr>
        </thead>
        <tbody>
          {rows.length ? rows.map((row) => (
            <tr key={row.id}>{row.cells.map((cell, index) => <td key={`${row.id}-${index}`}>{cell}</td>)}</tr>
          )) : (
            <tr><td className="empty-state" colSpan={columns.length}>{emptyMessage}</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function Modal({ title, onClose, children, wide = false }) {
  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <section
        className={`modal-card ${wide ? "modal-wide" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="modal-heading">
          <h2>{title}</h2>
          <button className="icon-button" onClick={onClose} aria-label="Close dialog"><X size={18} /></button>
        </div>
        {children}
      </section>
    </div>
  );
}

function PageHeading({ title, description, children }) {
  return (
    <div className="page-heading">
      <div><h2>{title}</h2><p>{description}</p></div>
      {children}
    </div>
  );
}

function OrdersPage() {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All statuses");
  const [page, setPage] = useState(1);
  const pageSize = 5;
  const filteredOrders = useMemo(() => initialOrders.filter((order) => {
    const matchesText = `${order.id} ${order.customer} ${order.product}`.toLowerCase().includes(query.toLowerCase());
    return matchesText && (statusFilter === "All statuses" || order.status === statusFilter);
  }), [query, statusFilter]);
  const pageCount = Math.max(1, Math.ceil(filteredOrders.length / pageSize));
  const visibleOrders = filteredOrders.slice((page - 1) * pageSize, page * pageSize);
  const rows = visibleOrders.map((order) => ({
    id: order.id,
    cells: [order.id, order.customer, order.product, order.date, order.amount, <StatusBadge status={order.status} />]
  }));

  return (
    <>
      <PageHeading title="Orders" description="Review and track your latest customer orders." />
      <section className="panel page-panel">
        <div className="table-toolbar">
          <SearchInput value={query} onChange={(value) => { setQuery(value); setPage(1); }} placeholder="Search orders..." />
          <select className="filter-select" value={statusFilter} onChange={(event) => { setStatusFilter(event.target.value); setPage(1); }} aria-label="Filter orders by status">
            <option>All statuses</option><option>Completed</option><option>Pending</option><option>Cancelled</option>
          </select>
        </div>
        <DataTable columns={["Order ID", "Customer", "Product", "Date", "Amount", "Status"]} rows={rows} emptyMessage="No orders match your search." />
        <div className="pagination">
          <span>{filteredOrders.length ? `Showing ${(page - 1) * pageSize + 1}-${Math.min(page * pageSize, filteredOrders.length)} of ${filteredOrders.length} orders` : "No results"}</span>
          <div>
            <Button className="secondary-button" disabled={page === 1} onClick={() => setPage((current) => current - 1)}>Previous</Button>
            <Button className="secondary-button" disabled={page >= pageCount} onClick={() => setPage((current) => current + 1)}>Next</Button>
          </div>
        </div>
      </section>
    </>
  );
}

function ProductForm({ product, onSave, onClose }) {
  const [form, setForm] = useState(product || { name: "", category: "", price: "", stock: "", status: "Active" });
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  function submit(event) {
    event.preventDefault();
    const stock = Number(form.stock);
    onSave({
      ...form,
      id: product?.id || `PRD-${Date.now()}`,
      price: Number(form.price),
      stock,
      status: stock === 0 ? "Out of stock" : stock < 5 ? "Low stock" : "Active"
    });
  }

  return (
    <Modal title={product ? "Edit product" : "Add product"} onClose={onClose}>
      <form className="form-stack" onSubmit={submit}>
        <label>Product name<input required value={form.name} onChange={(event) => update("name", event.target.value)} /></label>
        <label>Category<input required value={form.category} onChange={(event) => update("category", event.target.value)} /></label>
        <div className="form-row">
          <label>Price (ETB)<input required type="number" min="0" step="0.01" value={form.price} onChange={(event) => update("price", event.target.value)} /></label>
          <label>Stock quantity<input required type="number" min="0" step="1" value={form.stock} onChange={(event) => update("stock", event.target.value)} /></label>
        </div>
        <div className="modal-actions"><Button type="button" className="secondary-button" onClick={onClose}>Cancel</Button><Button type="submit" className="primary-button">Save product</Button></div>
      </form>
    </Modal>
  );
}

function ProductsPage({ products, setProducts }) {
  const [query, setQuery] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);
  const [addingProduct, setAddingProduct] = useState(false);
  const filtered = products.filter((product) => `${product.name} ${product.category} ${product.status}`.toLowerCase().includes(query.toLowerCase()));
  const rows = filtered.map((product) => ({
    id: product.id,
    cells: [
      <div className="product-name" key="name">{product.name}<small>{product.id}</small></div>,
      product.category,
      `ETB ${Number(product.price).toLocaleString()}`,
      product.stock,
      <StatusBadge key="status" status={product.status} />,
      <div className="row-actions" key="actions">
        <button className="text-icon-button" onClick={() => setEditingProduct(product)} aria-label={`Edit ${product.name}`}><Pencil size={16} /></button>
        <button className="text-icon-button danger-button" onClick={() => {
          if (window.confirm(`Delete ${product.name}?`)) setProducts((current) => current.filter((item) => item.id !== product.id));
        }} aria-label={`Delete ${product.name}`}><Trash2 size={16} /></button>
      </div>
    ]
  }));
  const saveProduct = (product) => {
    setProducts((current) => current.some((item) => item.id === product.id)
      ? current.map((item) => item.id === product.id ? product : item)
      : [product, ...current]);
    setEditingProduct(null);
    setAddingProduct(false);
  };

  return (
    <>
      <PageHeading title="Products" description="Manage your catalog, pricing, and inventory.">
        <Button className="primary-button" onClick={() => setAddingProduct(true)}><Plus size={17} /> Add product</Button>
      </PageHeading>
      <section className="panel page-panel">
        <div className="table-toolbar"><SearchInput value={query} onChange={setQuery} placeholder="Search products..." /><span className="result-count">{filtered.length} products</span></div>
        <DataTable columns={["Product", "Category", "Price", "Stock", "Status", "Actions"]} rows={rows} emptyMessage="No products match your search." />
      </section>
      {(addingProduct || editingProduct) && (
        <ProductForm
          key={editingProduct?.id || "new-product"}
          product={editingProduct}
          onSave={saveProduct}
          onClose={() => { setAddingProduct(false); setEditingProduct(null); }}
        />
      )}
    </>
  );
}

function CustomersPage() {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All customers");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const filtered = customers.filter((customer) => {
    const matchesText = `${customer.name} ${customer.email}`.toLowerCase().includes(query.toLowerCase());
    return matchesText && (statusFilter === "All customers" || customer.status === statusFilter);
  });
  const rows = filtered.map((customer) => ({
    id: customer.id,
    cells: [
      <div className="product-name" key="name">{customer.name}</div>,
      customer.email,
      customer.orders,
      customer.spending,
      <StatusBadge key="status" status={customer.status} />,
      <button className="text-icon-button" key="view" onClick={() => setSelectedCustomer(customer)} aria-label={`View ${customer.name}`}><Eye size={17} /></button>
    ]
  }));

  return (
    <>
      <PageHeading title="Customers" description="Get to know your customers and their activity." />
      <section className="panel page-panel">
          <div className="table-toolbar">
          <SearchInput value={query} onChange={setQuery} placeholder="Search customers..." />
          <select className="filter-select" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} aria-label="Filter customers by status">
            <option>All customers</option><option>Active</option><option>Inactive</option>
          </select>
        </div>
        <DataTable columns={["Customer", "Email", "Total orders", "Total spending", "Status", "Details"]} rows={rows} emptyMessage="No customers match your search." />
      </section>
      {selectedCustomer && (
        <Modal title="Customer details" onClose={() => setSelectedCustomer(null)}>
          <div className="customer-detail">
            <div className="customer-avatar">{selectedCustomer.name.split(" ").map((part) => part[0]).join("")}</div>
            <h3>{selectedCustomer.name}</h3>
            <p>{selectedCustomer.email}</p>
            <dl><div><dt>Customer ID</dt><dd>{selectedCustomer.id}</dd></div><div><dt>Total orders</dt><dd>{selectedCustomer.orders}</dd></div><div><dt>Total spending</dt><dd>{selectedCustomer.spending}</dd></div><div><dt>Status</dt><dd><StatusBadge status={selectedCustomer.status} /></dd></div></dl>
          </div>
        </Modal>
      )}
    </>
  );
}

function SettingToggle({ label, description, checked, onChange }) {
  return (
    <label className="setting-toggle">
      <span><strong>{label}</strong><small>{description}</small></span>
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
    </label>
  );
}

function SettingsPage({ settings, setSettings }) {
  const update = (key, value) => setSettings((current) => ({ ...current, [key]: value }));
  return (
    <>
      <PageHeading title="Settings" description="Manage your profile, preferences, and account." />
      <div className="settings-grid">
        <section className="panel settings-panel">
          <h3>Profile settings</h3><p className="settings-intro">Update the personal details shown on your account.</p>
          <div className="form-stack">
            <label>Full name<input value={settings.name} onChange={(event) => update("name", event.target.value)} /></label>
            <label>Email address<input type="email" value={settings.email} onChange={(event) => update("email", event.target.value)} /></label>
          </div>
        </section>
        <section className="panel settings-panel">
          <h3>Account information</h3><p className="settings-intro">Your workspace access details.</p>
          <dl className="account-info"><div><dt>Account type</dt><dd>Administrator</dd></div><div><dt>Workspace</dt><dd>NexusPanel Demo</dd></div><div><dt>Member since</dt><dd>January 2025</dd></div></dl>
        </section>
        <section className="panel settings-panel">
          <h3>Notifications</h3><p className="settings-intro">Choose which updates you want to receive.</p>
          <div className="toggle-list">
            <SettingToggle label="Email notifications" description="Important account updates by email." checked={settings.emailNotifications} onChange={(value) => update("emailNotifications", value)} />
            <SettingToggle label="Order updates" description="Get notified about new and changed orders." checked={settings.orderNotifications} onChange={(value) => update("orderNotifications", value)} />
            <SettingToggle label="Weekly report" description="A weekly summary of your business metrics." checked={settings.weeklyReport} onChange={(value) => update("weeklyReport", value)} />
          </div>
        </section>
        <section className="panel settings-panel">
          <h3>Appearance</h3><p className="settings-intro">Set the dashboard color theme for this browser.</p>
          <label className="appearance-control">Color theme
            <select className="filter-select" value={settings.appearance} onChange={(event) => update("appearance", event.target.value)}><option>Light</option><option>Dark</option></select>
          </label>
        </section>
      </div>
    </>
  );
}

export default function ManagementPages({ page, products, setProducts, settings, setSettings }) {
  if (page === "Orders") return <OrdersPage />;
  if (page === "Products") return <ProductsPage products={products} setProducts={setProducts} />;
  if (page === "Customers") return <CustomersPage />;
  if (page === "Settings") return <SettingsPage settings={settings} setSettings={setSettings} />;
  return null;
}
