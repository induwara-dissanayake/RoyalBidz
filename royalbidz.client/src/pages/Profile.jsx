import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  User,
  DollarSign,
  Gavel,
  Clock,
  TrendingUp,
  Activity,
  Bell,
  Settings,
  CreditCard,
  Plus,
  Edit3,
  Save,
  Trash2,
  CheckCircle,
  Crown,
  Star,
  LogOut,
} from "lucide-react";

// Helper function for status colors
const getStatusColor = (status) => {
  switch (status) {
    case "won":
      return "#10b981";
    case "outbid":
      return "#f59e0b";
    case "lost":
      return "#ef4444";
    case "active":
      return "#3b82f6";
    default:
      return "#6b7280";
  }
};

// Reusable components
const StatCard = ({ icon: Icon, label, value, change, color }) => (
  <div
    style={{
      background: "white",
      borderRadius: "16px",
      padding: "24px",
      boxShadow: "0 4px 16px rgba(0, 0, 0, 0.08)",
      border: "1px solid #f3f4f6",
    }}
  >
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: "16px",
      }}
    >
      <div
        style={{
          width: "48px",
          height: "48px",
          borderRadius: "12px",
          background: `${color}15`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: color,
        }}
      >
        <Icon size={24} />
      </div>
      {change && (
        <span
          style={{
            fontSize: "12px",
            fontWeight: "500",
            color: change.startsWith("+") ? "#10b981" : "#ef4444",
            background: change.startsWith("+") ? "#10b98115" : "#ef444415",
            padding: "4px 8px",
            borderRadius: "6px",
          }}
        >
          {change}
        </span>
      )}
    </div>
    <div style={{ fontSize: "14px", color: "#6b7280", marginBottom: "4px" }}>
      {label}
    </div>
    <div style={{ fontSize: "24px", fontWeight: "bold", color: "#1f2937" }}>
      {value}
    </div>
  </div>
);

const ActivityCard = ({ activity }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: "16px",
      padding: "16px",
      borderRadius: "12px",
      backgroundColor: "#f9fafb",
      border: "1px solid #f3f4f6",
    }}
  >
    <div
      style={{
        width: "40px",
        height: "40px",
        borderRadius: "10px",
        background: `${activity.color}15`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: activity.color,
      }}
    >
      <activity.icon size={20} />
    </div>
    <div style={{ flex: 1 }}>
      <div style={{ fontWeight: "500", color: "#1f2937", fontSize: "14px" }}>
        {activity.action}
      </div>
      <div style={{ fontSize: "12px", color: "#6b7280" }}>{activity.time}</div>
    </div>
    <div style={{ fontSize: "14px", fontWeight: "600", color: "#1f2937" }}>
      {activity.amount}
    </div>
  </div>
);

