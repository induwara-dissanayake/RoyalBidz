import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Share2 } from "lucide-react";
import ShareModal from "../components/ShareModal";
import "./PaymentSuccess.css";

const PaymentSuccess = () => {
  const { auctionId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [payment, setPayment] = useState(null);
  const [auction, setAuction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    fetchPaymentDetails();
    fetchAuctionDetails();
  }, [auctionId]);

  const fetchPaymentDetails = async () => {
    try {
      const paymentId = location.state?.paymentId;
      if (paymentId) {
        const response = await fetch(`/api/payments/${paymentId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setPayment(data);
        }
      }
    } catch (error) {
      console.error("Error fetching payment:", error);
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
                img.imageUrl ?? img.ImageUrl ?? img.image_url ?? img.url,
              altText: img.altText ?? img.AltText,
              isPrimary: img.isPrimary ?? img.IsPrimary,
            }));
            return {
              id: ji.id ?? ji.Id,
              name: ji.name ?? ji.Name,
              description: ji.description ?? ji.Description,
              images: mappedImages,
            };
          })(),
          ...data,
        };
        setAuction(normalized);
      }
    } catch (error) {
      console.error("Error fetching auction:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="payment-success-page">
        <div className="success-container">
          <div className="loading-spinner">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-success-page">
      <div className="success-container">
        <div className="success-content">
          <div className="success-icon">
            <div className="checkmark">✓</div>
          </div>

          <h1
            style={{
              fontSize: "2.5rem",
              fontWeight: "700",
              color: "#1f2937",
              marginBottom: "1rem",
            }}
          >
            Payment Successful!
          </h1>
          <p
            className="success-message"
            style={{
              fontSize: "1.1rem",
              color: "#6b7280",
              marginBottom: "2rem",
            }}
          >
            🎉 Congratulations! Your payment has been processed successfully and
            your item is now yours!
          </p>

          {auction && (
            <div className="purchase-summary">
              <h2>Purchase Summary</h2>
              <div className="summary-card">
                <div className="item-info">
                  {auction?.jewelryItem?.images &&
                  auction.jewelryItem.images.length > 0 ? (
                    <img
                      src={auction.jewelryItem.images[0].imageUrl}
                      alt={
                        auction?.title || auction?.jewelryItem?.name || "Item"
                      }
                      className="item-image"
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
                      alignItems: "center",
                      justifyContent: "center",
                      width: "120px",
                      height: "120px",
                      backgroundColor: "#f3f4f6",
                      borderRadius: "8px",
                      color: "#6b7280",
                    }}
                  >
                    No Image
                  </div>
                  <div className="item-details">
                    <h3
                      style={{
                        fontSize: "1.5rem",
                        fontWeight: "600",
                        color: "#1f2937",
                        marginBottom: "0.5rem",
                      }}
                    >
                      {auction?.title ||
                        auction?.jewelryItem?.name ||
                        "Untitled Item"}
                    </h3>
                    <p
                      className="item-description"
                      style={{ color: "#6b7280", fontSize: "0.95rem" }}
                    >
                      {auction?.jewelryItem?.description ||
                        "Beautiful jewelry item"}
                    </p>
                  </div>
                </div>

                <div className="payment-details">
                  <div className="detail-row">
                    <span>Winning Bid:</span>
                    <span className="amount">
                      {auction?.currentBid
                        ? `$${Number(auction.currentBid).toLocaleString()}`
                        : "$0.00"}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span>Processing Fee (3%):</span>
                    <span>
                      ${((Number(auction?.currentBid) || 0) * 0.03).toFixed(2)}
                    </span>
                  </div>
                  <div className="detail-row total">
                    <span>Total Paid:</span>
                    <span className="total-amount">
                      ${((Number(auction?.currentBid) || 0) * 1.03).toFixed(2)}
                    </span>
                  </div>
                  {payment && (
                    <>
                      <div className="detail-row">
                        <span>Payment Method:</span>
                        <span>{payment.method}</span>
                      </div>
                      <div className="detail-row">
                        <span>Transaction ID:</span>
                        <span className="transaction-id">
                          {payment.transactionId}
                        </span>
                      </div>
                      <div className="detail-row">
                        <span>Payment Date:</span>
                        <span>
                          {new Date(payment.processedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="next-steps">
            <h2>What happens next?</h2>
            <div className="steps-list">
              <div className="step">
                <div className="step-number">1</div>
                <div className="step-content">
                  <h4>Email Confirmation</h4>
                  <p>
                    You'll receive a confirmation email with your purchase
                    details and receipt.
                  </p>
                </div>
              </div>
              <div className="step">
                <div className="step-number">2</div>
                <div className="step-content">
                  <h4>Seller Contact</h4>
                  <p>
                    The seller will contact you within 24 hours to arrange
                    pickup or delivery.
                  </p>
                </div>
              </div>
              <div className="step">
                <div className="step-number">3</div>
                <div className="step-content">
                  <h4>Item Delivery</h4>
                  <p>
                    Coordinate with the seller for safe and secure delivery of
                    your item.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="action-buttons">
            <button
              className="btn btn-secondary"
              onClick={() => navigate("/profile")}
            >
              View My Purchases
            </button>
            <button
              className="btn btn-share"
              onClick={() => setShowShareModal(true)}
              style={{
                background: "linear-gradient(135deg, #E0AF62 0%, #d4a455 100%)",
                color: "white",
                border: "none",
                padding: "12px 24px",
                borderRadius: "8px",
                fontSize: "1rem",
                fontWeight: "600",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                transition: "all 0.2s ease",
              }}
            >
              <Share2 size={18} />
              Share My Win
            </button>
            <button className="btn btn-primary" onClick={() => navigate("/")}>
              Continue Shopping
            </button>
          </div>

          <div className="support-info">
            <p>
              Need help? Contact our support team at{" "}
              <a href="mailto:support@royalbidz.com">support@royalbidz.com</a>
            </p>
          </div>
        </div>

        {/* Share Modal */}
        <ShareModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          shareData={{
            title: `🎉 I just won ${
              auction?.title || "an amazing auction"
            } on RoyalBidz!`,
            url: `${window.location.origin}/auctions/${auctionId}`,
            description: `I successfully won this beautiful ${
              auction?.jewelryItem?.name
            } for $${Number(
              auction?.currentBid || 0
            ).toLocaleString()}! Check out RoyalBidz for amazing jewelry auctions.`,
            imageUrl: auction?.jewelryItem?.images?.[0]?.imageUrl || "",
            auctionId: parseInt(auctionId),
          }}
          type="win"
        />
      </div>
    </div>
  );
};

export default PaymentSuccess;
