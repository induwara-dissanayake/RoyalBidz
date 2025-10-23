/* Profile.jsx*/
import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import AdminDashboard from "../components/AdminDashboard";
import "./Profile.css";
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
  BarChart3,
} from "lucide-react";

// Add CSS for loading animation
const styles = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

// Inject styles
if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}

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


const AccountDetailsTab = ({
  profileData,
  setProfileData,
  isEditing,
  setIsEditing,
  updateProfile,
}) => {
  const [formData, setFormData] = useState(profileData);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setFormData(profileData);
  }, [profileData]);

  const handleSave = async () => {
    setSaving(true);
    const success = await updateProfile(formData);
    if (success) {
      setProfileData(formData);
      setIsEditing(false);
    }
    // Error message is handled in updateProfile function
    setSaving(false);
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
          disabled={saving}
          style={{
            background: isEditing ? "#10b981" : "#E0AF62",
            color: "white",
            border: "none",
            borderRadius: "8px",
            padding: "8px 16px",
            cursor: saving ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "14px",
            fontWeight: "500",
            opacity: saving ? 0.7 : 1,
          }}
        >
          {isEditing ? <Save size={16} /> : <Edit3 size={16} />}
          {saving ? "Saving..." : isEditing ? "Save Changes" : "Edit Profile"}
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
            First Name
          </label>
          <input
            type="text"
            value={formData.firstName}
            onChange={(e) =>
              setFormData({ ...formData, firstName: e.target.value })
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
            Last Name
          </label>
          <input
            type="text"
            value={formData.lastName}
            onChange={(e) =>
              setFormData({ ...formData, lastName: e.target.value })
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
            Address
          </label>
          <input
            type="text"
            value={formData.address}
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
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
            City
          </label>
          <input
            type="text"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
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
      {bidHistory.length > 0 ? (
        bidHistory.map((bid, index) => (
          <div
            key={`${bid.id || "bid"}-${bid.auctionTitle || "auction"}-${index}`}
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
              <div
                style={{ display: "flex", gap: "16px", marginBottom: "8px" }}
              >
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
              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  marginBottom: "4px",
                  fontSize: "12px",
                  color: "#6b7280",
                }}
              >
                <span>
                  Type: <strong>{bid.type || "N/A"}</strong>
                </span>
                <span>
                  Material: <strong>{bid.material || "N/A"}</strong>
                </span>
                <span>
                  Condition: <strong>{bid.condition || "N/A"}</strong>
                </span>
              </div>
              <div style={{ fontSize: "14px", color: "#6b7280" }}>
                Ends:{" "}
                {bid.endTime
                  ? new Date(bid.endTime).toLocaleDateString()
                  : "No end date"}
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
        ))
      ) : (
        <div style={{ textAlign: "center", padding: "40px", color: "#6b7280" }}>
          <Gavel size={48} style={{ marginBottom: "16px", opacity: 0.5 }} />
          <h3 style={{ margin: "0 0 8px 0", color: "#4a5568" }}>No bids yet</h3>
          <p style={{ margin: "0 0 20px 0" }}>
            Start bidding on auctions to see your history here
          </p>
          <button
            onClick={() => (window.location.href = "/auctions")}
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
            Browse Auctions
          </button>
        </div>
      )}
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
      {paymentHistory.length > 0 ? (
        paymentHistory.map((payment) => (
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
        ))
      ) : (
        <div style={{ textAlign: "center", padding: "40px", color: "#6b7280" }}>
          <DollarSign
            size={48}
            style={{ marginBottom: "16px", opacity: 0.5 }}
          />
          <h3 style={{ margin: "0 0 8px 0", color: "#4a5568" }}>
            No payments yet
          </h3>
          <p style={{ margin: 0 }}>
            Your payment history will appear here after you win auctions
          </p>
        </div>
      )}
    </div>
  </div>
);