// Tab content components
const AccountDetailsTab = ({
  profileData,
  setProfileData,
  isEditing,
  setIsEditing,
}) => {
  const [formData, setFormData] = useState(profileData);

  const handleSave = () => {
    setProfileData(formData);
    setIsEditing(false);
  };

  return (
    <div
      style={{
        background: "white",
        borderRadius: "16px",
        padding: "32px",
        boxShadow: "0 4px 16px rgba(0, 0, 0, 0.08)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "32px",
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: "1.5rem",
            fontWeight: "600",
            color: "#1f2937",
          }}
        >
          Account Details
        </h2>
        <button
          onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
          style={{
            background: isEditing ? "#10b981" : "#E0AF62",
            color: "white",
            border: "none",
            borderRadius: "8px",
            padding: "8px 16px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "14px",
            fontWeight: "500",
          }}
        >
          {isEditing ? <Save size={16} /> : <Edit3 size={16} />}
          {isEditing ? "Save Changes" : "Edit Profile"}
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "24px",
        }}
      >
        <div>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              fontSize: "14px",
              fontWeight: "500",
              color: "#374151",
            }}
          >
            Username
          </label>
          <input
            type="text"
            value={formData.username}
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
            disabled={!isEditing}
            style={{
              width: "100%",
              padding: "12px 16px",
              border: "2px solid #e5e7eb",
              borderRadius: "8px",
              fontSize: "14px",
              backgroundColor: isEditing ? "white" : "#f9fafb",
              color: "#2d3748",
            }}
          />
        </div>

        <div>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              fontSize: "14px",
              fontWeight: "500",
              color: "#374151",
            }}
          >
            Email Address
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            disabled={!isEditing}
            style={{
              width: "100%",
              padding: "12px 16px",
              border: "2px solid #e5e7eb",
              borderRadius: "8px",
              fontSize: "14px",
              backgroundColor: isEditing ? "white" : "#f9fafb",
              color: "#2d3748",
            }}
          />
        </div>

        <div>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              fontSize: "14px",
              fontWeight: "500",
              color: "#374151",
            }}
          >
            Phone Number
          </label>
          <input
            type="tel"
            value={formData.phoneNumber}
            onChange={(e) =>
              setFormData({ ...formData, phoneNumber: e.target.value })
            }
            disabled={!isEditing}
            style={{
              width: "100%",
              padding: "12px 16px",
              border: "2px solid #e5e7eb",
              borderRadius: "8px",
              fontSize: "14px",
              backgroundColor: isEditing ? "white" : "#f9fafb",
              color: "#2d3748",
            }}
          />
        </div>

        <div>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              fontSize: "14px",
              fontWeight: "500",
              color: "#374151",
            }}
          >
            Account Type
          </label>
          <select
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            disabled={!isEditing}
            style={{
              width: "100%",
              padding: "12px 16px",
              border: "2px solid #e5e7eb",
              borderRadius: "8px",
              fontSize: "14px",
              backgroundColor: isEditing ? "white" : "#f9fafb",
              color: "#2d3748",
            }}
          >
            <option value="Buyer">Buyer</option>
            <option value="Seller">Seller</option>
          </select>
        </div>
      </div>
    </div>
  );
};

const BidHistoryTab = ({ bidHistory }) => (
  <div
    style={{
      background: "white",
      borderRadius: "16px",
      padding: "32px",
      boxShadow: "0 4px 16px rgba(0, 0, 0, 0.08)",
    }}
  >
    <h2
      style={{
        margin: "0 0 24px 0",
        fontSize: "1.5rem",
        fontWeight: "600",
        color: "#1f2937",
      }}
    >
      Bid History
    </h2>
    <div style={{ display: "grid", gap: "16px" }}>
      {bidHistory.map((bid) => (
        <div
          key={bid.id}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            padding: "20px",
            border: "1px solid #f3f4f6",
            borderRadius: "12px",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#f9fafb";
            e.currentTarget.style.borderColor = "#E0AF62";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
            e.currentTarget.style.borderColor = "#f3f4f6";
          }}
        >
          <img
            src={bid.image}
            alt={bid.auctionTitle}
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "8px",
              objectFit: "cover",
            }}
          />
          <div style={{ flex: 1 }}>
            <h3
              style={{
                margin: "0 0 8px 0",
                fontSize: "1.1rem",
                fontWeight: "600",
                color: "#1f2937",
              }}
            >
              {bid.auctionTitle}
            </h3>
            <div style={{ display: "flex", gap: "16px", marginBottom: "8px" }}>
              <span style={{ fontSize: "14px", color: "#6b7280" }}>
                Your Bid:{" "}
                <strong>
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(bid.myBid)}
                </strong>
              </span>
              <span style={{ fontSize: "14px", color: "#6b7280" }}>
                Current:{" "}
                <strong>
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(bid.currentBid)}
                </strong>
              </span>
            </div>
            <div style={{ fontSize: "14px", color: "#6b7280" }}>
              Ends: {new Date(bid.endTime).toLocaleDateString()}
            </div>
          </div>
          <div
            style={{
              padding: "6px 12px",
              borderRadius: "20px",
              fontSize: "12px",
              fontWeight: "500",
              color: getStatusColor(bid.status),
              backgroundColor: `${getStatusColor(bid.status)}15`,
              textTransform: "capitalize",
            }}
          >
            {bid.status}
          </div>
        </div>
      ))}
    </div>
  </div>
);

