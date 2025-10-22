import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import api from "../utils/api";
import {
  Heart,
  HeartOff,
  ShoppingCart,
  Trash2,
  Crown,
  Gem,
  Eye,
  Star,
  Package,
  ArrowLeft,
  Sparkles,
  Gavel,
} from "lucide-react";
import Navbar from "../components/Navbar";
import "../styles/common.css";
import "./Wishlist.css";

const Wishlist = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedItems, setSelectedItems] = useState(new Set());

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/signin");
      return;
    }
    loadWishlist();
  }, [isAuthenticated, navigate]);

  const loadWishlist = async () => {
    try {
      setLoading(true);
      const response = await api.get("/profile/wishlist");
      // normalize casing from backend (PascalCase) to frontend camelCase
      const normalized = (response.data || []).map((raw) => {
        const jewelry =
          raw?.jewelryItem ?? raw?.JewelryItem ?? raw?.Jewelry ?? null;
        const imagesRaw = (jewelry?.images || jewelry?.Images || []).map(
          (img) => ({
            imageUrl:
              img?.imageUrl ??
              img?.ImageUrl ??
              img?.ImageURL ??
              img?.Url ??
              img?.url,
            altText: img?.altText ?? img?.AltText ?? null,
            isPrimary: img?.isPrimary ?? img?.IsPrimary ?? false,
          })
        );

        const jewelryItem = jewelry
          ? {
              id: jewelry?.id ?? jewelry?.Id ?? null,
              name:
                jewelry?.name ??
                jewelry?.Name ??
                jewelry?.Title ??
                jewelry?.title,
              description:
                jewelry?.description ?? jewelry?.Description ?? jewelry?.desc,
              brand: jewelry?.brand ?? jewelry?.Brand,
              type: jewelry?.type ?? jewelry?.Type,
              primaryMaterial:
                jewelry?.primaryMaterial ?? jewelry?.PrimaryMaterial,
              condition: jewelry?.condition ?? jewelry?.Condition,
              estimatedValue:
                jewelry?.estimatedValue ?? jewelry?.EstimatedValue ?? 0,
              images: imagesRaw,
            }
          : null;

        return {
          id: raw?.id ?? raw?.Id ?? null,
          userId: raw?.userId ?? raw?.UserId ?? null,
          jewelryItemId:
            raw?.jewelryItemId ?? raw?.JewelryItemId ?? jewelryItem?.id ?? null,
          jewelryItem,
          createdAt: raw?.createdAt ?? raw?.CreatedAt ?? null,
        };
      });

      setWishlist(normalized);
    } catch (error) {
      setError("Failed to load wishlist");
      console.error("Error loading wishlist:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewItem = async (jewelryItemId) => {
    try {
      // First, check if there's an active auction for this jewelry item
      console.log(
        `[Wishlist] Checking for auction with jewelry item ID: ${jewelryItemId}`
      );
      const auctionResponse = await api.get(
        `/auctions/by-jewelry/${jewelryItemId}`
      );
      console.log("[Wishlist] Auction API response:", auctionResponse.data);

      if (
        auctionResponse.data &&
        (auctionResponse.data.id || auctionResponse.data.Id)
      ) {
        // If auction exists, navigate to auction detail page
        const auctionId = auctionResponse.data.id || auctionResponse.data.Id;
        console.log(
          `[Wishlist] Navigating to auction detail: /auctions/${auctionId}`
        );
        navigate(`/auctions/${auctionId}`);
      } else {
        // Fallback to jewelry detail page
        console.log(
          `[Wishlist] No auction found, navigating to jewelry detail: /jewelry/${jewelryItemId}`
        );
        navigate(`/jewelry/${jewelryItemId}`);
      }
    } catch (error) {
      // If auction API fails, fallback to jewelry detail page
      console.log("[Wishlist] Error checking for auction:", error);
      console.log(
        "[Wishlist] No auction found for jewelry item, redirecting to jewelry detail"
      );
      navigate(`/jewelry/${jewelryItemId}`);
    }
  };

  const removeFromWishlist = async (jewelryItemId) => {
    try {
      await api.delete(`/profile/wishlist/${jewelryItemId}`);
      setWishlist((prev) =>
        prev.filter((item) => item.jewelryItemId !== jewelryItemId)
      );
      setSelectedItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(jewelryItemId);
        return newSet;
      });
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      setError("Failed to remove item from wishlist");
    }
  };

  const removeSelectedItems = async () => {
    if (selectedItems.size === 0) return;

    try {
      const promises = Array.from(selectedItems).map((id) =>
        api.delete(`/profile/wishlist/${id}`)
      );
      await Promise.all(promises);

      setWishlist((prev) =>
        prev.filter((item) => !selectedItems.has(item.jewelryItemId))
      );
      setSelectedItems(new Set());
    } catch (error) {
      console.error("Error removing selected items:", error);
      setError("Failed to remove selected items");
    }
  };

  const toggleSelectItem = (jewelryItemId) => {
    setSelectedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(jewelryItemId)) {
        newSet.delete(jewelryItemId);
      } else {
        newSet.add(jewelryItemId);
      }
      return newSet;
    });
  };

  const selectAllItems = () => {
    if (selectedItems.size === wishlist.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(wishlist.map((item) => item.jewelryItemId)));
    }
  };

  const getJewelryImage = (item) => {
    const apiBase =
      typeof import.meta !== "undefined" && import.meta.env?.VITE_API_BASE
        ? import.meta.env.VITE_API_BASE
        : "";

    const primary =
      item.jewelryItem?.images?.[0]?.imageUrl ||
      item.jewelryItem?.images?.[0]?.ImageUrl ||
      "";

    if (primary) {
      return /^https?:\/\//i.test(primary)
        ? primary
        : apiBase && primary.startsWith("/")
        ? `${apiBase}${primary}`
        : primary;
    }

    // Fallback to uploads directory
    // if no jewelryItemId available return placeholder immediately
    const id =
      item.jewelryItemId ??
      item.id ??
      item.jewelryItem?.id ??
      item.jewelryItem?.Id;
    if (!id) return "/images/jewelry-placeholder.jpg";

    const fallbackPaths = [
      `/uploads/jewelry/${id}.jpg`,
      `/uploads/jewelry/${id}.png`,
      `/uploads/jewelry/${id}.jpeg`,
    ];

    const fallback = fallbackPaths[0];
    return apiBase && fallback.startsWith("/")
      ? `${apiBase}${fallback}`
      : fallback;
  };

  const getJewelryTypeName = (type) => {
    const typeMap = {
      0: "Ring",
      1: "Necklace",
      2: "Earrings",
      3: "Bracelet",
      4: "Watch",
      5: "Brooch",
      6: "Pendant",
      7: "Anklet",
    };
    return typeMap[type] || "Jewelry";
  };

  const getConditionName = (condition) => {
    const conditionMap = { 0: "New", 1: "Excellent", 2: "Good", 3: "Fair" };
    return conditionMap[condition] || "Unknown";
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <Navbar />
      <div className="page-container">
        {/* Hero Section */}
        <div className="card">
          <div style={{ textAlign: "center" }}>
            <h1
              style={{
                color: "#2d3748",
                fontSize: "2.5rem",
                marginBottom: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
              }}
            >
              <Heart size={32} color="#e53e3e" fill="#e53e3e" />
              My Wishlist
            </h1>
            <p
              style={{
                color: "#718096",
                fontSize: "1.1rem",
                marginBottom: "15px",
              }}
            >
              Your favorite Auctions saved for later
            </p>
            <Link
              to="/jewelry"
              className="btn btn-outline"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <ArrowLeft size={16} /> More Auctions
            </Link>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div
            className="card"
            style={{ backgroundColor: "#fed7d7", border: "1px solid #fc8181" }}
          >
            <div style={{ color: "#c53030", textAlign: "center" }}>
              {error}
              <button
                onClick={() => setError("")}
                style={{
                  float: "right",
                  background: "none",
                  border: "none",
                  color: "#c53030",
                  fontSize: "18px",
                  cursor: "pointer",
                }}
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="card">
            <div style={{ textAlign: "center", padding: "40px" }}>
              <Sparkles
                size={32}
                color="#667eea"
                style={{ marginBottom: "16px" }}
              />
              <p style={{ color: "#4a5568", fontSize: "1.1rem" }}>
                Loading your wishlist...
              </p>
            </div>
          </div>
        )}

        {/* Wishlist Content */}
        {!loading && (
          <>
            {wishlist.length === 0 ? (
              <div className="card">
                <div style={{ textAlign: "center", padding: "60px 20px" }}>
                  <HeartOff
                    size={64}
                    color="#a0aec0"
                    style={{ marginBottom: "24px" }}
                  />
                  <h3
                    style={{
                      color: "#2d3748",
                      marginBottom: "16px",
                      fontSize: "1.5rem",
                    }}
                  >
                    Your wishlist is empty
                  </h3>
                  <p
                    style={{
                      color: "#718096",
                      marginBottom: "32px",
                      lineHeight: "1.6",
                    }}
                  >
                    Start exploring our beautiful jewelry collection and add
                    items you love to your wishlist.
                  </p>
                  <Link to="/jewelry" className="btn btn-primary">
                    <Gem size={16} /> Browse Jewelry
                  </Link>
                </div>
              </div>
            ) : (
              <>
                {/* Wishlist Controls */}
                <div className="card">
                  <div className="card-header">
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "16px",
                      }}
                    >
                      <label
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          cursor: "pointer",
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={
                            selectedItems.size === wishlist.length &&
                            wishlist.length > 0
                          }
                          onChange={selectAllItems}
                          style={{ transform: "scale(1.2)" }}
                        />
                        <span style={{ color: "#4a5568", fontWeight: "500" }}>
                          Select All ({wishlist.length} items)
                        </span>
                      </label>
                    </div>
                    {selectedItems.size > 0 && (
                      <button
                        onClick={removeSelectedItems}
                        className="btn"
                        style={{
                          background:
                            "linear-gradient(135deg, #e53e3e 0%, #c53030 100%)",
                          color: "white",
                        }}
                      >
                        <Trash2 size={16} /> Remove Selected (
                        {selectedItems.size})
                      </button>
                    )}
                  </div>
                </div>

                {/* Wishlist Grid */}
                <div className="grid grid-3">
                  {wishlist.map((item, idx) => (
                    <div
                      key={item.jewelryItemId ?? item.id ?? `wish-${idx}`}
                      className="card wishlist-item-card"
                    >
                      <div style={{ position: "relative" }}>
                        {/* Selection Checkbox */}
                        <label
                          style={{
                            position: "absolute",
                            top: "12px",
                            left: "12px",
                            zIndex: 2,
                            cursor: "pointer",
                            background: "rgba(255, 255, 255, 0.9)",
                            borderRadius: "4px",
                            padding: "4px",
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={selectedItems.has(item.jewelryItemId)}
                            onChange={() =>
                              toggleSelectItem(item.jewelryItemId)
                            }
                            aria-label={`Select ${
                              item.jewelryItem?.name || "wishlist item"
                            }`}
                            style={{ transform: "scale(1.2)" }}
                          />
                        </label>

                        {/* Overlay (like Jewelry page) */}
                        <div
                          className="wishlist-overlay"
                          style={{
                            position: "absolute",
                            inset: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            zIndex: 1,
                            pointerEvents: "none",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              gap: "8px",
                              pointerEvents: "auto",
                            }}
                          >
                            <button
                              type="button"
                              className="overlay-btn primary"
                              onClick={() =>
                                handleViewItem(item.jewelryItemId || item.id)
                              }
                              aria-label="View details"
                              title="View details"
                            >
                              <Eye size={20} />
                              <span style={{ marginLeft: 8 }}>
                                View Details
                              </span>
                            </button>
                            <button
                              type="button"
                              className="overlay-btn secondary"
                              onClick={() =>
                                removeFromWishlist(item.jewelryItemId)
                              }
                              aria-label="Remove from wishlist"
                              title="Remove from wishlist"
                              style={{
                                color: "#e53e3e",
                                pointerEvents: "auto",
                              }}
                            >
                              <Heart size={20} fill="#e53e3e" />
                              <span style={{ marginLeft: 8 }}>Remove</span>
                            </button>
                          </div>
                        </div>

                        {/* corner icon-only buttons (match Jewelry list view corners) */}
                        <>
                          <button
                            className="corner-btn top-left"
                            onClick={() =>
                              handleViewItem(item.jewelryItemId || item.id)
                            }
                            aria-label="Show more"
                            title="Show more"
                            style={{
                              position: "absolute",
                              top: 12,
                              left: 12,
                              zIndex: 2,
                            }}
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            className="corner-btn top-right"
                            onClick={() =>
                              removeFromWishlist(item.jewelryItemId)
                            }
                            aria-label="Remove from wishlist"
                            title="Remove from wishlist"
                            style={{
                              position: "absolute",
                              top: 12,
                              right: 12,
                              zIndex: 2,
                              color: "#e53e3e",
                              backgroundColor: "rgba(229, 62, 62, 0.06)",
                              border: "none",
                              borderRadius: "50%",
                              width: 36,
                              height: 36,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              cursor: "pointer",
                            }}
                          >
                            <Heart size={16} fill="#e53e3e" />
                          </button>
                        </>

                        {/* Jewelry Image */}
                        <div className="wishlist-item-image">
                          <img
                            src={getJewelryImage(item)}
                            alt={item.jewelryItem?.name || "Jewelry item"}
                            onError={(e) => {
                              e.target.src = "/images/jewelry-placeholder.jpg";
                            }}
                          />

                          {/* Condition Badge */}
                          {item.jewelryItem?.condition === 0 && (
                            <div
                              style={{
                                position: "absolute",
                                bottom: "8px",
                                left: "8px",
                                background:
                                  "linear-gradient(135deg, #48bb78 0%, #38a169 100%)",
                                color: "white",
                                padding: "4px 8px",
                                borderRadius: "4px",
                                fontSize: "0.75rem",
                                fontWeight: "600",
                              }}
                            >
                              New
                            </div>
                          )}
                        </div>

                        {/* Jewelry Info */}
                        <div>
                          <h3
                            style={{
                              color: "#2d3748",
                              fontSize: "1.1rem",
                              fontWeight: "600",
                              marginBottom: "8px",
                              lineHeight: "1.3",
                            }}
                          >
                            {item.jewelryItem?.name || "Unnamed Item"}
                          </h3>

                          <div
                            style={{
                              display: "flex",
                              gap: "8px",
                              marginBottom: "12px",
                              flexWrap: "wrap",
                            }}
                          >
                            <span
                              style={{
                                background: "#edf2f7",
                                color: "#4a5568",
                                padding: "2px 8px",
                                borderRadius: "12px",
                                fontSize: "0.75rem",
                                fontWeight: "500",
                              }}
                            >
                              {getJewelryTypeName(item.jewelryItem?.type)}
                            </span>
                            <span
                              style={{
                                background: "#e6fffa",
                                color: "#00a3c4",
                                padding: "2px 8px",
                                borderRadius: "12px",
                                fontSize: "0.75rem",
                                fontWeight: "500",
                              }}
                            >
                              {getConditionName(item.jewelryItem?.condition)}
                            </span>
                          </div>

                          <p
                            style={{
                              color: "#718096",
                              fontSize: "0.9rem",
                              lineHeight: "1.4",
                              marginBottom: "16px",
                            }}
                          >
                            {item.jewelryItem?.description?.length > 80
                              ? `${item.jewelryItem.description.substring(
                                  0,
                                  80
                                )}...`
                              : item.jewelryItem?.description ||
                                "No description available"}
                          </p>

                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              marginBottom: "16px",
                            }}
                          >
                            <div>
                              <span
                                style={{
                                  color: "#718096",
                                  fontSize: "0.8rem",
                                  display: "block",
                                }}
                              >
                                Est. Value
                              </span>
                              <span
                                style={{
                                  color: "#2d3748",
                                  fontSize: "1.2rem",
                                  fontWeight: "700",
                                }}
                              >
                                $
                                {(
                                  item.jewelryItem?.estimatedValue || 0
                                ).toLocaleString()}
                              </span>
                            </div>

                            <span
                              style={{
                                color: "#718096",
                                fontSize: "0.8rem",
                              }}
                            >
                              Added{" "}
                              {new Date(item.createdAt).toLocaleDateString()}
                            </span>
                          </div>

                          {/* Bottom Actions removed as requested */}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default Wishlist;
