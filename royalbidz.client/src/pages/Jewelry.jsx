import React, { useState, useEffect } from "react";
import {
  useNavigate,
  useLocation,
  useSearchParams,
  useParams,
} from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import api from "../utils/api";
import {
  Search,
  Filter,
  Heart,
  Eye,
  Star,
  Grid3X3,
  List,
  ArrowUpDown,
  Package,
  Gem,
  Crown,
  Diamond,
  Sparkles,
} from "lucide-react";
import "./Jewelry.css";

const JewelryStore = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { category } = useParams();

  // State management
  const [jewelryItems, setJewelryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [selectedMaterial, setSelectedMaterial] = useState("All");
  const [sortBy, setSortBy] = useState("name");
  const [viewMode, setViewMode] = useState("grid");
  const [showFilters, setShowFilters] = useState(false);
  // keep inputs empty so placeholders show; treat empty as unbounded in filters
  const [priceRange, setPriceRange] = useState(["", ""]);
  // Wishlist state
  const [wishlistItems, setWishlistItems] = useState(new Set());
  const [wishlistLoading, setWishlistLoading] = useState(false);

  // Jewelry types and materials from the backend enum
  const jewelryTypes = [
    "All",
    "Ring",
    "Necklace",
    "Earrings",
    "Bracelet",
    "Watch",
    "Brooch",
    "Pendant",
    "Anklet",
  ];

  const jewelryMaterials = [
    "All",
    "Gold",
    "Silver",
    "Platinum",
    "Diamond",
    "Pearl",
    "Ruby",
    "Emerald",
    "Sapphire",
    "Other",
  ];

  // Load jewelry items and wishlist
  useEffect(() => {
    loadJewelryItems();
    if (isAuthenticated) {
      loadWishlistItems();
    }
  }, [isAuthenticated]);

  // Handle URL parameters for category filtering
  useEffect(() => {
    // Check for category in URL path parameter
    if (category) {
      const formattedCategory =
        category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();
      if (jewelryTypes.includes(formattedCategory)) {
        setSelectedType(formattedCategory);
      }
    }

    // Also check for category in search parameters (for backward compatibility)
    const categoryParam = searchParams.get("category");
    if (categoryParam) {
      const formattedCategory =
        categoryParam.charAt(0).toUpperCase() +
        categoryParam.slice(1).toLowerCase();
      if (jewelryTypes.includes(formattedCategory)) {
        setSelectedType(formattedCategory);
      }
    }
  }, [searchParams, category]);

  const loadJewelryItems = async () => {
    try {
      setLoading(true);
      const response = await api.get("/jewelry");
      setJewelryItems(response.data);
    } catch (error) {
      setError("Failed to load jewellery items");
      console.error("Error loading jewellery:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadWishlistItems = async () => {
    if (!isAuthenticated) return;

    try {
      const response = await api.get("/profile/wishlist");
      const normalized = (response.data || []).map((raw) => {
        return {
          jewelryItemId:
            raw?.jewelryItemId ??
            raw?.JewelryItemId ??
            raw?.JewelryItem?.Id ??
            raw?.JewelryItem?.id ??
            null,
        };
      });
      const wishlistIds = new Set(
        normalized.map((i) => i.jewelryItemId).filter(Boolean)
      );
      setWishlistItems(wishlistIds);
    } catch (error) {
      console.error("Error loading wishlist:", error);
    }
  };

  // Helper functions for enum mapping (moved before filtering logic)
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
    return typeMap[type] ?? "Assorted Jewelry";
  };

  const getJewelryMaterialName = (material) => {
    const materialMap = {
      0: "Gold",
      1: "Silver",
      2: "Platinum",
      3: "Diamond",
      4: "Pearl",
      5: "Ruby",
      6: "Emerald",
      7: "Sapphire",
      8: "Other",
    };
    return materialMap[material] ?? "Mixed Materials";
  };

  const getConditionName = (condition) => {
    const conditionMap = { 0: "New", 1: "Excellent", 2: "Good", 3: "Fair" };
    return conditionMap[condition] ?? "Pre-owned";
  };

  // Normalize backend JSON (support PascalCase or camelCase or different shapes)
  const normalizeItem = (raw) => {
    if (!raw)
      return {
        id: null,
        name: undefined,
        description: undefined,
        brand: undefined,
        type: undefined,
        primaryMaterial: undefined,
        condition: undefined,
        estimatedValue: undefined,
        images: [],
        createdAt: undefined,
      };

    const imagesRaw =
      raw.images || raw.Images || raw.jewelryImages || raw.JewelryImages || [];
    const images = Array.isArray(imagesRaw)
      ? imagesRaw.map((img) => ({
          imageUrl:
            img?.imageUrl ??
            img?.ImageUrl ??
            img?.ImageURL ??
            img?.url ??
            img?.Url,
          altText: img?.altText ?? img?.AltText ?? null,
          isPrimary: img?.isPrimary ?? img?.IsPrimary ?? false,
        }))
      : [];

    return {
      id: raw?.id ?? raw?.Id ?? raw?.ID ?? null,
      name: raw?.name ?? raw?.Name ?? raw?.title ?? raw?.Title,
      description: raw?.description ?? raw?.Description,
      brand: raw?.brand ?? raw?.Brand,
      type: raw?.type ?? raw?.Type,
      primaryMaterial: raw?.primaryMaterial ?? raw?.PrimaryMaterial,
      condition: raw?.condition ?? raw?.Condition,
      estimatedValue:
        raw?.estimatedValue ??
        raw?.EstimatedValue ??
        raw?.EstimatedValueInCents ??
        0,
      images,
      createdAt: raw?.createdAt ?? raw?.CreatedAt,
      yearMade: raw?.yearMade ?? raw?.YearMade,
      weight: raw?.weight ?? raw?.Weight,
      // keep original attached for fallback if needed
      __raw: raw,
    };
  };

  // Filter and sort logic
  // Work with a normalized list so front-end tolerates different backend JSON casing/shapes
  const normalizedItems = jewelryItems.map((it) => normalizeItem(it));

  const filteredAndSortedItems = normalizedItems
    .filter((item) => {
      const itemName = (item?.name || "").toString();
      const itemDescription = (item?.description || "").toString();
      const itemBrand = (item?.brand || "").toString();

      const matchesSearch =
        itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        itemDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
        itemBrand.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType = (() => {
        if (selectedType === "All") return true;
        const t = item?.type;
        if (t === null || t === undefined) return false;
        if (typeof t === "number")
          return getJewelryTypeName(t) === selectedType;
        // string: compare names case-insensitive
        return String(t).toLowerCase() === selectedType.toLowerCase();
      })();

      const matchesMaterial = (() => {
        if (selectedMaterial === "All") return true;
        const m = item?.primaryMaterial;
        if (m === null || m === undefined) return false;
        if (typeof m === "number")
          return getJewelryMaterialName(m) === selectedMaterial;
        return String(m).toLowerCase() === selectedMaterial.toLowerCase();
      })();

      const minPrice = priceRange[0] !== "" ? Number(priceRange[0]) : 0;
      const maxPrice = priceRange[1] !== "" ? Number(priceRange[1]) : 100000;
      const matchesPrice =
        Number(item?.estimatedValue || 0) >= minPrice &&
        Number(item?.estimatedValue || 0) <= maxPrice;

      return matchesSearch && matchesType && matchesMaterial && matchesPrice;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return (a?.name || "")
            .toString()
            .localeCompare((b?.name || "").toString());
        case "price-low":
          return (
            Number(a?.estimatedValue || 0) - Number(b?.estimatedValue || 0)
          );
        case "price-high":
          return (
            Number(b?.estimatedValue || 0) - Number(a?.estimatedValue || 0)
          );
        case "newest":
          return new Date(b?.createdAt || 0) - new Date(a?.createdAt || 0);
        default:
          return 0;
      }
    });

  const handleViewItem = async (itemId) => {
    try {
      // First, check if there's an active auction for this jewelry item
      console.log(`Checking for auction with jewelry item ID: ${itemId}`);
      const auctionResponse = await api.get(`/auctions/by-jewelry/${itemId}`);
      console.log("Auction API response:", auctionResponse.data);

      if (
        auctionResponse.data &&
        (auctionResponse.data.id || auctionResponse.data.Id)
      ) {
        // If auction exists, navigate to auction detail page
        const auctionId = auctionResponse.data.id || auctionResponse.data.Id;
        console.log(`Navigating to auction detail: /auctions/${auctionId}`);
        navigate(`/auctions/${auctionId}`);
      } else {
        // Fallback to jewelry detail page
        console.log(
          `No auction found, navigating to jewelry detail: /jewelry/${itemId}`
        );
        navigate(`/jewelry/${itemId}`);
      }
    } catch (error) {
      // If auction API fails, fallback to jewelry detail page
      console.log("Error checking for auction:", error);
      alert(`Error: ${error.message}`);
      console.log(
        "No auction found for jewelry item, redirecting to jewelry detail"
      );
      navigate(`/jewelry/${itemId}`);
    }
  };

  const handleAddToWishlist = async (itemId) => {
    if (!isAuthenticated) {
      navigate("/signin");
      return;
    }

    setWishlistLoading(true);

    try {
      const isInWishlist = wishlistItems.has(itemId);

      if (isInWishlist) {
        // Remove from wishlist
        await api.delete(`/profile/wishlist/${itemId}`);
        setWishlistItems((prev) => {
          const newSet = new Set(prev);
          newSet.delete(itemId);
          return newSet;
        });
      } else {
        // Add to wishlist
        await api.post(`/profile/wishlist/${itemId}`);
        setWishlistItems((prev) => new Set([...prev, itemId]));
      }
    } catch (error) {
      console.error("Error managing wishlist:", error);
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert("Failed to update wishlist. Please try again.");
      }
    } finally {
      setWishlistLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="jewelry-loading">
        <div className="loading-spinner">
          <Sparkles className="loading-icon" />
          <p>Loading beautiful jewellery...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="jewelry-store">
      {/* Hero Section */}
      <section className="jewelry-hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1>
              <Crown className="hero-icon" />
              Exquisite Jewellery Auctions
            </h1>
            <p>
              Discover timeless elegance and exceptional craftsmanship in our
              curated selection of fine jewellery auctions
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filter Bar */}
      <section className="jewelry-controls">
        <div className="container">
          <div className="search-bar">
            <div className="search-input-container">
              <Search className="search-icon" />
              <input
                type="text"
                placeholder="Search for jewellery, brands, or materials..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>

            <button
              className={`filter-toggle ${showFilters ? "active" : ""}`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter size={20} />
              Filters
            </button>

            <div className="view-controls">
              <button
                className={`view-btn ${viewMode === "grid" ? "active" : ""}`}
                onClick={() => setViewMode("grid")}
              >
                <Grid3X3 size={20} />
              </button>
              <button
                className={`view-btn ${viewMode === "list" ? "active" : ""}`}
                onClick={() => setViewMode("list")}
              >
                <List size={20} />
              </button>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="advanced-filters">
              <div className="filter-row">
                <div className="filter-group">
                  <label>Type</label>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                  >
                    {jewelryTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="filter-group">
                  <label>Material</label>
                  <select
                    value={selectedMaterial}
                    onChange={(e) => setSelectedMaterial(e.target.value)}
                  >
                    {jewelryMaterials.map((material) => (
                      <option key={material} value={material}>
                        {material}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="filter-group">
                  <label>Sort By</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="name">Name A-Z</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="newest">Newest First</option>
                  </select>
                </div>

                <div className="filter-group price-range">
                  <label>Price Range</label>
                  <div className="price-inputs">
                    <div className="price-input-group">
                      <input
                        type="number"
                        min="0"
                        max="1000000"
                        step="100"
                        value={priceRange[0]}
                        onChange={(e) => {
                          const v =
                            e.target.value === ""
                              ? ""
                              : parseInt(e.target.value, 10) || 0;
                          setPriceRange([v, priceRange[1]]);
                        }}
                        placeholder="min"
                        aria-label="min price"
                      />
                    </div>
                    <div className="price-input-group">
                      <input
                        type="number"
                        min="0"
                        max="1000000"
                        step="100"
                        value={priceRange[1]}
                        onChange={(e) => {
                          const v =
                            e.target.value === ""
                              ? ""
                              : parseInt(e.target.value, 10) || 100000;
                          setPriceRange([priceRange[0], v]);
                        }}
                        placeholder="max"
                        aria-label="max price"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Results Summary */}
      <section className="results-summary">
        <div className="container">
          <div className="results-info">
            <p>{filteredAndSortedItems.length} jewellery items found</p>
            {(searchTerm ||
              selectedType !== "All" ||
              selectedMaterial !== "All") && (
              <button
                className="clear-filters"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedType("All");
                  setSelectedMaterial("All");
                  setPriceRange([0, 100000]);
                }}
              >
                Clear all filters
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Jewelry Grid */}
      <section className="jewelry-grid-section">
        <div className="container">
          {error && (
            <div className="error-message">
              <Package className="error-icon" />
              <p>{error}</p>
            </div>
          )}

          {filteredAndSortedItems.length === 0 && !loading && !error && (
            <div className="no-results">
              <Gem className="no-results-icon" />
              <h3>No Auctions found</h3>
              <p>Try adjusting your search terms or filters</p>
            </div>
          )}

          <div className={`jewelry-grid ${viewMode}`}>
            {filteredAndSortedItems.map((item, index) => (
              <div
                key={item?.id || `jewellery-item-${index}`}
                className="jewelry-card"
              >
                <div className="jewelry-image-container">
                  {/* determine image source with sensible fallbacks (primary image, uploaded file by id, default) */}
                  {(() => {
                    // determine base API URL (Vite env only) — otherwise use relative paths so the dev proxy handles uploads
                    const apiBase =
                      typeof import.meta !== "undefined" &&
                      import.meta.env?.VITE_API_BASE
                        ? import.meta.env.VITE_API_BASE
                        : "";

                    const primary =
                      item.images?.[0]?.imageUrl ||
                      item.images?.[0]?.ImageUrl ||
                      "";
                    const fallbackPaths = [
                      `/uploads/jewelry/${item.id}.jpg`,
                      `/uploads/jewelry/${item.id}.png`,
                      `/uploads/jewelry/${item.id}.jpeg`,
                    ];

                    const pickSrc = (p) => {
                      if (!p) return null;
                      // absolute URL -> use as-is
                      if (/^https?:\/\//i.test(p)) return p;
                      // if path starts with /uploads and we have an apiBase, prefix it
                      if (p.startsWith("/") && apiBase) return `${apiBase}${p}`;
                      return p; // relative path
                    };

                    let src = pickSrc(primary) || null;
                    if (!src) {
                      for (const p of fallbackPaths) {
                        const candidate = pickSrc(p);
                        // don't perform network existence check here; candidate will 404 if missing
                        src = candidate;
                        break;
                      }
                    }
                    if (!src) src = "/images/jewelry-placeholder.jpg";

                    return (
                      <img
                        src={src}
                        alt={item.name || "Jewellery item"}
                        className="jewelry-image"
                      />
                    );
                  })()}

                  {/* center overlay used for grid view */}
                  <div className="jewelry-overlay">
                    <button
                      className="overlay-btn primary"
                      onClick={() => handleViewItem(item.id)}
                    >
                      <Eye size={20} />
                      View Details
                    </button>
                    <button
                      className="overlay-btn secondary"
                      onClick={() => handleAddToWishlist(item.id)}
                      disabled={wishlistLoading}
                      style={{
                        color: wishlistItems.has(item.id)
                          ? "#e53e3e"
                          : "inherit",
                      }}
                    >
                      <Heart
                        size={20}
                        fill={wishlistItems.has(item.id) ? "#e53e3e" : "none"}
                      />
                      {wishlistItems.has(item.id) ? "In Wishlist" : "Wishlist"}
                    </button>
                  </div>

                  {/* corner icon-only buttons for list view */}
                  {viewMode === "list" && (
                    <>
                      <button
                        className="corner-btn top-left"
                        onClick={() => handleViewItem(item.id)}
                        aria-label="Show more"
                        title="Show more"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        className="corner-btn top-right"
                        onClick={() => handleAddToWishlist(item.id)}
                        disabled={wishlistLoading}
                        aria-label={
                          wishlistItems.has(item.id)
                            ? "Remove from wishlist"
                            : "Add to wishlist"
                        }
                        title={
                          wishlistItems.has(item.id)
                            ? "Remove from wishlist"
                            : "Add to wishlist"
                        }
                        style={{
                          color: wishlistItems.has(item.id)
                            ? "#e53e3e"
                            : "white",
                          backgroundColor: wishlistItems.has(item.id)
                            ? "rgba(229, 62, 62, 0.1)"
                            : "rgba(0, 0, 0, 0.7)",
                        }}
                      >
                        <Heart
                          size={16}
                          fill={wishlistItems.has(item.id) ? "#e53e3e" : "none"}
                        />
                      </button>
                    </>
                  )}

                  <div className="jewelry-badges">
                    {item?.condition === 0 && (
                      <span className="badge new">New</span>
                    )}
                    {item?.brand && (
                      <span className="badge brand">{item.brand}</span>
                    )}
                  </div>
                </div>

                <div className="jewelry-info">
                  <div className="jewelry-header">
                    <h3 className="jewelry-name">
                      {item?.name || "Unnamed Item"}
                    </h3>
                    <div className="jewelry-meta">
                      <span className="jewelry-type">
                        {getJewelryTypeName(item?.type)}
                      </span>
                      <span className="jewelry-material">
                        {getJewelryMaterialName(item?.primaryMaterial)}
                      </span>
                    </div>
                  </div>

                  <p className="jewelry-description">
                    {(item?.description || "").length > 100
                      ? `${(item?.description || "").substring(0, 100)}...`
                      : item?.description || "No description available"}
                  </p>

                  <div className="jewelry-details">
                    {item.weight && (
                      <div className="detail-item">
                        <span className="detail-label">Weight:</span>
                        <span className="detail-value">{item.weight}g</span>
                      </div>
                    )}
                    {item.yearMade && (
                      <div className="detail-item">
                        <span className="detail-label">Year:</span>
                        <span className="detail-value">{item.yearMade}</span>
                      </div>
                    )}
                    <div className="detail-item">
                      <span className="detail-label">Condition:</span>
                      <span className="detail-value">
                        {getConditionName(item?.condition)}
                      </span>
                    </div>
                  </div>

                  <div className="jewelry-footer">
                    <div className="jewelry-price">
                      <span className="price-label">Est. Value</span>
                      <span className="price-value">
                        ${(item?.estimatedValue || 0)?.toLocaleString()}
                      </span>
                    </div>

                    <div className="jewelry-actions">
                      <button
                        className="btn-primary"
                        onClick={() => handleViewItem(item.id)}
                      >
                        View Item
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default JewelryStore;
