import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./PaymentPage.css";

const PaymentPage = () => {
  const { auctionId } = useParams();
  const navigate = useNavigate();
  const [auction, setAuction] = useState(null);
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [showAddPaymentMethod, setShowAddPaymentMethod] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [billingAddress, setBillingAddress] = useState({
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "USA",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAuctionDetails();
    fetchPaymentDetails();
    fetchPaymentMethods();
    fetchUserProfile();
  }, [auctionId]);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch("/api/profile/summary", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        // Support multiple shapes: { user: {...} } or direct user object
        const u = data.user ?? data ?? data.profile ?? {};
        setUserProfile(u);

        // Pre-fill billing address if user/profile data present
        setBillingAddress({
          address:
            u.address ?? u.Address ?? u.streetAddress ?? u.street_address ?? "",
          city: u.city ?? u.City ?? u.town ?? u.Town ?? "",
          state: u.state ?? u.State ?? u.region ?? u.Region ?? "",
          zipCode: u.zipCode ?? u.ZipCode ?? u.postalCode ?? u.PostalCode ?? "",
          country: u.country ?? u.Country ?? "USA",
        });
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  const fetchPaymentMethods = async () => {
    try {
      const response = await fetch("/api/users/payment-methods", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
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

        // Set default payment method if available
        const defaultMethod = normalized.find((pm) => pm.isDefault);
        if (defaultMethod) {
          setSelectedPaymentMethod(defaultMethod.id);
        } else if (normalized.length > 0) {
          setSelectedPaymentMethod(normalized[0].id);
        }
      }
    } catch (error) {
      console.error("Error fetching payment methods:", error);
    }
  };

  const fetchAuctionDetails = async () => {
    try {
      const response = await fetch(`/api/auctions/${auctionId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        // Normalize backend casing differences (PascalCase vs camelCase)
        const normalized = {
          id: data.id ?? data.Id,
          title: data.title ?? data.Title,
          currentBid:
            data.currentBid ?? data.CurrentBid ?? data.current_bid ?? 0,
          jewelryItem: (() => {
            const ji =
              data.jewelryItem ?? data.JewelryItem ?? data.JewelryItemDto ?? {};
            const images =
              ji.images ??
              ji.Images ??
              ji.jewelryImages ??
              ji.JewelryImages ??
              [];
            const mappedImages = (images || []).map((img) => ({
              imageUrl:
                img.imageUrl ?? img.ImageUrl ?? img.image_url ?? img.ImageUrl,
              altText: img.altText ?? img.AltText,
              isPrimary: img.isPrimary ?? img.IsPrimary,
            }));
            return {
              id: ji.id ?? ji.Id,
              name: ji.name ?? ji.Name,
              images: mappedImages,
            };
          })(),
          ...data,
        };
        setAuction(normalized);
      } else {
        throw new Error("Failed to fetch auction details");
      }
    } catch (error) {
      console.error("Error fetching auction:", error);
      setError("Unable to load auction details");
    }
  };

  const fetchPaymentDetails = async () => {
    try {
      // First try to get existing payment
      const response = await fetch(`/api/payments/auction/${auctionId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPayment(data);
      } else if (response.status === 404) {
        // Payment doesn't exist, try to initiate it
        try {
          const initiateResponse = await fetch(
            `/api/payments/auction/${auctionId}`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (initiateResponse.ok) {
            const initiatedPayment = await initiateResponse.json();
            setPayment(initiatedPayment);
          } else {
            console.error("Failed to initiate payment");
          }
        } catch (initiateError) {
          console.error("Error initiating payment:", initiateError);
        }
      }
    } catch (error) {
      console.error("Error fetching payment:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBillingAddressChange = (field, value) => {
    setBillingAddress((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePayment = async () => {
    setProcessing(true);
    setError("");

    try {
      // Validate payment method selection
      if (!selectedPaymentMethod) {
        throw new Error("Please select a payment method");
      }

      let paymentData = {
        auctionId: parseInt(auctionId),
        savedPaymentMethodId: selectedPaymentMethod,
        billingAddress: billingAddress,
      };

      // Process payment
      const response = await fetch("/api/payments/process", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(paymentData),
      });

      if (response.ok) {
        const result = await response.json();

        // Simulate processing delay
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Create success notification (backend should also create one)
        try {
          await fetch("/api/notifications", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({
              type: "payment_completed",
              title: "Payment Successful!",
              message: `Your payment of $${(
                (auction.currentBid || 0) * 1.03
              ).toFixed(2)} for "${
                auction.title
              }" has been processed successfully.`,
              entityType: "auction",
              entityId: parseInt(auctionId),
              amount: (auction.currentBid || 0) * 1.03,
            }),
          });
        } catch (notifError) {
          console.warn("Failed to create notification:", notifError);
        }

        // Navigate to success page
        navigate(`/payment-success/${auctionId}`, {
          state: { paymentId: result.id },
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Payment failed");
      }
    } catch (error) {
      console.error("Payment error:", error);
      setError(error.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleCancelPayment = () => {
    if (
      window.confirm(
        "Are you sure you want to cancel this payment? You may lose the auction item."
      )
    ) {
      navigate("/profile");
    }
  };

  const handleAddPaymentMethod = async (paymentMethodData) => {
    try {
      const response = await fetch("/api/users/payment-methods", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(paymentMethodData),
      });

      if (response.ok) {
        const newPaymentMethod = await response.json();
        // Refresh payment methods
        await fetchPaymentMethods();
        setShowAddPaymentMethod(false);

        // Auto-select the newly added payment method
        setSelectedPaymentMethod(newPaymentMethod.id ?? newPaymentMethod.Id);
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to add payment method");
      }
    } catch (error) {
      console.error("Error adding payment method:", error);
      setError("Failed to add payment method");
    }
  };

  if (loading) {
    return (
      <div className="payment-page">
        <div className="payment-container">
          <div className="loading-spinner">Loading payment details...</div>
        </div>
      </div>
    );
  }

  if (!auction) {
    return (
      <div className="payment-page">
        <div className="payment-container">
          <div className="error-message">Auction not found</div>
        </div>
      </div>
    );
  }

  const deadline = payment?.paymentDeadline
    ? new Date(payment.paymentDeadline)
    : null;
  const timeRemaining = deadline
    ? Math.max(0, deadline.getTime() - Date.now())
    : 0;
  const hoursRemaining = Math.floor(timeRemaining / (1000 * 60 * 60));
  const minutesRemaining = Math.floor(
    (timeRemaining % (1000 * 60 * 60)) / (1000 * 60)
  );

  return (
    <div className="payment-page">
      <div className="payment-container">
        <div className="payment-header">
          <h1>Complete Your Payment</h1>
          <div className="payment-deadline">
            {deadline && timeRemaining > 0 && (
              <div className="deadline-warning">
                ⏰ Payment deadline: {hoursRemaining}h {minutesRemaining}m
                remaining
              </div>
            )}
          </div>
        </div>

        <div className="payment-content">
          {/* Auction Summary */}
          <div className="auction-summary">
            <h2>Auction Summary</h2>
            <div className="auction-details">
              <div className="auction-image">
                {auction?.jewelryItem?.images &&
                auction.jewelryItem.images.length > 0 ? (
                  <img
                    src={auction.jewelryItem.images[0].imageUrl}
                    alt={auction.title || auction?.jewelryItem?.name || "Item"}
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "flex";
                    }}
                  />
                ) : null}
                <div
                  className="no-image"
                  style={{
                    display:
                      auction?.jewelryItem?.images?.length > 0
                        ? "none"
                        : "flex",
                  }}
                >
                  No Image
                </div>
              </div>
              <div className="auction-info">
                <h3>
                  {auction?.title ||
                    auction?.jewelryItem?.name ||
                    "Untitled Item"}
                </h3>
                <p className="winning-bid">
                  Your Winning Bid:{" "}
                  <span className="amount">
                    {auction?.currentBid
                      ? `$${Number(auction.currentBid).toLocaleString()}`
                      : "$0.00"}
                  </span>
                </p>
                <div className="payment-breakdown">
                  <div className="breakdown-row">
                    <span>Auction Amount:</span>
                    <span>
                      {auction?.currentBid
                        ? `$${Number(auction.currentBid).toLocaleString()}`
                        : "$0.00"}
                    </span>
                  </div>
                  <div className="breakdown-row">
                    <span>Processing Fee (3%):</span>
                    <span>
                      ${((Number(auction?.currentBid) || 0) * 0.03).toFixed(2)}
                    </span>
                  </div>
                  <div className="breakdown-row total">
                    <span>Total Amount:</span>
                    <span>
                      ${((Number(auction?.currentBid) || 0) * 1.03).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div className="payment-form">
            <h2>Payment Information</h2>

            {error && <div className="error-message">{error}</div>}

            {/* Payment Method Selection */}
            {paymentMethods.length > 0 ? (
              <div className="form-group">
                <label>Select Payment Method</label>
                <div className="saved-payment-methods">
                  {paymentMethods.map((method) => (
                    <div
                      key={method.id}
                      className={`payment-method-card ${
                        selectedPaymentMethod === method.id ? "selected" : ""
                      }`}
                      onClick={() => setSelectedPaymentMethod(method.id)}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "16px",
                        }}
                      >
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
                          {/* icon placeholder */}
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <rect
                              width="20"
                              height="12"
                              x="2"
                              y="6"
                              rx="2"
                              stroke="#E0AF62"
                              strokeWidth="1.5"
                            />
                          </svg>
                        </div>
                        <div>
                          <div
                            style={{
                              fontWeight: 600,
                              color: "#1f2937",
                              marginBottom: "4px",
                            }}
                          >
                            {method.type} {method.brand && `(${method.brand})`}
                          </div>
                          <div style={{ fontSize: "14px", color: "#6b7280" }}>
                            {method.last4
                              ? `****${method.last4}`
                              : method.email}
                            {method.expiry && ` • Expires ${method.expiry}`}
                          </div>
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                        }}
                      >
                        <input
                          type="radio"
                          name="selectedPaymentMethod"
                          checked={selectedPaymentMethod === method.id}
                          onChange={() => setSelectedPaymentMethod(method.id)}
                        />
                        {method.isDefault && (
                          <span className="default-badge">Default</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddPaymentMethod(true)}
                  className="add-payment-method-btn"
                >
                  + Add Payment Method
                </button>
              </div>
            ) : (
              <div className="form-group">
                <label>Payment Method</label>
                <div className="no-payment-methods">
                  <p>
                    No payment methods found. Please add a payment method to
                    continue.
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowAddPaymentMethod(true)}
                    className="add-payment-method-btn primary"
                  >
                    + Add Payment Method
                  </button>
                </div>
              </div>
            )}

            {/* Billing Address */}
            <h3>Billing Address</h3>
            <div className="form-group">
              <label>Address</label>
              <input
                type="text"
                value={billingAddress.address}
                onChange={(e) =>
                  handleBillingAddressChange("address", e.target.value)
                }
                placeholder="123 Main Street"
                className="form-input"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>City</label>
                <input
                  type="text"
                  value={billingAddress.city}
                  onChange={(e) =>
                    handleBillingAddressChange("city", e.target.value)
                  }
                  placeholder="New York"
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>State</label>
                <input
                  type="text"
                  value={billingAddress.state}
                  onChange={(e) =>
                    handleBillingAddressChange("state", e.target.value)
                  }
                  placeholder="NY"
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>ZIP Code</label>
                <input
                  type="text"
                  value={billingAddress.zipCode}
                  onChange={(e) =>
                    handleBillingAddressChange("zipCode", e.target.value)
                  }
                  placeholder="10001"
                  className="form-input"
                />
              </div>
            </div>

            {paymentMethods.find((pm) => pm.id === selectedPaymentMethod)
              ?.type === "PayPal" && (
              <div className="paypal-notice">
                <p>
                  You will be redirected to PayPal to complete your payment
                  securely.
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="payment-actions">
              <button
                className="btn btn-cancel"
                onClick={handleCancelPayment}
                disabled={processing}
              >
                Cancel Payment
              </button>
              <button
                className="btn btn-pay"
                onClick={handlePayment}
                disabled={processing}
              >
                {processing
                  ? "Processing..."
                  : `Pay $${((auction.currentBid || 0) * 1.03).toFixed(2)}`}
              </button>
            </div>
          </div>
        </div>

        {/* Add Payment Method Modal */}
        {showAddPaymentMethod && (
          <AddPaymentMethodModal
            onSave={handleAddPaymentMethod}
            onClose={() => setShowAddPaymentMethod(false)}
          />
        )}
      </div>
    </div>
  );
};

// Add Payment Method Modal Component
const AddPaymentMethodModal = ({ onSave, onClose }) => {
  const [paymentData, setPaymentData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
    isDefault: false,
  });
  const [errors, setErrors] = useState({});

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(" ");
    } else {
      return v;
    }
  };

  const formatExpiry = (value) => {
    const v = value.replace(/\D/g, "");
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4);
    }
    return v;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate
    const newErrors = {};
    if (!paymentData.cardNumber)
      newErrors.cardNumber = "Card number is required";
    if (!paymentData.expiryDate)
      newErrors.expiryDate = "Expiry date is required";
    if (!paymentData.cvv) newErrors.cvv = "CVV is required";
    if (!paymentData.cardholderName)
      newErrors.cardholderName = "Cardholder name is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Prepare data for API
    const apiData = {
      cardNumber: paymentData.cardNumber.replace(/\s/g, ""),
      expiryDate: paymentData.expiryDate,
      cvv: paymentData.cvv,
      cardholderName: paymentData.cardholderName,
      isDefault: paymentData.isDefault,
    };

    onSave(apiData);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: 400, width: "90%" }}
      >
        <h2
          style={{
            margin: "0 0 24px 0",
            fontSize: "1.25rem",
            fontWeight: 600,
            color: "#1f2937",
          }}
        >
          Add Payment Method
        </h2>
        <div style={{ display: "grid", gap: 16 }}>
          <div>
            <label
              style={{
                display: "block",
                marginBottom: 8,
                fontSize: 14,
                fontWeight: 500,
                color: "#374151",
              }}
            >
              Cardholder Name
            </label>
            <input
              type="text"
              value={paymentData.cardholderName}
              onChange={(e) =>
                setPaymentData({
                  ...paymentData,
                  cardholderName: e.target.value,
                })
              }
              style={{
                width: "100%",
                padding: 12,
                border: errors.cardholderName
                  ? "1px solid #ef4444"
                  : "1px solid #d1d5db",
                borderRadius: 8,
              }}
              placeholder="John Doe"
            />
            {errors.cardholderName && (
              <div style={{ color: "#ef4444", marginTop: 6 }}>
                {errors.cardholderName}
              </div>
            )}
          </div>

          <div>
            <label
              style={{
                display: "block",
                marginBottom: 8,
                fontSize: 14,
                fontWeight: 500,
                color: "#374151",
              }}
            >
              Card Number
            </label>
            <input
              type="text"
              value={formatCardNumber(paymentData.cardNumber)}
              onChange={(e) =>
                setPaymentData({ ...paymentData, cardNumber: e.target.value })
              }
              style={{
                width: "100%",
                padding: 12,
                border: errors.cardNumber
                  ? "1px solid #ef4444"
                  : "1px solid #d1d5db",
                borderRadius: 8,
              }}
              placeholder="1234 5678 9012 3456"
              maxLength={19}
            />
            {errors.cardNumber && (
              <div style={{ color: "#ef4444", marginTop: 6 }}>
                {errors.cardNumber}
              </div>
            )}
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            <div style={{ flex: 1 }}>
              <label
                style={{
                  display: "block",
                  marginBottom: 8,
                  fontSize: 14,
                  fontWeight: 500,
                  color: "#374151",
                }}
              >
                Expiry Date
              </label>
              <input
                type="text"
                value={formatExpiry(paymentData.expiryDate)}
                onChange={(e) =>
                  setPaymentData({ ...paymentData, expiryDate: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: 12,
                  border: errors.expiryDate
                    ? "1px solid #ef4444"
                    : "1px solid #d1d5db",
                  borderRadius: 8,
                }}
                placeholder="MM/YY"
                maxLength={5}
              />
              {errors.expiryDate && (
                <div style={{ color: "#ef4444", marginTop: 6 }}>
                  {errors.expiryDate}
                </div>
              )}
            </div>
            <div style={{ width: 120 }}>
              <label
                style={{
                  display: "block",
                  marginBottom: 8,
                  fontSize: 14,
                  fontWeight: 500,
                  color: "#374151",
                }}
              >
                CVV
              </label>
              <input
                type="text"
                value={paymentData.cvv}
                onChange={(e) =>
                  setPaymentData({ ...paymentData, cvv: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: 12,
                  border: errors.cvv
                    ? "1px solid #ef4444"
                    : "1px solid #d1d5db",
                  borderRadius: 8,
                }}
                placeholder="123"
                maxLength={4}
              />
              {errors.cvv && (
                <div style={{ color: "#ef4444", marginTop: 6 }}>
                  {errors.cvv}
                </div>
              )}
            </div>
          </div>

          <div>
            <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <input
                type="checkbox"
                checked={paymentData.isDefault}
                onChange={(e) =>
                  setPaymentData({
                    ...paymentData,
                    isDefault: e.target.checked,
                  })
                }
              />
              <span>Set as default payment method</span>
            </label>
          </div>

          <div
            style={{
              display: "flex",
              gap: 12,
              marginTop: 24,
              justifyContent: "flex-end",
            }}
          >
            <button
              onClick={onClose}
              style={{
                padding: "12px 24px",
                border: "1px solid #d1d5db",
                borderRadius: 8,
                background: "white",
                color: "#374151",
                cursor: "pointer",
                fontSize: 14,
                fontWeight: 500,
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              style={{
                padding: "12px 24px",
                border: "none",
                borderRadius: 8,
                background: "#E0AF62",
                color: "white",
                cursor: "pointer",
                fontSize: 14,
                fontWeight: 500,
              }}
            >
              Add Payment Method
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
