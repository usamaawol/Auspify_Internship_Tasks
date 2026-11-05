
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  Package,
  Settings,
  Menu,
  X,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  UserRound,
  Activity,
  Bell,
  Search,
  ArrowUpRight
} from "lucide-react";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";

import ManagementPages from "./pages/ManagementPages";
import {
  initialProducts,
  initialSettings
} from "./data/managementData";
import "./App.css";

// Dashboard sample data
const dashboardData = {
  week: {
    revenue: "ETB 45,800",
    orders: "248",
    users: "1,420",
    growth: "12.5%",
    chart: [
      { day: "Mon", revenue: 4200 },
      { day: "Tue", revenue: 5800 },
      { day: "Wed", revenue: 4600 },
      { day: "Thu", revenue: 7200 },
      { day: "Fri", revenue: 6500 },
      { day: "Sat", revenue: 8900 },
      { day: "Sun", revenue: 8600 }
    ]
  },

  month: {
    revenue: "ETB 186,500",
    orders: "1,024",
    users: "5,840",
    growth: "18.2%",
    chart: [
      { day: "Week 1", revenue: 32000 },
      { day: "Week 2", revenue: 41000 },
      { day: "Week 3", revenue: 52000 },
      { day: "Week 4", revenue: 61500 }
    ]
  },

  year: {
    revenue: "ETB 1.8M",
    orders: "12,480",
    users: "68,200",
    growth: "24.8%",
    chart: [
      { day: "Jan", revenue: 100000 },
      { day: "Feb", revenue: 125000 },
      { day: "Mar", revenue: 140000 },
      { day: "Apr", revenue: 130000 },
      { day: "May", revenue: 165000 },
      { day: "Jun", revenue: 190000 },
      { day: "Jul", revenue: 210000 },
      { day: "Aug", revenue: 225000 },
      { day: "Sep", revenue: 215000 },
      { day: "Oct", revenue: 250000 },
      { day: "Nov", revenue: 270000 },
      { day: "Dec", revenue: 300000 }
    ]
  }
};

// Traffic data
const trafficData = [
  { name: "Direct", value: 40 },
  { name: "Social Media", value: 30 },
  { name: "Search", value: 20 },
  { name: "Referral", value: 10 }
];

const trafficColors = [
  "#2563eb",
  "#16a34a",
  "#f59e0b",
  "#8b5cf6"
];

// Recent orders
const orders = [
  {
    id: "#ORD-1001",
    customer: "Abebe Kebede",
    product: "MacBook Pro",
    amount: "ETB 85,000",
    status: "Completed"
  },
  {
    id: "#ORD-1002",
    customer: "Sara Ahmed",
    product: "iPhone 15",
    amount: "ETB 65,000",
    status: "Pending"
  },
  {
    id: "#ORD-1003",
    customer: "Daniel Bekele",
    product: "Headphones",
    amount: "ETB 4,500",
    status: "Completed"
  },
  {
    id: "#ORD-1004",
    customer: "Hana Mohammed",
    product: "Smart Watch",
    amount: "ETB 6,500",
    status: "Cancelled"
  }
];

// Sidebar component
function Sidebar({ activePage, setActivePage, mobileOpen, setMobileOpen, profile }) {
  const menuItems = [
    { name: "Overview", icon: LayoutDashboard },
    { name: "Orders", icon: ShoppingBag },
    { name: "Products", icon: Package },
    { name: "Customers", icon: Users },
    { name: "Settings", icon: Settings }
  ];

  return (
    <>
      {mobileOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside className={`sidebar ${mobileOpen ? "sidebar-open" : ""}`}>
        <div className="brand">
          <div className="brand-icon">N</div>
          <span>Nexus<span className="brand-light">Panel</span></span>

          <button
            className="mobile-close"
            onClick={() => setMobileOpen(false)}
            aria-label="Close navigation"
          >
            <X size={20} />
          </button>
        </div>

        <p className="menu-label">MENU</p>

        <nav className="sidebar-menu">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.name}
                className={`menu-item ${
                  activePage === item.name ? "active" : ""
                }`}
                onClick={() => {
                  setActivePage(item.name);
                  setMobileOpen(false);
                }}
              >
                <Icon size={19} />
                <span>{item.name}</span>
              </button>
            );
          })}
        </nav>

        <div className="sidebar-bottom">
          <div className="help-card">
            <Activity size={22} />
            <h4>Dashboard Analytics</h4>
            <p>Monitor your business performance in one place.</p>
          </div>

          <div className="profile">
            <div className="avatar">{getInitials(profile.name)}</div>
            <div>
              <strong>{profile.name}</strong>
              <small>{profile.email}</small>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

// Reusable metric card
function MetricCard({ title, value, change, icon: Icon, positive }) {
  return (
    <div className="metric-card">
      <div className="metric-top">
        <div>
          <p>{title}</p>
          <h2>{value}</h2>
        </div>

        <div className="metric-icon">
          <Icon size={22} />
        </div>
      </div>

      <div className={`metric-change ${positive ? "positive" : "negative"}`}>
        {positive ? <TrendingUp size={15} /> : <TrendingDown size={15} />}
        <strong>{change}</strong>
        <span>vs previous period</span>
      </div>
    </div>
  );
}