const PaymentMethodsTab = ({ paymentMethods, onAddPaymentMethod }) => (
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
        onClick={() => onAddPaymentMethod()}
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
      {paymentMethods.map((method, index) => (
        <div
          key={method.id || index}
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

const SettingsTab = ({ onChangePassword }) => (
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
          onClick={() => onChangePassword()}
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

const AuctionsTab = ({ navigate, userAuctions }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "#3b82f6";
      case "Completed":
        return "#10b981";
      case "Draft":
        return "#f59e0b";
      case "Cancelled":
        return "#ef4444";
      default:
        return "#6b7280";
    }
  };

  const getStatusLabel = (status) => {
    return status || "Unknown";
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
            {userAuctions.filter((a) => a.status === "Active").length}
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
            {userAuctions.filter((a) => a.status === "Completed").length}
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
            {userAuctions.filter((a) => a.status === "Draft").length}
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
            {userAuctions
              .reduce((sum, a) => sum + (a.currentBid || a.startingBid || 0), 0)
              .toLocaleString()}
          </div>
          <div style={{ fontSize: "14px", color: "#6b7280" }}>
            Total Revenue
          </div>
        </div>
      </div>

      {/* Auctions List */}
      <div style={{ display: "grid", gap: "16px" }}>
        {userAuctions.map((auction) => (
          <div
            key={auction.Id || auction.id || Math.random()}
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
              src={
                auction.jewelryItem?.images?.[0]?.imageUrl ||
                "/public/img/bid1.png"
              }
              alt={auction.jewelryItem?.title || "Auction Item"}
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
                {(auction.JewelryItem || auction.jewelryItem)?.Name ||
                  (auction.JewelryItem || auction.jewelryItem)?.name ||
                  auction.Title ||
                  auction.title ||
                  "Unknown Item"}
              </h3>
              <p
                style={{
                  margin: "0 0 12px 0",
                  fontSize: "14px",
                  color: "#6b7280",
                }}
              >
                {(auction.JewelryItem || auction.jewelryItem)?.Description ||
                  (auction.JewelryItem || auction.jewelryItem)?.description ||
                  auction.Description ||
                  auction.description ||
                  "No description available"}
              </p>
              <div style={{ display: "flex", gap: "16px", fontSize: "14px" }}>
                <span style={{ color: "#6b7280" }}>
                  <strong>{(auction.Bids || auction.bids)?.length || 0}</strong>{" "}
                  bids
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
                {(
                  auction.CurrentBid ||
                  auction.currentBid ||
                  auction.StartingBid ||
                  auction.startingBid ||
                  0
                ).toLocaleString()}
              </div>
              <div
                style={{
                  padding: "4px 12px",
                  borderRadius: "20px",
                  fontSize: "12px",
                  fontWeight: "500",
                  color: getStatusColor(auction.Status || auction.status),
                  backgroundColor: `${getStatusColor(
                    auction.Status || auction.status
                  )}15`,
                  textTransform: "capitalize",
                }}
              >
                {getStatusLabel(auction.Status || auction.status)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {userAuctions.length === 0 && (
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
    username: user?.username || "",
    email: user?.email || "",
    phoneNumber: "",
    role: user?.role || "Buyer",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    dateOfBirth: "",
    profileImage: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalBids: 0,
    wonAuctions: 0,
    totalSpent: 0,
    activeBids: 0,
  });
  const [bidHistory, setBidHistory] = useState([]);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [userAuctions, setUserAuctions] = useState([]);

  // Modal states
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [showAddPaymentModal, setShowAddPaymentModal] = useState(false);

  // Notification states
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [paymentData, setPaymentData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
    isDefault: false,
  });

  const [paymentErrors, setPaymentErrors] = useState({});

  // Payment validation functions
  const validateCardNumber = (cardNumber) => {
    // Remove spaces and hyphens
    const cleaned = cardNumber.replace(/[\s-]/g, "");

    // Check if empty
    if (!cleaned) {
      return "Card number is required";
    }

    // Check if it's all digits
    if (!/^\d+$/.test(cleaned)) {
      return "Card number must contain only digits";
    }

    // Check length (13-19 digits for most cards)
    if (cleaned.length < 13 || cleaned.length > 19) {
      return "Card number must be between 13-19 digits";
    }

    // Luhn algorithm validation
    let sum = 0;
    let isEven = false;

    for (let i = cleaned.length - 1; i >= 0; i--) {
      let digit = parseInt(cleaned[i]);

      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      isEven = !isEven;
    }

    if (sum % 10 !== 0) {
      return "Invalid card number (use test cards: 4532015112830366, 5555555555554444, or 378282246310005)";
    }

    return null;
  };

  const validateExpiryDate = (expiryDate) => {
    // Check format MM/YY
    const expiryRegex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
    if (!expiryRegex.test(expiryDate)) {
      return "Expiry date must be in MM/YY format";
    }

    // Check if date is not in the past
    const [month, year] = expiryDate.split("/");
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100; // Get last 2 digits
    const currentMonth = currentDate.getMonth() + 1; // 0-indexed month

    const expYear = parseInt(year);
    const expMonth = parseInt(month);

    if (
      expYear < currentYear ||
      (expYear === currentYear && expMonth < currentMonth)
    ) {
      return "Card has expired";
    }

    return null;
  };

  const validateCVV = (cvv) => {
    if (!/^\d{3,4}$/.test(cvv)) {
      return "CVV must be 3 or 4 digits";
    }
    return null;
  };

  const validateCardholderName = (name) => {
    if (!name.trim()) {
      return "Cardholder name is required";
    }
    if (name.trim().length < 2) {
      return "Cardholder name must be at least 2 characters";
    }
    if (!/^[a-zA-Z\s.-]+$/.test(name)) {
      return "Cardholder name must contain only letters, spaces, dots, and hyphens";
    }
    return null;
  };

  const validatePaymentForm = () => {
    const errors = {};

    const cardNumberError = validateCardNumber(paymentData.cardNumber);
    if (cardNumberError) errors.cardNumber = cardNumberError;

    const expiryError = validateExpiryDate(paymentData.expiryDate);
    if (expiryError) errors.expiryDate = expiryError;

    const cvvError = validateCVV(paymentData.cvv);
    if (cvvError) errors.cvv = cvvError;

    const nameError = validateCardholderName(paymentData.cardholderName);
    if (nameError) errors.cardholderName = nameError;

    setPaymentErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Helper function to format card number input
  const formatCardNumber = (value) => {
    // Remove all non-digit characters
    const digitsOnly = value.replace(/\D/g, "");

    
    const formatted = digitsOnly.replace(/(\d{4})(?=\d)/g, "$1 ");

    // Limit to 19 digits max
    return formatted.substr(0, 23); 
  };

  // Helper function to format expiry date input
  const formatExpiryDate = (value) => {
    
    const digitsOnly = value.replace(/\D/g, "");

    
    if (digitsOnly.length >= 2) {
      return digitsOnly.substr(0, 2) + "/" + digitsOnly.substr(2, 2);
    }

    return digitsOnly;
  };

  // API call functions
  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/profile/summary", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        // Update profile data with API response if available
        setProfileData((prev) => ({
          ...prev,
          ...data,
        }));
      }
      // If API fails, we already have user data loaded in useEffect
    } catch (error) {
      console.error("Error fetching profile:", error);
      
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");

      
      try {
        const response = await fetch("/api/profile/stats", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setStats({
            totalBids: data.TotalBids ?? data.totalBids ?? 0,
            wonAuctions: data.WonAuctions ?? data.wonAuctions ?? 0,
            totalSpent: data.TotalSpent ?? data.totalSpent ?? 0,
            activeBids: data.ActiveBids ?? data.activeBids ?? 0,
          });
          return; // Success, exit early
        }
      } catch (error) {
        console.log("Profile stats API not available, calculating manually");
      }

      // Fallback: Fetch stats from multiple endpoints
      const [bidsResponse, auctionsResponse] = await Promise.allSettled([
        fetch("/api/bids/my-bids", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }),
        fetch("/api/auctions/my-auctions", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }),
      ]);

      let totalBids = 0;
      let wonAuctions = 0;
      let totalSpent = 0;
      let activeBids = 0;

      if (bidsResponse.status === "fulfilled" && bidsResponse.value.ok) {
        const bids = await bidsResponse.value.json();
        totalBids = bids.length;
        activeBids = bids.filter((bid) => {
          const status =
            bid.auction?.status ??
            bid.Auction?.Status ??
            bid.auctionStatus ??
            bid.status;
          return (status || "").toString().toLowerCase() === "active";
        }).length;

        // Calculate total spent and won auctions using flexible keys
        const winningBids = bids.filter((bid) => {
          const auctionWinningBidderId =
            bid.auctionWinningBidderId ??
            bid.AuctionWinningBidderId ??
            bid.auction?.winningBidderId ??
            bid.Auction?.WinningBidderId ??
            null;
          const currentUserId = user?.Id ?? user?.id;
          const auctionStatus = (
            bid.auctionStatus ??
            bid.AuctionStatus ??
            bid.auction?.status ??
            bid.Auction?.Status ??
            ""
          ).toLowerCase();

          return (
            auctionWinningBidderId &&
            Number(auctionWinningBidderId) === Number(currentUserId) &&
            auctionStatus === "ended"
          );
        });

        // Get total spent from payments for accuracy
        try {
          const paymentsResponse = await fetch("/api/payments/my-payments", {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });

          if (paymentsResponse.ok) {
            const paymentsData = await paymentsResponse.json();
            totalSpent = paymentsData
              .filter(
                (p) =>
                  (p.status ?? p.Status ?? "").toLowerCase() === "completed"
              )
              .reduce(
                (sum, payment) =>
                  sum + Number(payment.amount ?? payment.Amount ?? 0),
                0
              );
          } else {
            // Fallback to winning bids amount
            totalSpent = winningBids.reduce(
              (sum, bid) => sum + Number(bid.amount ?? bid.Amount ?? 0),
              0
            );
          }
        } catch (error) {
          // Fallback to winning bids amount
          totalSpent = winningBids.reduce(
            (sum, bid) => sum + Number(bid.amount ?? bid.Amount ?? 0),
            0
          );
        }

        wonAuctions = winningBids.length;
      }

      setStats({
        totalBids,
        wonAuctions,
        totalSpent,
        activeBids,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
      
    }
  };

  // Normalized fetchBidHistory: supports PascalCase/camelCase and safe number formatting
  const fetchBidHistory = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/bids/my-bids", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        const normalized = data.map((raw) => {
          const b = raw || {};
          const id = b.id ?? b.Id ?? null;
          const auctionTitle =
            b.auctionTitle ??
            b.AuctionTitle ??
            b.jewelryItemName ??
            b.JewelryItemName ??
            b.auction?.title ??
            b.Auction?.Title ??
            "Unknown Item";
          const myBid = Number(b.amount ?? b.Amount ?? b.myBid ?? 0);
          const auctionCurrentBid = Number(
            b.auctionCurrentBid ??
              b.AuctionCurrentBid ??
              b.auctionCurrentBid ??
              b.Auction?.CurrentBid ??
              b.auction?.currentBid ??
              b.currentBid ??
              b.CurrentBid ??
              myBid
          );
          const auctionStatus =
            b.auctionStatus ??
            b.AuctionStatus ??
            b.status ??
            b.auction?.status ??
            b.Auction?.Status ??
            null;
          const auctionWinningBidderId =
            b.auctionWinningBidderId ??
            b.AuctionWinningBidderId ??
            b.auctionWinningBidderId ??
            b.Auction?.WinningBidderId ??
            b.auction?.winningBidderId ??
            null;
          const auctionWinningAmount = Number(
            b.auctionWinningAmount ??
              b.AuctionWinningAmount ??
              b.auction?.winningBidAmount ??
              b.Auction?.CurrentBid ??
              b.auction?.currentBid ??
              null
          );
          const endTime =
            b.auctionEndTime ??
            b.AuctionEndTime ??
            b.endTime ??
            b.EndTime ??
            b.auction?.endTime ??
            b.Auction?.EndTime ??
            null;
          const image =
            b.jewelryItemImageUrl ??
            b.JewelryItemImageUrl ??
            b.image ??
            b.Image ??
            b.jewelryItem?.images?.[0]?.imageUrl ??
            b.JewelryItem?.Images?.[0]?.ImageUrl ??
            "/img/bid1.png";
          const type =
            b.jewelryItemType ??
            b.JewelryItemType ??
            b.type ??
            b.Type ??
            "Fine Jewelry";
          const material =
            b.jewelryItemMaterial ??
            b.JewelryItemMaterial ??
            b.material ??
            b.Material ??
            "Precious Metal";
          const condition =
            b.jewelryItemCondition ??
            b.JewelryItemCondition ??
            b.condition ??
            b.Condition ??
            "Pre-owned";

          // Determine status from multiple sources
          let status = "outbid";

          // First check if bid has its own status
          const bidStatus = (
            b.status ??
            b.Status ??
            b.bidStatus ??
            b.BidStatus ??
            ""
          )
            .toString()
            .toLowerCase();

          const auctionStatusLower = (auctionStatus ?? "")
            .toString()
            .toLowerCase();
          const isAuctionActive = auctionStatusLower === "active";
          const isAuctionEnded =
            auctionStatusLower === "ended" ||
            (endTime ? new Date(endTime) <= new Date() : false);

          // Use bid's own status if available and meaningful
          if (bidStatus === "won") {
            status = "won";
          } else if (bidStatus === "winning" || bidStatus === "active") {
            status = isAuctionActive ? "active" : "outbid";
          } else if (bidStatus === "outbid" || bidStatus === "lost") {
            status = "outbid";
          } else {
            // Fallback to auction-based logic
            if (isAuctionActive) {
              status = "active";
            } else if (isAuctionEnded) {
              // Check if this user won the auction
              const currentUserId = user?.id ?? user?.Id;

              if (
                auctionWinningBidderId &&
                Number(auctionWinningBidderId) === Number(currentUserId)
              ) {
                status = "won";
              } else {
                status = "outbid";
              }
            }
          }

          return {
            id,
            auctionTitle,
            myBid: Number.isFinite(myBid) ? myBid : 0,
            currentBid: Number.isFinite(auctionCurrentBid)
              ? auctionCurrentBid
              : myBid,
            status,
            endTime,
            image,
            type,
            material,
            condition,
          };
        });

        setBidHistory(normalized);
      }
    } catch (error) {
      console.error("Error fetching bid history:", error);
    }
  };

  // Fetch saved payment methods
  const fetchPaymentMethods = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/users/payment-methods", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        // Normalize payment method data to handle different case conventions
        const normalized = (data || []).map((pm) => ({
          id: pm.id ?? pm.Id,
          type: pm.type ?? pm.Type ?? "Credit Card",
          brand: pm.brand ?? pm.Brand,
          last4: pm.last4 ?? pm.Last4,
          expiry: pm.expiryDate ?? pm.ExpiryDate ?? pm.expiry,
          email: pm.email ?? pm.Email,
          isDefault: pm.isDefault ?? pm.IsDefault ?? false,
          isActive: pm.isActive ?? pm.IsActive ?? true,
        }));
        setPaymentMethods(normalized);
      }
    } catch (error) {
      console.error("Error fetching payment methods:", error);
    }
  };

  // Fetch user's payment history (payments made)
  const fetchPaymentHistory = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/payments/my-payments", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        // Normalize minimal fields used by the UI
        const normalized = (data || []).map((p) => ({
          id: p.id ?? p.Id,
          auctionTitle:
            p.bid?.auction?.jewelryItem?.title ??
            p.auctionTitle ??
            p.auction?.title ??
            "Unknown Item",
          amount: Number(p.amount ?? p.Amount ?? 0),
          paymentMethod: p.paymentMethod ?? p.PaymentMethod ?? "",
          status: (p.status ?? p.Status ?? "").toString().toLowerCase(),
          date: p.paymentDate ?? p.createdAt ?? p.date ?? null,
        }));
        setPaymentHistory(normalized);
      } else if (response.status === 401 || response.status === 403) {
        // Not authorized - show empty history without spamming console
        setPaymentHistory([]);
      } else {
        console.error("Failed to fetch payment history:", response.status);
        setPaymentHistory([]);
      }
    } catch (error) {
      console.error("Error fetching payment history:", error);
      setPaymentHistory([]);
    }
  };

  const fetchRecentActivity = async () => {
    try {
      
      setRecentActivity([
        {
          action: "Welcome to RoyalBidz!",
          time: "Recently",
          amount: "",
          icon: Star,
          color: "#E0AF62",
        },
      ]);
    } catch (error) {
      console.error("Error fetching recent activity:", error);
    }
  };

  const fetchUserAuctions = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/auctions/my-auctions", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUserAuctions(data);
      }
    } catch (error) {
      console.error("Error fetching user auctions:", error);
      
    }
  };

  const updateProfile = async (updatedData) => {
    try {
      const token = localStorage.getItem("token");

      // Define allowed fields that match UpdateUserDto
      const allowedFields = [
        "username",
        "phoneNumber",
        "firstName",
        "lastName",
        "address",
        "city",
        "state",
        "zipCode",
        "country",
        "profileImageUrl",
        "dateOfBirth",
        "bio",
      ];

      // Filter to only include allowed fields and remove empty values
      const validData = {};
      allowedFields.forEach((field) => {
        if (
          updatedData[field] !== "" &&
          updatedData[field] !== null &&
          updatedData[field] !== undefined
        ) {
          validData[field] = updatedData[field];
        }
      });

      console.log("Sending profile update data:", validData); // Debug log

      const response = await fetch("/api/profile/update", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validData),
      });

      if (response.ok) {
        const data = await response.json();
        setProfileData((prev) => ({ ...prev, ...data }));
        setSuccess("Profile updated successfully!");
        setTimeout(() => setSuccess(""), 5000);
        return true;
      } else {
        const errorData = await response.json();
        console.error("Profile update error:", errorData);
        setError(
          `Failed to update profile: ${
            errorData.title || errorData.message || "Unknown error"
          }`
        );
        setTimeout(() => setError(""), 5000);
        return false;
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("Failed to update profile. Please try again.");
      setTimeout(() => setError(""), 5000);
      return false;
    }
  };

  // Change Password Handler
  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("New passwords don't match!");
      setTimeout(() => setError(""), 5000);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/users/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      if (response.ok) {
        setSuccess("Password changed successfully!");
        setShowChangePasswordModal(false);
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setTimeout(() => setSuccess(""), 5000);
      } else {
        const error = await response.text();
        setError(`Failed to change password: ${error}`);
        setTimeout(() => setError(""), 5000);
      }
    } catch (error) {
      console.error("Error changing password:", error);
      setError("Failed to change password. Please try again.");
      setTimeout(() => setError(""), 5000);
    }
  };

  // Add Payment Method Handler
  const handleAddPaymentMethod = async () => {
    // Clear previous errors
    setPaymentErrors({});

    // Validate form
    if (!validatePaymentForm()) {
      return; // Stop if validation fails
    }

    try {
      const token = localStorage.getItem("token");

      // Prepare data for API (remove formatting from card number)
      const apiData = {
        ...paymentData,
        cardNumber: paymentData.cardNumber.replace(/\s/g, ""), // Remove spaces
      };

      const response = await fetch("/api/users/payment-methods", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(apiData),
      });

      if (response.ok) {
        setSuccess("Payment method added successfully!");
        setShowAddPaymentModal(false);
        setPaymentData({
          cardNumber: "",
          expiryDate: "",
          cvv: "",
          cardholderName: "",
          isDefault: false,
        });
        setPaymentErrors({});
        // Refresh payment methods
        await fetchPaymentMethods();

        // Clear success message after 5 seconds
        setTimeout(() => setSuccess(""), 5000);
      } else {
        const error = await response.text();
        setError(`Failed to add payment method: ${error}`);
        setTimeout(() => setError(""), 5000);
      }
    } catch (error) {
      console.error("Error adding payment method:", error);
      setError("Failed to add payment method. Please try again.");
      setTimeout(() => setError(""), 5000);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      // Always load profile data from user context first
      if (user) {
        setProfileData({
          username: user.Username || user.username || "",
          email: user.Email || user.email || "",
          phoneNumber: user.PhoneNumber || user.phoneNumber || "",
          role: user.Role || user.role || "Buyer",
          firstName: user.FirstName || user.firstName || "",
          lastName: user.LastName || user.lastName || "",
          address: user.Address || user.address || "",
          city: user.City || user.city || "",
          state: user.State || user.state || "",
          zipCode: user.ZipCode || user.zipCode || "",
          country: user.Country || user.country || "",
          dateOfBirth: user.DateOfBirth || user.dateOfBirth || "",
          profileImage: user.ProfileImage || user.profileImage || "",
        });
      }

      // Then try to load additional data from API endpoints
      await Promise.allSettled([
        fetchProfile(),
        fetchStats(),
        fetchBidHistory(),
        fetchPaymentHistory(),
        fetchPaymentMethods(),
        fetchRecentActivity(),
        fetchUserAuctions(),
      ]);

      setLoading(false);
    };

    if (user) {
      loadData();
    }
  }, [user]);

  // Handle admin navigation properly
  useEffect(() => {
    if (activeTab === "admin") {
      navigate("/admin");
    }
  }, [activeTab, navigate]);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      logout();
      navigate("/");
    }
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: Activity },
    { id: "account", label: "Account Details", icon: User },
    { id: "bids", label: "Bid History", icon: Gavel },
    { id: "auctions", label: "My Auctions", icon: Plus },
    { id: "payments", label: "Payment History", icon: DollarSign },
    { id: "methods", label: "Payment Methods", icon: CreditCard },
    { id: "settings", label: "Settings", icon: Settings },
    // Add Admin Dashboard for admin users (role 2)
    ...(user?.Role === 2 || user?.role === 2 || user?.Role === "Admin"
      ? [{ id: "admin", label: "Admin Dashboard", icon: BarChart3 }]
      : []),
  ];

  const renderTabContent = () => {
    if (loading) {
      return (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "400px",
            background: "white",
            borderRadius: "16px",
            boxShadow: "0 4px 16px rgba(0, 0, 0, 0.08)",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                border: "4px solid #f3f4f6",
                borderTop: "4px solid #E0AF62",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
                margin: "0 auto 16px",
              }}
            ></div>
            <p style={{ color: "#6b7280", fontSize: "16px" }}>Loading...</p>
          </div>
        </div>
      );
    }

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
                {recentActivity.length > 0 ? (
                  recentActivity
                    .slice(0, 5)
                    .map((activity, index) => (
                      <ActivityCard key={index} activity={activity} />
                    ))
                ) : (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "40px",
                      color: "#6b7280",
                    }}
                  >
                    <Activity
                      size={48}
                      style={{ marginBottom: "16px", opacity: 0.5 }}
                    />
                    <p style={{ margin: 0 }}>No recent activity to show</p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions CTA removed per request */}
          </div>
        );
      case "account":
        return (
          <AccountDetailsTab
            profileData={profileData}
            setProfileData={setProfileData}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            updateProfile={updateProfile}
          />
        );
      case "bids":
        return <BidHistoryTab bidHistory={bidHistory} />;
      case "auctions":
        return <AuctionsTab navigate={navigate} userAuctions={userAuctions} />;
      case "payments":
        return <PaymentHistoryTab paymentHistory={paymentHistory} />;
      case "methods":
        return (
          <PaymentMethodsTab
            paymentMethods={paymentMethods}
            onAddPaymentMethod={() => setShowAddPaymentModal(true)}
          />
        );
      case "settings":
        return (
          <SettingsTab
            onChangePassword={() => setShowChangePasswordModal(true)}
          />
        );
      case "admin":
        return null;
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
      {/* Notifications */}
      {error && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            zIndex: 1000,
            background: "#fee2e2",
            border: "1px solid #fca5a5",
            borderRadius: "8px",
            padding: "12px 16px",
            color: "#dc2626",
            fontSize: "14px",
            fontWeight: "500",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          ❌ {error}
          <button
            onClick={() => setError("")}
            style={{
              background: "none",
              border: "none",
              color: "#dc2626",
              fontSize: "16px",
              cursor: "pointer",
              marginLeft: "8px",
            }}
          >
            ×
          </button>
        </div>
      )}

      {success && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            zIndex: 1000,
            background: "#d1fae5",
            border: "1px solid #6ee7b7",
            borderRadius: "8px",
            padding: "12px 16px",
            color: "#059669",
            fontSize: "14px",
            fontWeight: "500",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          ✅ {success}
          <button
            onClick={() => setSuccess("")}
            style={{
              background: "none",
              border: "none",
              color: "#059669",
              fontSize: "16px",
              cursor: "pointer",
              marginLeft: "8px",
            }}
          >
            ×
          </button>
        </div>
      )}

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
              {(profileData.firstName ||
                profileData.username ||
                "U")[0].toUpperCase()}
            </div>
            <div>
              <h1
                style={{
                  margin: "0 0 8px 0",
                  fontSize: "2rem",
                  fontWeight: "bold",
                }}
              >
                Welcome back,{" "}
                {profileData.firstName || profileData.username || "User"}!
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

              {/* Logout Button - Only show for non-admin users */}
              {!(
                user?.Role === 2 ||
                user?.role === 2 ||
                user?.Role === "Admin"
              ) && (
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
              )}
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

      {/* Change Password Modal */}
      {showChangePasswordModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={() => setShowChangePasswordModal(false)}
        >
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "16px",
              padding: "32px",
              maxWidth: "400px",
              width: "90%",
              boxShadow: "0 20px 25px rgba(0, 0, 0, 0.1)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2
              style={{
                margin: "0 0 24px 0",
                fontSize: "1.25rem",
                fontWeight: "600",
                color: "#1f2937",
              }}
            >
              Change Password
            </h2>
            <div style={{ display: "grid", gap: "16px" }}>
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
                  Current Password
                </label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      currentPassword: e.target.value,
                    })
                  }
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                    fontSize: "14px",
                    boxSizing: "border-box",
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
                  New Password
                </label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      newPassword: e.target.value,
                    })
                  }
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                    fontSize: "14px",
                    boxSizing: "border-box",
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
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      confirmPassword: e.target.value,
                    })
                  }
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                    fontSize: "14px",
                    boxSizing: "border-box",
                  }}
                />
              </div>
            </div>
            <div
              style={{
                display: "flex",
                gap: "12px",
                marginTop: "24px",
                justifyContent: "flex-end",
              }}
            >
              <button
                onClick={() => setShowChangePasswordModal(false)}
                style={{
                  padding: "12px 24px",
                  border: "1px solid #d1d5db",
                  borderRadius: "8px",
                  background: "white",
                  color: "#374151",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "500",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleChangePassword}
                style={{
                  padding: "12px 24px",
                  border: "none",
                  borderRadius: "8px",
                  background: "#E0AF62",
                  color: "white",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "500",
                }}
              >
                Change Password
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Payment Method Modal */}
      {showAddPaymentModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={() => setShowAddPaymentModal(false)}
        >
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "16px",
              padding: "32px",
              maxWidth: "400px",
              width: "90%",
              boxShadow: "0 20px 25px rgba(0, 0, 0, 0.1)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2
              style={{
                margin: "0 0 24px 0",
                fontSize: "1.25rem",
                fontWeight: "600",
                color: "#1f2937",
              }}
            >
              Add Payment Method
            </h2>
            <div style={{ display: "grid", gap: "16px" }}>
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
                  Cardholder Name
                </label>
                <input
                  type="text"
                  value={paymentData.cardholderName}
                  onChange={(e) => {
                    const value = e.target.value;
                    setPaymentData({
                      ...paymentData,
                      cardholderName: value,
                    });

                    // Clear error when user starts typing
                    if (paymentErrors.cardholderName) {
                      setPaymentErrors({
                        ...paymentErrors,
                        cardholderName: null,
                      });
                    }
                  }}
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: paymentErrors.cardholderName
                      ? "1px solid #ef4444"
                      : "1px solid #d1d5db",
                    borderRadius: "8px",
                    fontSize: "14px",
                    boxSizing: "border-box",
                  }}
                  placeholder="John Doe"
                />
                {paymentErrors.cardholderName && (
                  <div
                    style={{
                      color: "#ef4444",
                      fontSize: "12px",
                      marginTop: "4px",
                    }}
                  >
                    {paymentErrors.cardholderName}
                  </div>
                )}
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
                  Card Number
                </label>
                <input
                  type="text"
                  value={paymentData.cardNumber}
                  onChange={(e) => {
                    const formattedValue = formatCardNumber(e.target.value);
                    setPaymentData({
                      ...paymentData,
                      cardNumber: formattedValue,
                    });

                    if (paymentErrors.cardNumber) {
                      setPaymentErrors({
                        ...paymentErrors,
                        cardNumber: null,
                      });
                    }
                  }}
                  placeholder="1234 5678 9012 3456"
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: paymentErrors.cardNumber
                      ? "1px solid #ef4444"
                      : "1px solid #d1d5db",
                    borderRadius: "8px",
                    fontSize: "14px",
                    boxSizing: "border-box",
                  }}
                />
                {paymentErrors.cardNumber && (
                  <div
                    style={{
                      color: "#ef4444",
                      fontSize: "12px",
                      marginTop: "4px",
                    }}
                  >
                    {paymentErrors.cardNumber}
                  </div>
                )}
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "12px",
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
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    value={paymentData.expiryDate}
                    onChange={(e) => {
                      const formattedValue = formatExpiryDate(e.target.value);
                      setPaymentData({
                        ...paymentData,
                        expiryDate: formattedValue,
                      });

                      if (paymentErrors.expiryDate) {
                        setPaymentErrors({
                          ...paymentErrors,
                          expiryDate: null,
                        });
                      }
                    }}
                    placeholder="MM/YY"
                    maxLength="5"
                    style={{
                      width: "100%",
                      padding: "12px",
                      border: paymentErrors.expiryDate
                        ? "1px solid #ef4444"
                        : "1px solid #d1d5db",
                      borderRadius: "8px",
                      fontSize: "14px",
                      boxSizing: "border-box",
                    }}
                  />
                  {paymentErrors.expiryDate && (
                    <div
                      style={{
                        color: "#ef4444",
                        fontSize: "12px",
                        marginTop: "4px",
                      }}
                    >
                      {paymentErrors.expiryDate}
                    </div>
                  )}
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
                    CVV
                  </label>
                  <input
                    type="text"
                    value={paymentData.cvv}
                    onChange={(e) => {
                      // Only allow digits and limit to 4 characters
                      const value = e.target.value
                        .replace(/\D/g, "")
                        .substr(0, 4);
                      setPaymentData({
                        ...paymentData,
                        cvv: value,
                      });

                      if (paymentErrors.cvv) {
                        setPaymentErrors({
                          ...paymentErrors,
                          cvv: null,
                        });
                      }
                    }}
                    placeholder="123"
                    maxLength="4"
                    style={{
                      width: "100%",
                      padding: "12px",
                      border: paymentErrors.cvv
                        ? "1px solid #ef4444"
                        : "1px solid #d1d5db",
                      borderRadius: "8px",
                      fontSize: "14px",
                      boxSizing: "border-box",
                    }}
                  />
                  {paymentErrors.cvv && (
                    <div
                      style={{
                        color: "#ef4444",
                        fontSize: "12px",
                        marginTop: "4px",
                      }}
                    >
                      {paymentErrors.cvv}
                    </div>
                  )}
                </div>
              </div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <input
                  type="checkbox"
                  id="isDefault"
                  checked={paymentData.isDefault}
                  onChange={(e) =>
                    setPaymentData({
                      ...paymentData,
                      isDefault: e.target.checked,
                    })
                  }
                  style={{ cursor: "pointer" }}
                />
                <label
                  htmlFor="isDefault"
                  style={{
                    fontSize: "14px",
                    color: "#374151",
                    cursor: "pointer",
                  }}
                >
                  Set as default payment method
                </label>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                gap: "12px",
                marginTop: "24px",
                justifyContent: "flex-end",
              }}
            >
              <button
                onClick={() => setShowAddPaymentModal(false)}
                style={{
                  padding: "12px 24px",
                  border: "1px solid #d1d5db",
                  borderRadius: "8px",
                  background: "white",
                  color: "#374151",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "500",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleAddPaymentMethod}
                style={{
                  padding: "12px 24px",
                  border: "none",
                  borderRadius: "8px",
                  background: "#E0AF62",
                  color: "white",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "500",
                }}
              >
                Add Payment Method
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
