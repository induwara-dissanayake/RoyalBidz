import React, { useState, useEffect } from "react";

const Notification = ({
  message,
  type = "success",
  isVisible,
  onClose,
  duration = 3000,
}) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  const getNotificationStyles = () => {
    const baseStyles = {
      position: "fixed",
      bottom: "20px",
      right: "20px",
      padding: "16px 24px",
      borderRadius: "12px",
      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
      display: "flex",
      alignItems: "center",
      gap: "12px",
      minWidth: "320px",
      maxWidth: "400px",
      zIndex: 9999,
      transform: isVisible ? "translateX(0)" : "translateX(100%)",
      transition: "all 0.3s ease-in-out",
      backdropFilter: "blur(10px)",
      fontFamily: "system-ui, -apple-system, sans-serif",
      fontSize: "14px",
      fontWeight: "500",
    };

    const typeStyles = {
      success: {
        backgroundColor: "#10b981",
        color: "#ffffff",
        border: "1px solid #059669",
      },
      error: {
        backgroundColor: "#ef4444",
        color: "#ffffff",
        border: "1px solid #dc2626",
      },
      warning: {
        backgroundColor: "#f59e0b",
        color: "#ffffff",
        border: "1px solid #d97706",
      },
      info: {
        backgroundColor: "#3b82f6",
        color: "#ffffff",
        border: "1px solid #2563eb",
      },
    };

    return { ...baseStyles, ...typeStyles[type] };
  };

  const getIcon = () => {
    const iconStyles = {
      width: "20px",
      height: "20px",
      flexShrink: 0,
    };

    switch (type) {
      case "success":
        return (
          <svg style={iconStyles} fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "error":
        return (
          <svg style={iconStyles} fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "warning":
        return (
          <svg style={iconStyles} fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        );
      default:
        return (
          <svg style={iconStyles} fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
        );
    }
  };

  return (
    <div style={getNotificationStyles()}>
      {getIcon()}
      <span style={{ flex: 1 }}>{message}</span>
      <button
        onClick={onClose}
        style={{
          background: "none",
          border: "none",
          color: "currentColor",
          cursor: "pointer",
          padding: "0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "20px",
          height: "20px",
          borderRadius: "4px",
          opacity: "0.7",
          transition: "opacity 0.2s ease",
        }}
        onMouseEnter={(e) => (e.target.style.opacity = "1")}
        onMouseLeave={(e) => (e.target.style.opacity = "0.7")}
      >
        <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  );
};

export default Notification;
