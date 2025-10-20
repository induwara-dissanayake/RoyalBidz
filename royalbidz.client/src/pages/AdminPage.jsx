import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
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
  LogOut,
  Home,
  Settings,
} from "lucide-react";
import "./AdminPage.css";

const AdminPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [adminError, setAdminError] = useState("");
  const [dateRange, setDateRange] = useState("30");
  const [searchTerm, setSearchTerm] = useState("");
  const [auctionFilter, setAuctionFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");

  // Data states with real API integration
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

  // CRUD States
  const [users, setUsers] = useState([]);
  const [auctions, setAuctions] = useState([]);
  const [payments, setPayments] = useState([]);
  const [inquiries, setInquiries] = useState([]);

  // Analytics states
  const [analyticsData, setAnalyticsData] = useState({
    revenue: {},
    platform: {},
    loading: true,
  });

  // Generic API fetch helper with dev-friendly fallbacks.
  const apiFetch = async (path, opts = {}) => {
    console.log("apiFetch: trying", path);
    try {
      let res = await fetch(path, opts).catch((e) => {
        console.error("apiFetch proxy error", e);
        return null;
      });

      // If successful return immediately
      if (res && res.ok) return res;

      // In development try direct backend and then debug endpoints
      if (import.meta && import.meta.env && import.meta.env.DEV) {
        const backend = "http://localhost:5242";
        try {
          console.log("apiFetch: retrying direct backend", backend + path);
          const direct = await fetch(backend + path, opts).catch(() => null);
          if (direct && direct.ok) return direct;
        } catch (e) {
          console.error("apiFetch direct error", e);
        }

        // If admin endpoints fail, try the anonymous debug endpoints for faster local debugging
        try {
          if (path.startsWith("/api/admin/payments")) {
            console.log("apiFetch: falling back to /api/admin/debug/payments");
            const dbg = await fetch("/api/admin/debug/payments");
            return dbg;
          }
          if (path.startsWith("/api/admin/auctions")) {
            console.log("apiFetch: falling back to /api/admin/debug/auctions");
            const dbg = await fetch("/api/admin/debug/auctions");
            return dbg;
          }
        } catch (e) {
          console.error("apiFetch debug fallback error", e);
        }
      }

      return res;
    } catch (e) {
      console.error("apiFetch unexpected error", e);
      return null;
    }
  };

  // Check if user is admin
  useEffect(() => {
    if (
      !user ||
      (user.Role !== 2 && user.role !== 2 && user.Role !== "Admin")
    ) {
      navigate("/profile");
      return;
    }
    loadDashboardData();
  }, [user, navigate, dateRange]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setAdminError(
          "No auth token found. Make sure you're logged in as an admin."
        );
        setLoading(false);
        return;
      }

      await Promise.all([
        loadStats(token),
        loadUsers(token),
        loadAuctions(token),
        loadPayments(token),
        loadInquiries(token),
        loadSocialShares(token),
        loadRecentActivity(token),
        loadAnalyticsData(token),
      ]);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async (token) => {
    try {
      const response = await fetch("/api/admin/stats", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setDashboardData((prev) => ({ ...prev, stats: data }));
      }
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };

  const loadUsers = async (token) => {
    try {
      const response = await fetch("/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || data);
      }
    } catch (error) {
      console.error("Error loading users:", error);
    }
  };

  const loadAuctions = async (token) => {
    try {
      setAdminError("");
      // Fetch auctions for admin, support filtering by status
      const qs =
        auctionFilter && auctionFilter !== "all"
          ? `?status=${encodeURIComponent(auctionFilter)}`
          : "";
      const apiFetch = async (path, opts = {}) => {
        // Try proxied path first
        console.log("apiFetch: trying", path);
        let res = await fetch(path, opts).catch((e) => {
          console.error("apiFetch proxy error", e);
          return null;
        });
        if (!res || !res.ok) {
          // If unauthorized or not found, retry direct backend URL for diagnostics
          const backend = "http://localhost:5242";
          try {
            console.log("apiFetch: retrying direct backend", backend + path);
            res = await fetch(backend + path, opts);
          } catch (e) {
            console.error("apiFetch direct error", e);
            return res;
          }
        }
        return res;
      };

      const response = await apiFetch(`/api/admin/auctions${qs}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response || !response.ok) {
        const body = response
          ? await response.text().catch(() => "")
          : "(no response)";
        const status = response ? response.status : "(no response)";
        console.error("Auctions fetch failed", status, body);
        setAdminError(`Auctions fetch failed: ${status} ${body}`);
        setAuctions([]);
        return;
      }
      if (response.ok) {
        const data = await response.json();
        console.log("Auctions data received:", data); // Debug log
        // Map the API response to match frontend expectations
        const mappedAuctions = data.map((auction) => ({
          Id: auction.Id || auction.id,
          Title: auction.Title || auction.title,
          StartingBid: auction.StartingBid || auction.startingBid,
          StartTime: auction.StartTime || auction.startTime,
          Status: auction.Status || auction.status,
          Seller: {
            Username:
              auction.Seller?.Username || auction.seller?.username || "Unknown",
          },
          JewelryItem: auction.JewelryItem || auction.jewelryItem,
        }));
        setAuctions(mappedAuctions);
      }
    } catch (error) {
      console.error("Error loading auctions:", error);
      // Set empty array on error to prevent crashes
      setAuctions([]);
    }
  };

  const loadPayments = async (token) => {
    try {
      setAdminError("");
      // Fetch payments for admin, support filtering by status
      const qs =
        paymentFilter && paymentFilter !== "all"
          ? `?status=${encodeURIComponent(paymentFilter)}`
          : "";
      const response = await apiFetch(`/api/admin/payments${qs}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response || !response.ok) {
        const body = response
          ? await response.text().catch(() => "")
          : "(no response)";
        const status = response ? response.status : "(no response)";
        console.error("Payments fetch failed", status, body);
        setAdminError(`Payments fetch failed: ${status} ${body}`);
        setPayments([]);
        return;
      }
      if (response.ok) {
        const data = await response.json();
        console.log("Payments data received:", data); // Debug log
        // Map the API response to match frontend expectations
        const mappedPayments = data.map((payment) => ({
          Id: payment.Id || payment.id,
          Amount: payment.Amount || payment.amount,
          Status: payment.Status || payment.status,
          ProcessedDate: payment.ProcessedDate || payment.processedDate,
          User: {
            Username:
              payment.User?.Username || payment.user?.username || "Unknown",
            Email: payment.User?.Email || payment.user?.email || "Unknown",
          },
          Auction: {
            Title:
              payment.Auction?.Title || payment.auction?.title || "Unknown",
            Id: payment.Auction?.Id || payment.auction?.id,
          },
        }));
        setPayments(mappedPayments);
      }
    } catch (error) {
      console.error("Error loading payments:", error);
      setPayments([]);
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
        setDashboardData((prev) => ({ ...prev, socialShares: data }));
      }
    } catch (error) {
      console.error("Error loading social shares:", error);
    }
  };

  const loadRecentActivity = async (token) => {
    try {
      const response = await fetch("/api/admin/activity", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setDashboardData((prev) => ({ ...prev, recentActivities: data }));
      }
    } catch (error) {
      console.error("Error loading recent activity:", error);
    }
  };

  const loadAnalyticsData = async (token) => {
    try {
      const [revenueRes, platformRes] = await Promise.all([
        fetch("/api/admin/analytics/revenue", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("/api/admin/analytics/platform", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const revenueData = revenueRes.ok ? await revenueRes.json() : {};
      const platformData = platformRes.ok ? await platformRes.json() : {};

      setAnalyticsData({
        revenue: revenueData,
        platform: platformData,
        loading: false,
      });
    } catch (error) {
      console.error("Error loading analytics:", error);
      setAnalyticsData((prev) => ({ ...prev, loading: false }));
    }
  };

  const updateUserStatus = async (userId, status) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/admin/users/${userId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        await loadUsers(token);
      }
    } catch (error) {
      console.error("Error updating user status:", error);
    }
  };

  const deleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`/api/admin/users/${userId}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          await loadUsers(token);
        }
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  const approveAuction = async (auctionId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/admin/auctions/${auctionId}/approve`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        await loadAuctions(token);
      }
    } catch (error) {
      console.error("Error approving auction:", error);
    }
  };

  const rejectAuction = async (auctionId, reason) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/admin/auctions/${auctionId}/reject`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reason }),
      });

      if (response.ok) {
        await loadAuctions(token);
      }
    } catch (error) {
      console.error("Error rejecting auction:", error);
    }
  };

  const verifyPayment = async (paymentId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/admin/payments/${paymentId}/verify`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        await loadPayments(token);
      }
    } catch (error) {
      console.error("Error verifying payment:", error);
    }
  };

  const adminSections = [
    { id: "overview", label: "Dashboard Overview", icon: BarChart3 },
    { id: "users", label: "User Management", icon: Users },
    { id: "auctions", label: "Auction Management", icon: Gavel },
    { id: "payments", label: "Payment Management", icon: DollarSign },
    { id: "inquiries", label: "Contact Inquiries", icon: MessageSquare },
    { id: "analytics", label: "Analytics & Reports", icon: TrendingUp },
  ];

  const StatCard = ({ title, value, icon: Icon, color, change, trend }) => (
    <div className="admin-stat-card">
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
            <Gavel size={16} />
            Review Auctions
          </button>
          <button
            onClick={() => setActiveSection("payments")}
            className="action-btn"
          >
            <DollarSign size={16} />
            Verify Payments
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

      <div className="recent-activity">
        <h3>Recent Platform Activity</h3>
        <div className="activity-list">
          {dashboardData.recentActivities.length > 0 ? (
            dashboardData.recentActivities.map((activity, index) => (
              <div key={index} className="activity-item">
                <div className={`activity-icon ${activity.Type}`}>
                  {activity.Type === "user_registered" && <Users size={16} />}
                  {activity.Type === "auction_ended" && <Gavel size={16} />}
                  {activity.Type === "payment_completed" && (
                    <DollarSign size={16} />
                  )}
                </div>
                <div className="activity-content">
                  <p>
                    <strong>{activity.Description}</strong>
                  </p>
                  <span>{new Date(activity.Timestamp).toLocaleString()}</span>
                </div>
              </div>
            ))
          ) : (
            <p>No recent activity</p>
          )}
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
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users
              .filter(
                (user) =>
                  user.Username?.toLowerCase().includes(
                    searchTerm.toLowerCase()
                  ) ||
                  user.Email?.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((user) => (
                <tr key={user.Id}>
                  <td>{user.Id}</td>
                  <td>{user.Username}</td>
                  <td>{user.Email}</td>
                  <td>
                    <span className={`role-badge ${user.Role?.toLowerCase()}`}>
                      {user.Role}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`status-badge ${user.Status?.toLowerCase()}`}
                    >
                      {user.Status}
                    </span>
                  </td>
                  <td>{new Date(user.CreatedAt).toLocaleDateString()}</td>
                  <td className="table-actions">
                    <select
                      value={user.Status}
                      onChange={(e) =>
                        updateUserStatus(user.Id, e.target.value)
                      }
                      className="status-select"
                    >
                      <option value="Active">Active</option>
                      <option value="Suspended">Suspended</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                    <button
                      className="delete-btn"
                      onClick={() => deleteUser(user.Id)}
                    >
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

  const renderAuctionManagement = () => (
    <div className="admin-section">
      <div className="section-header">
        <h2>Auction Management</h2>
        <button
          onClick={() => {
            const token = localStorage.getItem("token");
            loadAuctions(token);
          }}
          className="refresh-btn"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
        <div style={{ display: "flex", gap: "12px", margin: "8px 0" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            Status:
            <select
              value={auctionFilter}
              onChange={(e) => {
                setAuctionFilter(e.target.value);
                const token = localStorage.getItem("token");
                loadAuctions(token);
              }}
            >
              <option value="all">All</option>
              <option value="Draft">Pending (Draft)</option>
              <option value="Active">Active</option>
              <option value="Ended">Ended</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </label>
          <button
            onClick={() => {
              const token = localStorage.getItem("token");
              loadAuctions(token);
            }}
            className="refresh-btn"
          >
            <RefreshCw size={14} /> Refresh
          </button>
        </div>
      </div>

      <div className="data-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Seller</th>
              <th>Starting Bid</th>
              <th>Start Time</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {auctions.length > 0 ? (
              auctions.map((auction) => (
                <tr key={auction.Id || auction.id}>
                  <td>{auction.Id || auction.id}</td>
                  <td>{auction.Title || auction.title || "N/A"}</td>
                  <td>
                    {auction.Seller?.Username ||
                      auction.sellerUsername ||
                      "Unknown"}
                  </td>
                  <td>${auction.StartingBid || auction.startingBid || 0}</td>
                  <td>
                    {auction.StartTime || auction.startTime
                      ? new Date(
                          auction.StartTime || auction.startTime
                        ).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td>
                    <span
                      className={`status-badge ${(
                        auction.Status ||
                        auction.status ||
                        "pending"
                      )?.toLowerCase()}`}
                    >
                      {auction.Status || auction.status || "Pending"}
                    </span>
                  </td>
                  <td className="table-actions">
                    <button
                      className="approve-btn"
                      onClick={() => approveAuction(auction.Id || auction.id)}
                    >
                      ✓ Approve
                    </button>
                    <button
                      className="reject-btn"
                      onClick={() => {
                        const reason = prompt("Rejection reason:");
                        if (reason)
                          rejectAuction(auction.Id || auction.id, reason);
                      }}
                    >
                      ✗ Reject
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
                  style={{ textAlign: "center", padding: "20px" }}
                >
                  No auctions found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderPaymentManagement = () => (
    <div className="admin-section">
      <div className="section-header">
        <h2>Payment Management</h2>
        <button
          onClick={() => {
            const token = localStorage.getItem("token");
            loadPayments(token);
          }}
          className="refresh-btn"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            Status:
            <select
              value={paymentFilter}
              onChange={(e) => {
                setPaymentFilter(e.target.value);
                const token = localStorage.getItem("token");
                loadPayments(token);
              }}
            >
              <option value="all">All</option>
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Completed">Completed</option>
              <option value="Failed">Failed</option>
            </select>
          </label>
          <button
            onClick={() => {
              const token = localStorage.getItem("token");
              loadPayments(token);
            }}
            className="refresh-btn"
          >
            <RefreshCw size={14} /> Refresh
          </button>
        </div>
      </div>

      <div className="data-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>User</th>
              <th>Auction</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {payments.length > 0 ? (
              payments.map((payment) => (
                <tr key={payment.Id}>
                  <td>{payment.Id}</td>
                  <td>{payment.User?.Username || "Unknown"}</td>
                  <td>{payment.Auction?.Title || "Unknown"}</td>
                  <td>${payment.Amount?.toFixed(2) || "0.00"}</td>
                  <td>
                    <span
                      className={`status-badge ${
                        payment.Status?.toLowerCase() || "pending"
                      }`}
                    >
                      {payment.Status || "Pending"}
                    </span>
                  </td>
                  <td className="table-actions">
                    <button
                      className="verify-btn"
                      onClick={() => verifyPayment(payment.Id)}
                    >
                      ✓ Verify
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  style={{ textAlign: "center", padding: "20px" }}
                >
                  No pending payments found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderInquiriesManagement = () => (
    <div className="admin-section">
      <div className="section-header">
        <h2>Contact Inquiries</h2>
      </div>

      <div className="data-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Subject</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {inquiries.map((inquiry) => (
              <tr key={inquiry.id}>
                <td>{inquiry.id}</td>
                <td>{inquiry.name}</td>
                <td>{inquiry.email}</td>
                <td>{inquiry.subject}</td>
                <td>
                  <span
                    className={`status-badge ${
                      inquiry.status?.toLowerCase() || "pending"
                    }`}
                  >
                    {inquiry.status || "Pending"}
                  </span>
                </td>
                <td>
                  {new Date(
                    inquiry.createdAt || inquiry.CreatedAt
                  ).toLocaleDateString()}
                </td>
                <td className="table-actions">
                  <button className="approve-btn">✓ Respond</button>
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

  const renderAnalytics = () => {
    if (analyticsData.loading) {
      return (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading analytics...</p>
        </div>
      );
    }

    return (
      <div className="admin-section">
        <div className="section-header">
          <h2>Analytics & Reports</h2>
        </div>

        <div className="analytics-grid">
          <div className="analytics-card">
            <h3>Platform Overview</h3>
            <div className="analytics-stats">
              <div className="analytics-stat">
                <span className="stat-label">User Engagement Rate</span>
                <span className="stat-value">
                  {analyticsData.platform.userEngagementRate?.toFixed(1) || "0"}
                  %
                </span>
              </div>
              <div className="analytics-stat">
                <span className="stat-label">Auction Completion Rate</span>
                <span className="stat-value">
                  {analyticsData.platform.completionRate?.toFixed(1) || "0"}%
                </span>
              </div>
              <div className="analytics-stat">
                <span className="stat-label">Avg Bids per Auction</span>
                <span className="stat-value">
                  {analyticsData.platform.avgBidsPerAuction || "0"}
                </span>
              </div>
            </div>
          </div>

          <div className="analytics-card">
            <h3>Revenue Trends</h3>
            <div className="analytics-stats">
              <div className="analytics-stat">
                <span className="stat-label">Total Revenue</span>
                <span className="stat-value">
                  ${analyticsData.revenue.totalRevenue?.toLocaleString() || "0"}
                </span>
              </div>
              <div className="analytics-stat">
                <span className="stat-label">Total Transactions</span>
                <span className="stat-value">
                  {analyticsData.revenue.totalTransactions || "0"}
                </span>
              </div>
            </div>
          </div>

          <div className="analytics-card">
            <h3>Top Categories</h3>
            <div className="category-list">
              {analyticsData.platform.topCategories?.map((category, index) => (
                <div key={index} className="category-item">
                  <span className="category-name">{category.Category}</span>
                  <span className="category-count">{category.Count} items</span>
                  <span className="category-value">
                    ${category.AvgValue?.toFixed(0) || "0"} avg
                  </span>
                </div>
              )) || <p>No category data available</p>}
            </div>
          </div>
        </div>
      </div>
    );
  };

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
        return renderAuctionManagement();
      case "payments":
        return renderPaymentManagement();
      case "inquiries":
        return renderInquiriesManagement();
      case "analytics":
        return renderAnalytics();
      default:
        return renderOverview();
    }
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      logout();
      navigate("/");
    }
  };

  return (
    <div className="admin-page">
      {/* Admin Header */}
      <header className="admin-header">
        <div className="admin-header-content">
          <div className="admin-logo">
            <Crown size={32} />
            <h1>RoyalBidz Admin</h1>
          </div>
          <div className="admin-header-actions">
            <button onClick={() => navigate("/profile")} className="header-btn">
              <Home size={16} />
              Back to Profile
            </button>
            <button onClick={handleLogout} className="header-btn logout">
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="admin-layout">
        {/* Admin Sidebar */}
        <aside
          className="admin-sidebar"
          style={{
            background: "#000000",
            backgroundImage: "none",
            color: "#ffffff",
          }}
        >
          <nav
            className="admin-nav"
            style={{
              background: "transparent",
              backgroundImage: "none",
              color: "#ffffff",
            }}
          >
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
          </nav>
        </aside>

        {/* Main Content */}
        <main className="admin-main">
          {adminError && (
            <div
              style={{
                margin: "12px 0",
                padding: "12px",
                background: "#fff3f3",
                color: "#9b2c2c",
                border: "1px solid #f5c2c2",
                borderRadius: 8,
              }}
            >
              <strong>API Error:</strong> {adminError}
            </div>
          )}
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminPage;
