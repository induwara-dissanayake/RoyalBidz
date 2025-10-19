import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  LogIn,
  Check,
  X,
  Clock,
  AlertCircle,
  Gavel,
  DollarSign,
  Star,
  Settings,
  Trash2,
} from "lucide-react";

const Notifications = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, unread, read
  const [error, setError] = useState("");

  // Fetch notifications from backend
  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
    }
  }, [isAuthenticated]); // Removed filter dependency since we filter on frontend

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      // Always fetch all notifications and filter on frontend
      const queryParams = new URLSearchParams({
        limit: "50",
        offset: "0",
      });

      const response = await fetch(
        `/api/notifications?${queryParams.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("API Response status:", response.status); // Debug log
      console.log("API Response ok:", response.ok); // Debug log

      if (response.ok) {
        const data = await response.json();
        console.log("Raw notifications data:", data); // Debug log
        console.log("First notification structure:", data[0]); // Debug log for structure

        // Transform backend data to match frontend format
        const transformedNotifications = data
          .filter((notification) => notification && notification.Id) // Filter out invalid notifications (backend uses PascalCase)
          .map((notification, index) => ({
            id: notification.Id || `temp-${index}`, // Ensure unique ID (backend uses PascalCase)
            type: notification.Type,
            title: notification.Title,
            message: notification.Message,
            timestamp: new Date(notification.CreatedAt),
            read: notification.IsRead, // Backend uses PascalCase IsRead
            icon: getNotificationIcon(notification.Type),
            color: getNotificationColor(notification.Type),
            amount: notification.Amount,
            entityType: notification.EntityType,
            entityId: notification.EntityId,
            actionUrl: notification.ActionUrl,
            actionLabel: notification.ActionLabel,
            ActionCancelUrl: notification.ActionCancelUrl,
            ActionCancelLabel: notification.ActionCancelLabel,
          }));

        console.log("Transformed notifications:", transformedNotifications); // Debug log
        console.log(
          "Transformed notifications count:",
          transformedNotifications.length
        ); // Debug log
        setNotifications(transformedNotifications);
      } else {
        setError("Failed to load notifications");
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setError("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  // Helper functions to get icon and color based on notification type
  const getNotificationIcon = (type) => {
    switch (type) {
      case "bid_outbid":
      case "bid_placed":
        return Gavel;
      case "auction_won":
        return Star;
      case "payment_success":
        return DollarSign;
      case "auction_ending":
      case "auction_started":
        return Clock;
      case "new_auction":
        return Bell;
      default:
        return AlertCircle;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case "bid_outbid":
        return "#f59e0b";
      case "auction_won":
      case "payment_success":
        return "#10b981";
      case "auction_ending":
      case "auction_started":
        return "#3b82f6";
      case "new_auction":
        return "#8b5cf6";
      case "bid_placed":
        return "#E0AF62";
      default:
        return "#6b7280";
    }
  };

  const filteredNotifications = notifications.filter((notification) => {
    if (filter === "unread") return !notification.read;
    if (filter === "read") return notification.read;
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/notifications/${id}/mark-read`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        setNotifications((prev) =>
          prev.map((notification) =>
            notification.id === id
              ? { ...notification, read: true }
              : notification
          )
        );
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/notifications/mark-all-read", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        setNotifications((prev) =>
          prev.map((notification) => ({ ...notification, read: true }))
        );
      }
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  const deleteNotification = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/notifications/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        setNotifications((prev) =>
          prev.filter((notification) => notification.id !== id)
        );
      }
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const handleNotificationAction = async (notification) => {
    if (notification.actionUrl) {
      // Mark as read when taking action
      if (!notification.read) {
        await markAsRead(notification.id);
      }
      // Navigate to the action URL
      navigate(notification.actionUrl);
    }
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));

    if (hours > 24) {
      return timestamp.toLocaleDateString();
    } else if (hours > 0) {
      return `${hours}h ago`;
    } else if (minutes > 0) {
      return `${minutes}m ago`;
    } else {
      return "Just now";
    }
  };

  if (!isAuthenticated) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
          fontFamily:
            "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          padding: "40px 20px",
        }}
      >
        <div
          style={{
            maxWidth: "500px",
            margin: "100px auto",
            background: "white",
            borderRadius: "16px",
            padding: "60px 40px",
            textAlign: "center",
            boxShadow: "0 4px 16px rgba(0, 0, 0, 0.08)",
          }}
        >
          <LogIn size={48} style={{ color: "#E0AF62", marginBottom: "20px" }} />
          <h3
            style={{
              color: "#1f2937",
              marginBottom: "10px",
              fontSize: "1.5rem",
            }}
          >
            Authentication Required
          </h3>
          <p
            style={{
              color: "#6b7280",
              marginBottom: "30px",
              lineHeight: "1.6",
            }}
          >
            Please log in to view your notifications and stay updated on your
            auction activity
          </p>
          <a
            href="/login"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "#E0AF62",
              color: "white",
              textDecoration: "none",
              padding: "12px 24px",
              borderRadius: "8px",
              fontWeight: "500",
              transition: "background-color 0.2s",
            }}
          >
            <LogIn size={16} /> Login
          </a>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
          fontFamily:
            "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          padding: "40px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: "40px",
              height: "40px",
              border: "3px solid #f3f4f6",
              borderTop: "3px solid #E0AF62",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto 16px",
            }}
          ></div>
          <span style={{ color: "#6b7280" }}>Loading notifications...</span>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
        fontFamily:
          "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        padding: "40px 20px",
      }}
    >
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        {/* Header */}
        <div
          style={{
            background: "white",
            borderRadius: "16px",
            padding: "32px",
            marginBottom: "24px",
            boxShadow: "0 4px 16px rgba(0, 0, 0, 0.08)",
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
            <div>
              <h1
                style={{
                  margin: "0 0 8px 0",
                  fontSize: "2rem",
                  fontWeight: "bold",
                  color: "#1f2937",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <Bell size={28} style={{ color: "#E0AF62" }} />
                Notifications
                {unreadCount > 0 && (
                  <span
                    style={{
                      background: "#ef4444",
                      color: "white",
                      borderRadius: "12px",
                      padding: "4px 8px",
                      fontSize: "0.75rem",
                      fontWeight: "600",
                    }}
                  >
                    {unreadCount}
                  </span>
                )}
              </h1>
              <p style={{ margin: 0, color: "#6b7280" }}>
                Stay updated on your auction activity and account updates
              </p>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                style={{
                  background: "#E0AF62",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  padding: "8px 16px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "14px",
                  fontWeight: "500",
                }}
              >
                <Check size={14} />
                Mark all as read
              </button>
            )}
          </div>

          {/* Filter buttons */}
          <div style={{ display: "flex", gap: "8px" }}>
            {["all", "unread", "read"].map((filterType) => (
              <button
                key={filterType}
                onClick={() => setFilter(filterType)}
                style={{
                  background:
                    filter === filterType ? "#E0AF6215" : "transparent",
                  color: filter === filterType ? "#E0AF62" : "#6b7280",
                  border:
                    filter === filterType
                      ? "1px solid #E0AF62"
                      : "1px solid #e5e7eb",
                  borderRadius: "8px",
                  padding: "6px 12px",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "500",
                  textTransform: "capitalize",
                }}
              >
                {filterType}{" "}
                {filterType === "unread" &&
                  unreadCount > 0 &&
                  `(${unreadCount})`}
              </button>
            ))}
          </div>
        </div>

        {/* Notifications List */}
        {filteredNotifications.length === 0 ? (
          <div
            style={{
              background: "white",
              borderRadius: "16px",
              padding: "60px 40px",
              textAlign: "center",
              boxShadow: "0 4px 16px rgba(0, 0, 0, 0.08)",
            }}
          >
            <Bell
              size={48}
              style={{ color: "#cbd5e0", marginBottom: "20px" }}
            />
            <h3 style={{ color: "#4a5568", marginBottom: "10px" }}>
              {filter === "unread"
                ? "No unread notifications"
                : filter === "read"
                ? "No read notifications"
                : "No notifications"}
            </h3>
            <p style={{ color: "#6b7280" }}>
              {filter === "unread"
                ? "All caught up! Check back later for updates on your auctions."
                : filter === "read"
                ? "No read notifications found."
                : "We'll notify you about auction updates, bids, and account activity."}
            </p>
          </div>
        ) : (
          <div style={{ display: "grid", gap: "12px" }}>
            {filteredNotifications.map((notification, index) => {
              const Icon = notification.icon;
              // Ensure unique key even if ID is duplicate
              const uniqueKey = notification.id
                ? `${notification.id}-${index}`
                : `notification-${index}`;
              return (
                <div
                  key={uniqueKey}
                  style={{
                    background: "white",
                    borderRadius: "12px",
                    padding: "20px",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
                    border: !notification.read
                      ? "2px solid #E0AF6230"
                      : "1px solid #f3f4f6",
                    position: "relative",
                  }}
                >
                  <div style={{ display: "flex", gap: "16px" }}>
                    <div
                      style={{
                        width: "48px",
                        height: "48px",
                        borderRadius: "12px",
                        background: `${notification.color}15`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <Icon size={24} style={{ color: notification.color }} />
                    </div>

                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "between",
                          alignItems: "flex-start",
                          marginBottom: "8px",
                        }}
                      >
                        <h4
                          style={{
                            margin: "0 0 4px 0",
                            fontSize: "1rem",
                            fontWeight: "600",
                            color: "#1f2937",
                          }}
                        >
                          {notification.title}
                          {!notification.read && (
                            <span
                              style={{
                                width: "8px",
                                height: "8px",
                                background: "#ef4444",
                                borderRadius: "50%",
                                display: "inline-block",
                                marginLeft: "8px",
                              }}
                            ></span>
                          )}
                        </h4>
                      </div>

                      <p
                        style={{
                          margin: "0 0 12px 0",
                          fontSize: "14px",
                          color: "#6b7280",
                          lineHeight: "1.5",
                        }}
                      >
                        {notification.message}
                      </p>

                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <span style={{ fontSize: "12px", color: "#9ca3af" }}>
                          {formatTimestamp(notification.timestamp)}
                        </span>

                        <div style={{ display: "flex", gap: "8px" }}>
                          {notification.actionUrl &&
                            notification.actionLabel && (
                              <button
                                key={`action-${uniqueKey}`}
                                onClick={() =>
                                  handleNotificationAction(notification)
                                }
                                style={{
                                  background:
                                    "linear-gradient(135deg, #E0AF62, #d4a556)",
                                  border: "none",
                                  color: "white",
                                  cursor: "pointer",
                                  padding: "6px 12px",
                                  borderRadius: "6px",
                                  fontSize: "12px",
                                  fontWeight: "600",
                                  transition: "all 0.3s ease",
                                }}
                                title={notification.actionLabel}
                              >
                                {notification.actionLabel}
                              </button>
                            )}
                          {notification.ActionCancelUrl ||
                          notification.actionCancelUrl ||
                          notification.actionCancelLabel ||
                          notification.ActionCancelLabel ? (
                            <button
                              key={`cancel-${uniqueKey}`}
                              onClick={async () => {
                                // Mark as read and navigate to cancel URL
                                if (!notification.read)
                                  await markAsRead(notification.id);
                                const cancelUrl =
                                  notification.ActionCancelUrl ||
                                  notification.actionCancelUrl ||
                                  notification.actionCancelLabel ||
                                  notification.ActionCancelLabel ||
                                  null;
                                if (cancelUrl) navigate(cancelUrl);
                              }}
                              style={{
                                background: "transparent",
                                border: "1px solid #ef4444",
                                color: "#ef4444",
                                cursor: "pointer",
                                padding: "6px 12px",
                                borderRadius: "6px",
                                fontSize: "12px",
                                fontWeight: "600",
                                transition: "all 0.3s ease",
                              }}
                              title={
                                notification.ActionCancelLabel ||
                                notification.actionCancelLabel ||
                                "Cancel"
                              }
                            >
                              {notification.ActionCancelLabel ||
                                notification.actionCancelLabel ||
                                "Cancel"}
                            </button>
                          ) : null}
                          {!notification.read && (
                            <button
                              key={`mark-read-${uniqueKey}`}
                              onClick={() => markAsRead(notification.id)}
                              style={{
                                background: "none",
                                border: "none",
                                color: "#6b7280",
                                cursor: "pointer",
                                padding: "4px",
                                borderRadius: "4px",
                                display: "flex",
                                alignItems: "center",
                                gap: "4px",
                                fontSize: "12px",
                              }}
                              title="Mark as read"
                            >
                              <Check size={14} />
                            </button>
                          )}
                          <button
                            key={`delete-${uniqueKey}`}
                            onClick={() => deleteNotification(notification.id)}
                            style={{
                              background: "none",
                              border: "none",
                              color: "#ef4444",
                              cursor: "pointer",
                              padding: "4px",
                              borderRadius: "4px",
                            }}
                            title="Delete notification"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