const PaymentHistoryTab = ({ paymentHistory }) => (
  <div
    style={{
      background: "white",
      borderRadius: "16px",
      padding: "32px",
      boxShadow: "0 4px 16px rgba(0, 0, 0, 0.08)",
    }}
  >
    <h2
      style={{
        margin: "0 0 24px 0",
        fontSize: "1.5rem",
        fontWeight: "600",
        color: "#1f2937",
      }}
    >
      Payment History
    </h2>
    <div style={{ display: "grid", gap: "16px" }}>
      {paymentHistory.map((payment) => (
        <div
          key={payment.id}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "20px",
            border: "1px solid #f3f4f6",
            borderRadius: "12px",
            transition: "background-color 0.2s ease",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "#f9fafb")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "transparent")
          }
        >
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                background: "#10b98115",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#10b981",
              }}
            >
              <CheckCircle size={24} />
            </div>
            <div>
              <h3
                style={{
                  margin: "0 0 4px 0",
                  fontSize: "1rem",
                  fontWeight: "600",
                  color: "#1f2937",
                }}
              >
                {payment.auctionTitle}
              </h3>
              <div
                style={{
                  fontSize: "14px",
                  color: "#6b7280",
                  marginBottom: "4px",
                }}
              >
                {payment.paymentMethod}
              </div>
              <div style={{ fontSize: "12px", color: "#6b7280" }}>
                {new Date(payment.date).toLocaleDateString()}
              </div>
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div
              style={{
                fontSize: "1.1rem",
                fontWeight: "600",
                color: "#1f2937",
              }}
            >
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(payment.amount)}
            </div>
            <div
              style={{
                fontSize: "12px",
                fontWeight: "500",
                color: "#10b981",
                textTransform: "uppercase",
              }}
            >
              {payment.status}
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const PaymentMethodsTab = ({ paymentMethods }) => (
  <div
    style={{
      background: "white",
      borderRadius: "16px",
      padding: "32px",
      boxShadow: "0 4px 16px rgba(0, 0, 0, 0.08)",
    }}
  >
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: "24px",
      }}
    >
      <h2
        style={{
          margin: 0,
          fontSize: "1.5rem",
          fontWeight: "600",
          color: "#1f2937",
        }}
      >
        Payment Methods
      </h2>
      <button
        style={{
          background: "#E0AF62",
          color: "white",
          border: "none",
          borderRadius: "8px",
          padding: "8px 16px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          fontSize: "14px",
          fontWeight: "500",
        }}
      >
        <Plus size={16} />
        Add Payment Method
      </button>
    </div>
    <div style={{ display: "grid", gap: "16px" }}>
      {paymentMethods.map((method) => (
        <div
          key={method.id}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "20px",
            border: method.isDefault
              ? "2px solid #E0AF62"
              : "1px solid #f3f4f6",
            borderRadius: "12px",
            backgroundColor: method.isDefault ? "#FEF7ED" : "transparent",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                background: "#E0AF6215",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#E0AF62",
              }}
            >
              <CreditCard size={24} />
            </div>
            <div>
              <div
                style={{
                  fontWeight: "600",
                  color: "#1f2937",
                  marginBottom: "4px",
                }}
              >
                {method.type} {method.brand && `(${method.brand})`}
              </div>
              <div style={{ fontSize: "14px", color: "#6b7280" }}>
                {method.last4 ? `****${method.last4}` : method.email}
                {method.expiry && ` • Expires ${method.expiry}`}
              </div>
              {method.isDefault && (
                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: "500",
                    color: "#E0AF62",
                    textTransform: "uppercase",
                  }}
                >
                  Default
                </span>
              )}
            </div>
          </div>
          <button
            style={{
              background: "none",
              border: "none",
              color: "#ef4444",
              cursor: "pointer",
              padding: "8px",
            }}
          >
            <Trash2 size={16} />
          </button>
        </div>
      ))}
    </div>
  </div>
);

