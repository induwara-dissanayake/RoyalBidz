import React, { useState, useEffect } from "react";
import "./AdminDashboard.css";
import {
  Users,
  Gavel,
  DollarSign,
  TrendingUp,
  Clock,
  Eye,
  CheckCircle,
  AlertCircle,
  Crown,
  Star,
  MessageSquare,
  Share2,
  BarChart3,
  PieChart,
  Activity,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  Edit,
  Trash2,
  Plus,
  Search,
} from "lucide-react";

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalUsers: 0,
      totalAuctions: 0,
      totalBids: 0,
      totalRevenue: 0,
      activeAuctions: 0,
      pendingPayments: 0,
    },
    recentActivities: [],
    usersByRole: {},
    auctionsByStatus: {},
    bidActivity: [],
    revenueData: [],
    socialShares: [],
  });

  const [activeSection, setActiveSection] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState("30");
  const [searchTerm, setSearchTerm] = useState("");

  // CRUD States
  const [users, setUsers] = useState([]);
  const [auctions, setAuctions] = useState([]);
  const [payments, setPayments] = useState([]);
  const [inquiries, setInquiries] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, [dateRange]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      // Load dashboard statistics
      await Promise.all([
        loadStats(token),
        loadUsers(token),
        loadAuctions(token),
        loadPayments(token),
        loadInquiries(token),
        loadSocialShares(token),
      ]);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async (token) => {
    try {
      // Simulate API calls - replace with actual endpoints
      const responses = await Promise.all([
        fetch("/api/admin/stats/users", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("/api/admin/stats/auctions", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("/api/admin/stats/revenue", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("/api/reports/revenue", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      // For now, using mock data
      setDashboardData((prev) => ({
        ...prev,
        stats: {
          totalUsers: 1247,
          totalAuctions: 86,
          totalBids: 2341,
          totalRevenue: 145678.5,
          activeAuctions: 12,
          pendingPayments: 8,
        },
      }));
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };

  const loadUsers = async (token) => {
    try {
      const response = await fetch("/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error("Error loading users:", error);
    }
  };

  const loadAuctions = async (token) => {
    try {
      const response = await fetch("/api/auctions", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setAuctions(data.items || data);
      }
    } catch (error) {
      console.error("Error loading auctions:", error);
    }
  };

  const loadPayments = async (token) => {
    try {
      const response = await fetch("/api/payments/pending", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setPayments(data);
      }
    } catch (error) {
      console.error("Error loading payments:", error);
    }
  };

  const loadInquiries = async (token) => {
    try {
      const response = await fetch("/api/contact", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setInquiries(data);
      }
    } catch (error) {
      console.error("Error loading inquiries:", error);
    }
  };

  const loadSocialShares = async (token) => {
    try {
      const response = await fetch("/api/socialshare/stats", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setDashboardData((prev) => ({
          ...prev,
          socialShares: data,
        }));
      }
    } catch (error) {
      console.error("Error loading social shares:", error);
    }
  };

  const adminSections = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "users", label: "User Management", icon: Users },
    { id: "auctions", label: "Auction Management", icon: Gavel },
    { id: "payments", label: "Payment Management", icon: DollarSign },
    { id: "inquiries", label: "Contact Inquiries", icon: MessageSquare },
    { id: "analytics", label: "Analytics", icon: TrendingUp },
    { id: "social", label: "Social Shares", icon: Share2 },
  ];

  const StatCard = ({ title, value, icon: Icon, color, change, trend }) => (
    <div className="stat-card">
      <div className="stat-header">
        <div className="stat-icon" style={{ backgroundColor: color }}>
          <Icon size={24} />
        </div>
        <div className="stat-trend">
          {trend === "up" ? "📈" : trend === "down" ? "📉" : "➡️"}
          <span
            style={{
              color:
                trend === "up"
                  ? "#10b981"
                  : trend === "down"
                  ? "#ef4444"
                  : "#6b7280",
            }}
          >
            {change}
          </span>
        </div>
      </div>
      <div className="stat-content">
        <h3>{title}</h3>
        <p className="stat-value">{value}</p>
      </div>
    </div>
  );

  const renderOverview = () => (
    <div className="admin-overview">
      <div className="overview-header">
        <h2>Admin Dashboard Overview</h2>
        <div className="overview-controls">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="365">Last year</option>
          </select>
          <button onClick={loadDashboardData} className="refresh-btn">
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <StatCard
          title="Total Users"
          value={dashboardData.stats.totalUsers.toLocaleString()}
          icon={Users}
          color="#3b82f6"
          change="+12%"
          trend="up"
        />
        <StatCard
          title="Active Auctions"
          value={dashboardData.stats.activeAuctions}
          icon={Gavel}
          color="#10b981"
          change="+8%"
          trend="up"
        />
        <StatCard
          title="Total Bids"
          value={dashboardData.stats.totalBids.toLocaleString()}
          icon={TrendingUp}
          color="#f59e0b"
          change="+24%"
          trend="up"
        />
        <StatCard
          title="Revenue"
          value={`$${dashboardData.stats.totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          color="#10b981"
          change="+15%"
          trend="up"
        />
        <StatCard
          title="Pending Payments"
          value={dashboardData.stats.pendingPayments}
          icon={Clock}
          color="#ef4444"
          change="-5%"
          trend="down"
        />
        <StatCard
          title="Total Auctions"
          value={dashboardData.stats.totalAuctions}
          icon={Eye}
          color="#8b5cf6"
          change="+18%"
          trend="up"
        />
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="action-buttons">
          <button
            onClick={() => setActiveSection("users")}
            className="action-btn"
          >
            <Users size={16} />
            Manage Users
          </button>
          <button
            onClick={() => setActiveSection("auctions")}
            className="action-btn"
          >
            <Plus size={16} />
            Create Auction
          </button>
          <button
            onClick={() => setActiveSection("payments")}
            className="action-btn"
          >
            <DollarSign size={16} />
            Review Payments
          </button>
          <button
            onClick={() => setActiveSection("inquiries")}
            className="action-btn"
          >
            <MessageSquare size={16} />
            Handle Inquiries
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="recent-activity">
        <h3>Recent Platform Activity</h3>
        <div className="activity-list">
          <div className="activity-item">
            <div className="activity-icon user">
              <Users size={16} />
            </div>
            <div className="activity-content">
              <p>
                <strong>New user registered:</strong> john.doe@email.com
              </p>
              <span>2 minutes ago</span>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-icon auction">
              <Gavel size={16} />
            </div>
            <div className="activity-content">
              <p>
                <strong>Auction ended:</strong> Vintage Diamond Ring
              </p>
              <span>15 minutes ago</span>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-icon payment">
              <DollarSign size={16} />
            </div>
            <div className="activity-content">
              <p>
                <strong>Payment completed:</strong> $2,500.00
              </p>
              <span>1 hour ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderUserManagement = () => (
    <div className="admin-section">
      <div className="section-header">
        <h2>User Management</h2>
        <div className="section-controls">
          <div className="search-box">
            <Search size={16} />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="add-btn">
            <Plus size={16} />
            Add User
          </button>
        </div>
      </div>

      <div className="data-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Last Login</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users
              .filter(
                (user) =>
                  user.username
                    ?.toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                  user.email?.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`role-badge ${user.role?.toLowerCase()}`}>
                      {user.role}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`status-badge ${user.status?.toLowerCase()}`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td>{new Date(user.lastLogin).toLocaleDateString()}</td>
                  <td className="table-actions">
                    <button className="edit-btn">
                      <Edit size={14} />
                    </button>
                    <button className="delete-btn">
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderContent = () => {
    if (loading) {
      return (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading dashboard data...</p>
        </div>
      );
    }

    switch (activeSection) {
      case "overview":
        return renderOverview();
      case "users":
        return renderUserManagement();
      case "auctions":
        return (
          <div className="admin-section">
            <h2>Auction Management</h2>
            <p>Coming soon...</p>
          </div>
        );
      case "payments":
        return (
          <div className="admin-section">
            <h2>Payment Management</h2>
            <p>Coming soon...</p>
          </div>
        );
      case "inquiries":
        return (
          <div className="admin-section">
            <h2>Contact Inquiries</h2>
            <p>Coming soon...</p>
          </div>
        );
      case "analytics":
        return (
          <div className="admin-section">
            <h2>Analytics</h2>
            <p>Coming soon...</p>
          </div>
        );
      case "social":
        return (
          <div className="admin-section">
            <h2>Social Share Analytics</h2>
            <p>Coming soon...</p>
          </div>
        );
      default:
        return renderOverview();
    }
  };

  return (
    <div className="admin-dashboard">
      {/* Admin Navigation */}
      <div className="admin-nav">
        {adminSections.map((section) => {
          const Icon = section.icon;
          return (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`nav-btn ${
                activeSection === section.id ? "active" : ""
              }`}
            >
              <Icon size={18} />
              {section.label}
            </button>
          );
        })}
      </div>

      {/* Main Content */}
      <div className="admin-content">{renderContent()}</div>
    </div>
  );
};

export default AdminDashboard;