// Revenue chart component
function RevenueChart({ data }) {
  return (
    <div className="panel chart-panel">
      <div className="panel-heading">
        <div>
          <h3>Revenue Overview</h3>
          <p>Revenue performance over time</p>
        </div>
        <span className="chart-badge">Revenue</span>
      </div>

      <div className="chart-container">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" vertical={false} />

            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
            />

            <YAxis
              tickLine={false}
              axisLine={false}
              width={55}
            />

            <Tooltip
              formatter={(value) => [
                `ETB ${value.toLocaleString()}`,
                "Revenue"
              ]}
            />

            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#2563eb"
              strokeWidth={3}
              fill="url(#revenueGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// Traffic chart component
function TrafficChart() {
  return (
    <div className="panel traffic-panel">
      <div className="panel-heading">
        <div>
          <h3>Traffic Sources</h3>
          <p>Where visitors come from</p>
        </div>
      </div>

      <div className="traffic-chart">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={trafficData}
              dataKey="value"
              nameKey="name"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={4}
            >
              {trafficData.map((entry, index) => (
                <Cell
                  key={entry.name}
                  fill={trafficColors[index]}
                />
              ))}
            </Pie>

            <Tooltip formatter={(value) => `${value}%`} />

            <Legend
              verticalAlign="bottom"
              height={45}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// Recent orders component
function RecentOrders({ onViewAll }) {
  return (
    <div className="panel orders-panel">
      <div className="panel-heading">
        <div>
          <h3>Recent Orders</h3>
          <p>Latest customer transactions</p>
        </div>

        <button className="view-all" onClick={onViewAll}>View all <ArrowUpRight size={15} /></button>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Product</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.customer}</td>
                <td>{order.product}</td>
                <td>{order.amount}</td>
                <td>
                  <span className={`status ${order.status.toLowerCase()}`}>
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Main dashboard
function App() {
  const [period, setPeriod] = useState("month");
  const [activePage, setActivePage] = useState("Overview");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [products, setProducts] = useState(() => loadSavedState("nexuspanel-products", initialProducts));
  const [settings, setSettings] = useState(() => loadSavedState("nexuspanel-settings", initialSettings));

  const currentData = dashboardData[period];

  useEffect(() => {
    saveState("nexuspanel-products", products);
  }, [products]);

  useEffect(() => {
    saveState("nexuspanel-settings", settings);
  }, [settings]);

  return (
    <div className={`app-layout ${settings.appearance === "Dark" ? "dark-theme" : ""}`}>
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        profile={settings}
      />

      <main className="main-content">
        <header className="topbar">
          <div className="topbar-left">
            <button
              className="mobile-menu"
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation"
            >
              <Menu size={22} />
            </button>

            <div>
              <p className="breadcrumb">Dashboard / {activePage}</p>
              <h1>{activePage}</h1>
            </div>
          </div>

          <div className="topbar-actions">
            <button className="icon-button" aria-label="Search">
              <Search size={19} />
            </button>

            <button className="icon-button notification" aria-label="Notifications">
              <Bell size={19} />
              <span />
            </button>

            <div className="topbar-avatar">{getInitials(settings.name)}</div>
          </div>
        </header>

        <section className="dashboard-content">
          {activePage === "Overview" ? (
            <>
          <div className="welcome-section">
            <div>
              <h2>Welcome back, User👋</h2>
              <p>Here's what's happening with your business today.</p>
            </div>

            <select
              value={period}
              onChange={(event) => setPeriod(event.target.value)}
              className="period-select"
              aria-label="Select reporting period"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
          </div>

          <div className="metrics-grid">
            <MetricCard
              title="Total Revenue"
              value={currentData.revenue}
              change={currentData.growth}
              icon={DollarSign}
              positive={true}
            />

            <MetricCard
              title="Total Orders"
              value={currentData.orders}
              change="8.4%"
              icon={ShoppingCart}
              positive={true}
            />

            <MetricCard
              title="Total Customers"
              value={currentData.users}
              change="6.2%"
              icon={UserRound}
              positive={true}
            />

            <MetricCard
              title="Conversion Rate"
              value="4.8%"
              change="2.1%"
              icon={Activity}
              positive={true}
            />
          </div>

          <div className="charts-grid">
            <RevenueChart data={currentData.chart} />
            <TrafficChart />
          </div>

          <RecentOrders onViewAll={() => setActivePage("Orders")} />

          <footer className="dashboard-footer">
            <p>© {new Date().getFullYear()} NexusPanel. All rights reserved.</p>
            <p>Built with React.</p>
          </footer>
            </>
          ) : (
            <ManagementPages
              page={activePage}
              products={products}
              setProducts={setProducts}
              settings={settings}
              setSettings={setSettings}
            />
          )}
        </section>
      </main>
    </div>
  );
}

function loadSavedState(key, fallback) {
  try {
    const saved = window.localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch (error) {
    console.error(`Unable to load ${key} from local storage.`, error);
    return fallback;
  }
}

function saveState(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Unable to save ${key} to local storage.`, error);
  }
}

function getInitials(name) {
  return name.trim().split(/\s+/).slice(0, 2).map((part) => part[0] || "").join("").toUpperCase();
}

export default App;