const ActivityTab = ({ recentActivity }) => (
  <div
    style={{
      background: "white",
      borderRadius: "16px",
      padding: "32px",
      boxShadow: "0 4px 16px rgba(0, 0, 0, 0.08)",
    }}
  >
    <h2
      style={{
        margin: "0 0 24px 0",
        fontSize: "1.5rem",
        fontWeight: "600",
        color: "#1f2937",
      }}
    >
      Recent Activity
    </h2>
    <div style={{ display: "grid", gap: "12px" }}>
      {recentActivity.map((activity, index) => (
        <ActivityCard key={index} activity={activity} />
      ))}
    </div>
  </div>
);

const SettingsTab = () => (
  <div style={{ display: "grid", gap: "24px" }}>
    {/* Notification Settings */}
    <div
      style={{
        background: "white",
        borderRadius: "16px",
        padding: "32px",
        boxShadow: "0 4px 16px rgba(0, 0, 0, 0.08)",
      }}
    >
      <h3
        style={{
          margin: "0 0 24px 0",
          fontSize: "1.25rem",
          fontWeight: "600",
          color: "#1f2937",
        }}
      >
        Notification Preferences
      </h3>
      <div style={{ display: "grid", gap: "16px" }}>
        {[
          { label: "Email notifications for new bids", checked: true },
          { label: "SMS alerts for auction endings", checked: false },
          { label: "Weekly activity summary", checked: true },
          { label: "Marketing emails", checked: false },
        ].map((setting, index) => (
          <label
            key={index}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              defaultChecked={setting.checked}
              style={{ width: "18px", height: "18px", accentColor: "#E0AF62" }}
            />
            <span style={{ fontSize: "14px", color: "#374151" }}>
              {setting.label}
            </span>
          </label>
        ))}
      </div>
    </div>

    {/* Security Settings */}
    <div
      style={{
        background: "white",
        borderRadius: "16px",
        padding: "32px",
        boxShadow: "0 4px 16px rgba(0, 0, 0, 0.08)",
      }}
    >
      <h3
        style={{
          margin: "0 0 24px 0",
          fontSize: "1.25rem",
          fontWeight: "600",
          color: "#1f2937",
        }}
      >
        Security Settings
      </h3>
      <div style={{ display: "grid", gap: "16px" }}>
        <button
          style={{
            background: "#E0AF62",
            color: "white",
            border: "none",
            borderRadius: "8px",
            padding: "12px 20px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "500",
            justifySelf: "start",
          }}
        >
          Change Password
        </button>
        <button
          style={{
            background: "#f3f4f6",
            color: "#374151",
            border: "none",
            borderRadius: "8px",
            padding: "12px 20px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "500",
            justifySelf: "start",
          }}
        >
          Enable Two-Factor Authentication
        </button>
      </div>
    </div>

    {/* Danger Zone */}
    <div
      style={{
        background: "white",
        borderRadius: "16px",
        padding: "32px",
        boxShadow: "0 4px 16px rgba(0, 0, 0, 0.08)",
        border: "1px solid #fecaca",
      }}
    >
      <h3
        style={{
          margin: "0 0 16px 0",
          fontSize: "1.25rem",
          fontWeight: "600",
          color: "#dc2626",
        }}
      >
        Danger Zone
      </h3>
      <p style={{ margin: "0 0 16px 0", fontSize: "14px", color: "#6b7280" }}>
        Once you delete your account, there is no going back. Please be certain.
      </p>
      <button
        style={{
          background: "#dc2626",
          color: "white",
          border: "none",
          borderRadius: "8px",
          padding: "12px 20px",
          cursor: "pointer",
          fontSize: "14px",
          fontWeight: "500",
        }}
      >
        Delete Account
      </button>
    </div>
  </div>
);

const AuctionsTab = ({ navigate }) => {
  // Mock auction data - in real app this would come from backend
  const mockAuctions = [
    {
      id: 1,
      title: "Vintage Diamond Ring",
      description: "Beautiful vintage diamond ring from 1920s",
      currentBid: 1750,
      totalBids: 8,
      status: "active",
      endTime: "2024-03-15T18:00:00Z",
      image: "/public/img/bid1.png",
      createdAt: "2024-02-20",
    },
    {
      id: 2,
      title: "Gold Necklace Set",
      description: "Elegant 18k gold necklace with matching earrings",
      finalBid: 850,
      totalBids: 5,
      status: "sold",
      endTime: "2024-02-25T15:00:00Z",
      image: "/public/img/bid2.png",
      createdAt: "2024-02-15",
    },
    {
      id: 3,
      title: "Pearl Bracelet",
      description: "Classic freshwater pearl bracelet",
      currentBid: 320,
      totalBids: 3,
      status: "draft",
      endTime: null,
      image: "/public/img/bid3.png",
      createdAt: "2024-02-28",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "#3b82f6";
      case "sold":
        return "#10b981";
      case "draft":
        return "#f59e0b";
      case "expired":
        return "#ef4444";
      default:
        return "#6b7280";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "active":
        return "Active";
      case "sold":
        return "Sold";
      case "draft":
        return "Draft";
      case "expired":
        return "Expired";
      default:
        return status;
    }
  };

  return (
    <div
      style={{
        background: "white",
        borderRadius: "16px",
        padding: "32px",
        boxShadow: "0 4px 16px rgba(0, 0, 0, 0.08)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "32px",
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: "1.5rem",
            fontWeight: "600",
            color: "#1f2937",
          }}
        >
          My Auctions
        </h2>
        <button
          onClick={() => navigate("/foryou")}
          style={{
            background: "#E0AF62",
            color: "white",
            border: "none",
            borderRadius: "8px",
            padding: "12px 20px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "14px",
            fontWeight: "500",
            transition: "background-color 0.2s",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "#d4a054")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "#E0AF62")
          }
        >
          <Plus size={16} />
          Create Auction
        </button>
      </div>

      {/* Stats Summary */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "16px",
          marginBottom: "32px",
        }}
      >
        <div
          style={{
            textAlign: "center",
            padding: "16px",
            backgroundColor: "#f9fafb",
            borderRadius: "8px",
          }}
        >
          <div
            style={{ fontSize: "24px", fontWeight: "bold", color: "#3b82f6" }}
          >
            {mockAuctions.filter((a) => a.status === "active").length}
          </div>
          <div style={{ fontSize: "14px", color: "#6b7280" }}>
            Active Auctions
          </div>
        </div>
        <div
          style={{
            textAlign: "center",
            padding: "16px",
            backgroundColor: "#f9fafb",
            borderRadius: "8px",
          }}
        >
          <div
            style={{ fontSize: "24px", fontWeight: "bold", color: "#10b981" }}
          >
            {mockAuctions.filter((a) => a.status === "sold").length}
          </div>
          <div style={{ fontSize: "14px", color: "#6b7280" }}>Sold Items</div>
        </div>
        <div
          style={{
            textAlign: "center",
            padding: "16px",
            backgroundColor: "#f9fafb",
            borderRadius: "8px",
          }}
        >
          <div
            style={{ fontSize: "24px", fontWeight: "bold", color: "#f59e0b" }}
          >
            {mockAuctions.filter((a) => a.status === "draft").length}
          </div>
          <div style={{ fontSize: "14px", color: "#6b7280" }}>Draft Items</div>
        </div>
        <div
          style={{
            textAlign: "center",
            padding: "16px",
            backgroundColor: "#f9fafb",
            borderRadius: "8px",
          }}
        >
          <div
            style={{ fontSize: "24px", fontWeight: "bold", color: "#E0AF62" }}
          >
            $
            {mockAuctions
              .reduce((sum, a) => sum + (a.finalBid || a.currentBid || 0), 0)
              .toLocaleString()}
          </div>
          <div style={{ fontSize: "14px", color: "#6b7280" }}>
            Total Revenue
          </div>
        </div>
      </div>

      {/* Auctions List */}
      <div style={{ display: "grid", gap: "16px" }}>
        {mockAuctions.map((auction) => (
          <div
            key={auction.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              padding: "20px",
              border: "1px solid #f3f4f6",
              borderRadius: "12px",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#f9fafb";
              e.currentTarget.style.borderColor = "#E0AF62";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.borderColor = "#f3f4f6";
            }}
          >
            <img
              src={auction.image}
              alt={auction.title}
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "8px",
                objectFit: "cover",
              }}
            />
            <div style={{ flex: 1 }}>
              <h3
                style={{
                  margin: "0 0 8px 0",
                  fontSize: "1.1rem",
                  fontWeight: "600",
                  color: "#1f2937",
                }}
              >
                {auction.title}
              </h3>
              <p
                style={{
                  margin: "0 0 12px 0",
                  fontSize: "14px",
                  color: "#6b7280",
                }}
              >
                {auction.description}
              </p>
              <div style={{ display: "flex", gap: "16px", fontSize: "14px" }}>
                <span style={{ color: "#6b7280" }}>
                  <strong>{auction.totalBids}</strong> bids
                </span>
                <span style={{ color: "#6b7280" }}>
                  Created: {new Date(auction.createdAt).toLocaleDateString()}
                </span>
                {auction.endTime && (
                  <span style={{ color: "#6b7280" }}>
                    Ends: {new Date(auction.endTime).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div
                style={{
                  fontSize: "1.2rem",
                  fontWeight: "bold",
                  color: "#1f2937",
                  marginBottom: "8px",
                }}
              >
                $
                {(auction.finalBid || auction.currentBid || 0).toLocaleString()}
              </div>
              <div
                style={{
                  padding: "4px 12px",
                  borderRadius: "20px",
                  fontSize: "12px",
                  fontWeight: "500",
                  color: getStatusColor(auction.status),
                  backgroundColor: `${getStatusColor(auction.status)}15`,
                  textTransform: "capitalize",
                }}
              >
                {getStatusLabel(auction.status)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {mockAuctions.length === 0 && (
        <div style={{ textAlign: "center", padding: "40px", color: "#6b7280" }}>
          <Plus size={48} style={{ marginBottom: "16px", opacity: 0.5 }} />
          <h3 style={{ margin: "0 0 8px 0", color: "#4a5568" }}>
            No auctions yet
          </h3>
          <p style={{ margin: "0 0 20px 0" }}>
            Create your first auction to start selling
          </p>
          <button
            onClick={() => navigate("/foryou")}
            style={{
              background: "#E0AF62",
              color: "white",
              border: "none",
              borderRadius: "8px",
              padding: "12px 20px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "500",
            }}
          >
            Create Your First Auction
          </button>
        </div>
      )}
    </div>
  );
};

// Main Profile Component
const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [profileData, setProfileData] = useState({
    username: user?.username || "johndoe",
    email: user?.email || "john.doe@example.com",
    phoneNumber: user?.phoneNumber || "+1 (555) 123-4567",
    role: user?.role || "Buyer",
  });
  const [isEditing, setIsEditing] = useState(false);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      logout();
      // Redirect to home page after logout
      navigate("/");
    }
  };

  // Mock data
  const stats = {
    totalBids: 156,
    wonAuctions: 12,
    totalSpent: 24500,
    activeBids: 8,
  };

  const bidHistory = [
    {
      id: 1,
      auctionTitle: "Vintage Diamond Ring",
      myBid: 1500,
      currentBid: 1750,
      status: "outbid",
      endTime: "2024-02-15",
      image: "/public/img/bid1.png",
    },
    {
      id: 2,
      auctionTitle: "Gold Necklace Set",
      myBid: 850,
      currentBid: 850,
      status: "winning",
      endTime: "2024-02-20",
      image: "/public/img/bid2.png",
    },
    {
      id: 3,
      auctionTitle: "Pearl Earrings",
      myBid: 650,
      currentBid: 650,
      status: "won",
      endTime: "2024-02-10",
      image: "/public/img/bid3.png",
    },
  ];

  const paymentHistory = [
    {
      id: 1,
      auctionTitle: "Pearl Earrings",
      amount: 650,
      paymentMethod: "Visa ****1234",
      status: "completed",
      date: "2024-02-10",
    },
    {
      id: 2,
      auctionTitle: "Silver Bracelet",
      amount: 320,
      paymentMethod: "PayPal",
      status: "completed",
      date: "2024-02-05",
    },
  ];

  const paymentMethods = [
    {
      id: 1,
      type: "Credit Card",
      brand: "Visa",
      last4: "1234",
      expiry: "12/26",
      isDefault: true,
    },
    {
      id: 2,
      type: "PayPal",
      email: "john.doe@example.com",
      isDefault: false,
    },
  ];

  const recentActivity = [
    {
      action: "Won auction for Pearl Earrings",
      time: "2 hours ago",
      amount: "$650",
      icon: Star,
      color: "#10b981",
    },
    {
      action: "Placed bid on Vintage Diamond Ring",
      time: "1 day ago",
      amount: "$1,500",
      icon: Gavel,
      color: "#3b82f6",
    },
    {
      action: "Payment processed successfully",
      time: "3 days ago",
      amount: "$320",
      icon: CheckCircle,
      color: "#10b981",
    },
  ];

  const tabs = [
    { id: "overview", label: "Overview", icon: Activity },
    { id: "account", label: "Account Details", icon: User },
    { id: "bids", label: "Bid History", icon: Gavel },
    { id: "auctions", label: "My Auctions", icon: Plus },
    { id: "payments", label: "Payment History", icon: DollarSign },
    { id: "methods", label: "Payment Methods", icon: CreditCard },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div style={{ display: "grid", gap: "32px" }}>
            {/* Stats Grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "24px",
              }}
            >
              <StatCard
                icon={Gavel}
                label="Total Bids"
                value={stats.totalBids}
                change="+12%"
                color="#E0AF62"
              />
              <StatCard
                icon={Crown}
                label="Won Auctions"
                value={stats.wonAuctions}
                change="+8%"
                color="#10b981"
              />
              <StatCard
                icon={DollarSign}
                label="Total Spent"
                value={`$${stats.totalSpent.toLocaleString()}`}
                change="+15%"
                color="#3b82f6"
              />
              <StatCard
                icon={TrendingUp}
                label="Active Bids"
                value={stats.activeBids}
                color="#f59e0b"
              />
            </div>

            {/* Recent Activity */}
            <div
              style={{
                background: "white",
                borderRadius: "16px",
                padding: "32px",
                boxShadow: "0 4px 16px rgba(0, 0, 0, 0.08)",
              }}
            >
              <h2
                style={{
                  margin: "0 0 24px 0",
                  fontSize: "1.5rem",
                  fontWeight: "600",
                  color: "#1f2937",
                }}
              >
                Recent Activity
              </h2>
              <div style={{ display: "grid", gap: "12px" }}>
                {recentActivity.slice(0, 5).map((activity, index) => (
                  <ActivityCard key={index} activity={activity} />
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div
              style={{
                background: "linear-gradient(135deg, #FAD08D 0%, #E0AF62 100%)",
                borderRadius: "16px",
                padding: "32px",
                color: "white",
                textAlign: "center",
              }}
            >
              <h2
                style={{
                  margin: "0 0 16px 0",
                  fontSize: "1.5rem",
                  fontWeight: "600",
                }}
              >
                Ready to Find Your Next Treasure?
              </h2>
              <p style={{ margin: "0 0 24px 0", opacity: 0.9 }}>
                Explore our latest jewelry auctions and place your bids
              </p>
              <div
                style={{
                  display: "flex",
                  gap: "16px",
                  justifyContent: "center",
                  flexWrap: "wrap",
                }}
              >
                <a href="/auctions" className="btn btn-secondary">
                  <Gavel size={16} /> Browse Auctions
                </a>
                <a href="/jewelry" className="btn btn-outline">
                  <Crown size={16} /> View Jewelry
                </a>
              </div>
            </div>
          </div>
        );
      case "account":
        return (
          <AccountDetailsTab
            profileData={profileData}
            setProfileData={setProfileData}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
          />
        );
      case "bids":
        return <BidHistoryTab bidHistory={bidHistory} />;
      case "auctions":
        return <AuctionsTab navigate={navigate} />;
      case "payments":
        return <PaymentHistoryTab paymentHistory={paymentHistory} />;
      case "methods":
        return <PaymentMethodsTab paymentMethods={paymentMethods} />;
      case "settings":
        return <SettingsTab />;
      default:
        return null;
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
        fontFamily:
          "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: "linear-gradient(135deg, #FAD08D 0%, #E0AF62 100%)",
          padding: "48px 0",
          color: "white",
        }}
      >
        <div
          style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
            <div
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "20px",
                background: "rgba(255, 255, 255, 0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "32px",
                fontWeight: "bold",
              }}
            >
              {profileData.username[0].toUpperCase()}
            </div>
            <div>
              <h1
                style={{
                  margin: "0 0 8px 0",
                  fontSize: "2rem",
                  fontWeight: "bold",
                }}
              >
                Welcome back, {profileData.username}!
              </h1>
              <p style={{ margin: 0, opacity: 0.9, fontSize: "1.1rem" }}>
                Manage your account and track your auction activity
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div
        style={{
          maxWidth: "1400px",
          margin: "24px 0 0 48px",
          padding: "0 24px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "280px 1fr",
            gap: "48px",
            alignItems: "start",
          }}
        >
          {/* Sidebar */}
          <div
            style={{
              background: "white",
              borderRadius: "16px",
              padding: "24px",
              boxShadow: "0 4px 16px rgba(0, 0, 0, 0.08)",
              position: "sticky",
              top: "48px",
              marginLeft: "0",
            }}
          >
            <nav>
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      padding: "12px 16px",
                      border: "none",
                      borderRadius: "10px",
                      background:
                        activeTab === tab.id ? "#E0AF6215" : "transparent",
                      color: activeTab === tab.id ? "#E0AF62" : "#6b7280",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      fontSize: "14px",
                      fontWeight: "500",
                      marginBottom: "4px",
                    }}
                    onMouseEnter={(e) => {
                      if (activeTab !== tab.id) {
                        e.currentTarget.style.backgroundColor = "#f9fafb";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (activeTab !== tab.id) {
                        e.currentTarget.style.backgroundColor = "transparent";
                      }
                    }}
                  >
                    <Icon size={18} />
                    {tab.label}
                  </button>
                );
              })}

              {/* Logout Button */}
              <div
                style={{
                  marginTop: "20px",
                  paddingTop: "20px",
                  borderTop: "1px solid #f3f4f6",
                }}
              >
                <button
                  onClick={handleLogout}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "12px 16px",
                    border: "none",
                    borderRadius: "10px",
                    background: "transparent",
                    color: "#ef4444",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    fontSize: "14px",
                    fontWeight: "500",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#fef2f2";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </div>
            </nav>
          </div>

          {/* Content Area */}
          <div
            style={{
              minHeight: "600px",
              paddingBottom: "48px",
              paddingTop: "24px",
              marginLeft: "0",
            }}
          >
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
