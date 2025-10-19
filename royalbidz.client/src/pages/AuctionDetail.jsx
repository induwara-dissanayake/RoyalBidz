import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import * as signalR from "@microsoft/signalr";
import api from "../utils/api";
import {
  Gavel,
  Clock,
  Users,
  Heart,
  Share2,
  Eye,
  Crown,
  Gem,
  TrendingUp,
  DollarSign,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
  Zap,
  Timer,
} from "lucide-react";
import Navbar from "../components/Navbar";
import "./AuctionDetail.css";

const AuctionDetail = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // State management
  const [auction, setAuction] = useState(null);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [bidAmount, setBidAmount] = useState("");
  const [placingBid, setPlacingBid] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState("");
  const [connection, setConnection] = useState(null);
  const [bidHistory, setBidHistory] = useState([]);
  const [activeUsers, setActiveUsers] = useState(0);
  const [isWatchlisted, setIsWatchlisted] = useState(false);
  const [mainImageIndex, setMainImageIndex] = useState(0);

  // Helper functions to format jewelry details
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
      Ring: "Ring",
      Necklace: "Necklace",
      Earrings: "Earrings",
      Bracelet: "Bracelet",
      Watch: "Watch",
      Brooch: "Brooch",
      Pendant: "Pendant",
      Anklet: "Anklet",
    };
    return typeMap[type] ?? "Fine Jewelry";
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
      Gold: "Gold",
      Silver: "Silver",
      Platinum: "Platinum",
      Diamond: "Diamond",
      Pearl: "Pearl",
      Ruby: "Ruby",
      Emerald: "Emerald",
      Sapphire: "Sapphire",
      Other: "Other",
    };
    return materialMap[material] ?? "Precious Metal";
  };

  const getConditionName = (condition) => {
    const conditionMap = {
      0: "New",
      1: "Excellent",
      2: "Good",
      3: "Fair",
      New: "New",
      Excellent: "Excellent",
      Good: "Good",
      Fair: "Fair",
    };
    return conditionMap[condition] ?? "Pre-owned";
  };

  // Load auction details
  useEffect(() => {
    loadAuctionDetails();
    loadBidHistory();
    checkWatchlistStatus();
  }, [id]);

  // Safety timeout: if loading stays true for too long, surface an error and stop the spinner.
  useEffect(() => {
    if (!loading) return;
    const t = setTimeout(() => {
      if (loading) {
        console.error("AuctionDetail: load timeout after 10s");
        setError("Loading timed out. Please refresh the page.");
        setLoading(false);
      }
    }, 10000);
    return () => clearTimeout(t);
  }, [loading]);

  // Setup SignalR connection
  useEffect(() => {
    if (isAuthenticated && id) {
      setupSignalRConnection();
    }
    return () => {
      if (connection) {
        connection.stop();
      }
    };
  }, [isAuthenticated, id]);

  // Timer for countdown
  useEffect(() => {
    const timer = setInterval(() => {
      if (auction?.endTime) {
        const remaining = calculateTimeRemaining(auction.endTime);
        setTimeRemaining(remaining);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [auction]);

  const loadAuctionDetails = async () => {
    try {
      console.debug("AuctionDetail: loading auction", id);
      setLoading(true);
      const response = await api.get(`/auctions/${id}`);
      console.debug("AuctionDetail: raw response", response?.data);
      const data = normalizeAuctionResponse(response.data);
      if (!data || !data.id) {
        console.error(
          "AuctionDetail: unexpected auction payload",
          response?.data
        );
        setError("Invalid auction data received from server.");
        setAuction(null);
        return;
      }
      setAuction(data);

      // Set initial bid amount to next increment (defensive)
      const current = parseFloat(
        data.currentBid ?? data.CurrentBid ?? data.startingBid ?? 0
      );
      const increment =
        parseFloat(data.bidIncrement ?? data.BidIncrement ?? 0) || 0;
      const nextBid = current + increment;
      setBidAmount(isFinite(nextBid) ? nextBid.toFixed(2) : "");
    } catch (error) {
      setError("Failed to load auction details");
      console.error(
        "Error loading auction:",
        error?.response ?? error?.message ?? error
      );
    } finally {
      setLoading(false);
    }
  };

  const loadBidHistory = async () => {
    try {
      const response = await api.get(`/bids/auction/${id}`);
      // response may be an array, or an object with properties like
      // { bids: [...] } | { Bids: [...] } | { BidHistory: [...] } (BidHistoryDto)
      const payload = response.data;
      let bids = [];

      if (Array.isArray(payload)) {
        // If array items themselves contain a 'Bids' array (BidHistoryDto), flatten it
        if (payload.length > 0 && (payload[0].Bids || payload[0].bids)) {
          bids = payload.flatMap((p) => p.Bids ?? p.bids ?? []);
        } else {
          bids = payload;
        }
      } else if (payload) {
        // object shapes
        if (payload.BidHistory || payload.bidHistory) {
          const list = payload.BidHistory ?? payload.bidHistory ?? [];
          // each item may be a BidHistoryDto with a Bids array
          bids = list.flatMap((entry) => entry.Bids ?? entry.bids ?? []);
        } else if (payload.Bids || payload.bids) {
          bids = payload.Bids ?? payload.bids ?? [];
        } else {
          // fallback: try to find any array-valued property that looks like bids
          const maybe = Object.values(payload).find((v) => Array.isArray(v));
          bids = maybe ?? [];
        }
      }

      setBidHistory((bids || []).map(normalizeBid));
    } catch (error) {
      console.error("Error loading bid history:", error);
    }
  };

  // Helpers to normalize API shapes (PascalCase vs camelCase)
  const normalizeAuctionResponse = (src) => {
    if (!src) return src;
    // Quick mapping for common fields used here
    return {
      ...src,
      id: src.id ?? src.Id ?? src.ID,
      title: src.title ?? src.Title,
      description: src.description ?? src.Description,
      startingBid: src.startingBid ?? src.StartingBid ?? src.starting_bid,
      currentBid: src.currentBid ?? src.CurrentBid ?? src.Current_Bid ?? 0,
      bidIncrement:
        src.bidIncrement ?? src.BidIncrement ?? src.bid_increment ?? 0,
      startTime: src.startTime ?? src.StartTime ?? src.start_time,
      endTime: src.endTime ?? src.EndTime ?? src.end_time,
      jewelryItem: normalizeJewelryItem(
        src.jewelryItem ?? src.JewelryItem ?? src.jewelry_item
      ),
      seller: src.seller ?? src.Seller,
      winningBidder: src.winningBidder ?? src.WinningBidder,
      reservePrice: src.reservePrice ?? src.ReservePrice,
      buyNowPrice: src.buyNowPrice ?? src.BuyNowPrice,
      viewCount: src.viewCount ?? src.ViewCount ?? 0,
    };
  };

  const normalizeBid = (b) => ({
    ...b,
    id: b.id ?? b.Id,
    amount: b.amount ?? b.Amount,
    // Normalize bidder into a simple { id, username } shape supporting multiple payloads
    bidder: (() => {
      const raw = b.bidder ?? b.Bidder ?? null;
      if (raw) {
        return {
          id:
            raw.id ??
            raw.Id ??
            raw.userId ??
            raw.UserId ??
            raw.bidderId ??
            raw.BidderId ??
            null,
          username: (() => {
            // Prefer common username fields (both camelCase and PascalCase), then fall back to name/email
            const nameCandidates = [
              raw.username,
              raw.Username,
              raw.userName,
              raw.UserName,
              raw.name,
              raw.Name,
            ];
            const found = nameCandidates.find(
              (v) => v && v.toString().trim() !== ""
            );
            if (found) return found;
            // Try nested user
            const nestedUser = raw.user ?? raw.User ?? null;
            if (nestedUser) {
              return (
                nestedUser.username ??
                nestedUser.Username ??
                nestedUser.email ??
                nestedUser.Email ??
                null
              );
            }
            // Try email or first+last
            if (raw.Email || raw.email) return raw.Email ?? raw.email;
            if (
              raw.FirstName ||
              raw.Firstname ||
              raw.firstName ||
              raw.firstname
            ) {
              return (
                (raw.FirstName ??
                  raw.firstName ??
                  raw.firstname ??
                  raw.Firstname) + (raw.LastName ? ` ${raw.LastName}` : "")
              ).trim();
            }
            return null;
          })(),
        };
      }
      if (b.BidderId || b.BidderName) {
        return { id: b.BidderId ?? null, username: b.BidderName ?? null };
      }
      return null;
    })(),
    bidTime: b.bidTime ?? b.BidTime ?? b.Timestamp,
  });

  const normalizeJewelryItem = (j) => {
    if (!j) return null;
    const images = j.images ?? j.Images ?? j.ImagesList ?? [];
    return {
      id: j.id ?? j.Id,
      name: j.name ?? j.Name,
      description: j.description ?? j.Description,
      type:
        j.type ?? j.Type ?? (j.Type !== undefined ? String(j.Type) : undefined),
      primaryMaterial:
        j.primaryMaterial ??
        j.PrimaryMaterial ??
        (j.PrimaryMaterial !== undefined
          ? String(j.PrimaryMaterial)
          : undefined),
      condition:
        j.condition ??
        j.Condition ??
        (j.Condition !== undefined ? String(j.Condition) : undefined),
      estimatedValue:
        j.estimatedValue ?? j.EstimatedValue ?? j.estimated_value ?? null,
      weight: j.weight ?? j.Weight ?? null,
      images: Array.isArray(images)
        ? images.map((img) => ({
            id: img.id ?? img.Id,
            imageUrl: img.imageUrl ?? img.ImageUrl ?? img.url ?? img.Url,
            altText: img.altText ?? img.AltText ?? img.alt_text ?? null,
            isPrimary: img.isPrimary ?? img.IsPrimary ?? false,
          }))
        : [],
    };
  };

  const checkWatchlistStatus = async () => {
    if (!isAuthenticated) return;

    try {
      const response = await api.get(`/profile/watchlist/${id}/check`);
      console.debug("AuctionDetail: watchlist check response", response?.data);
      // backend may return { isInWishlist } or { isWatchlisted }
      const body = response?.data || {};
      const val =
        body.isWatchlisted ?? body.isInWishlist ?? body.is_in_wishlist ?? false;
      setIsWatchlisted(Boolean(val));
    } catch (error) {
      console.error(
        "Error checking watchlist status:",
        error?.response ?? error?.message ?? error
      );
    }
  };

  const setupSignalRConnection = async () => {
    // Avoid creating multiple connections
    if (
      connection &&
      (connection.state === signalR.HubConnectionState.Connected ||
        connection.state === signalR.HubConnectionState.Connecting)
    ) {
      console.debug("SignalR: connection already active");
      return;
    }

    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl("/auctionHub", {
        accessTokenFactory: () => localStorage.getItem("token"),
      })
      // enable automatic reconnect with short initial retries
      .withAutomaticReconnect([0, 2000, 5000, 10000])
      .build();

    try {
      await newConnection.start();
      await newConnection.invoke("JoinAuction", id.toString());

      newConnection.onclose((err) => {
        console.info("SignalR: connection closed", err);
      });

      // Listen for bid updates (normalize incoming shape, dedupe, then insert)
      newConnection.on("BidUpdate", (bidUpdate) => {
        try {
          const nb = normalizeBid(bidUpdate);

          setAuction((prev) => ({
            ...prev,
            currentBid: nb.amount ?? prev.currentBid,
            winningBidderId: nb.bidder?.id ?? prev.winningBidderId,
          }));

          // Prevent duplicate entries: use id if available, otherwise compare bidder+time
          setBidHistory((prev) => {
            const exists = prev.some((b) => {
              // If both have an id, compare them
              if (nb.id && b.id) return String(b.id) === String(nb.id);

              // Fallback: compare bidder id/username + timestamp + amount
              const bBidderId =
                b.bidder?.id ?? b.BidderId ?? b.bidder?.Id ?? null;
              const nbBidderId =
                nb.bidder?.id ?? nb.BidderId ?? nb.bidder?.Id ?? null;

              const bBidderName =
                b.bidder?.username ??
                b.bidder?.Username ??
                b.BidderName ??
                null;
              const nbBidderName =
                nb.bidder?.username ??
                nb.bidder?.Username ??
                nb.BidderName ??
                null;

              const bTime = String(b.bidTime ?? b.BidTime ?? b.Timestamp ?? "");
              const nbTime = String(
                nb.bidTime ?? nb.BidTime ?? nb.Timestamp ?? ""
              );

              const bAmount = String(b.amount ?? b.Amount ?? "");
              const nbAmount = String(nb.amount ?? nb.Amount ?? "");

              return (
                (nbBidderId &&
                  bBidderId &&
                  String(nbBidderId) === String(bBidderId) &&
                  nbTime === bTime &&
                  nbAmount === bAmount) ||
                (nbBidderName &&
                  bBidderName &&
                  String(nbBidderName) === String(bBidderName) &&
                  nbTime === bTime &&
                  nbAmount === bAmount)
              );
            });

            if (exists) return prev;
            return [nb, ...prev];
          });

          // Update next bid amount defensively
          const increment = auction?.bidIncrement ?? auction?.BidIncrement ?? 0;
          const nextBid = (nb.amount ?? 0) + parseFloat(increment || 0);
          if (!Number.isNaN(nextBid)) setBidAmount(nextBid.toFixed(2));
        } catch (err) {
          console.error("Error handling BidUpdate:", err, bidUpdate);
        }
      });

      // Listen for user join/leave
      newConnection.on("UserJoined", () => {
        setActiveUsers((prev) => prev + 1);
      });

      newConnection.on("UserLeft", () => {
        setActiveUsers((prev) => Math.max(0, prev - 1));
      });

      setConnection(newConnection);
    } catch (error) {
      console.error("SignalR connection failed:", error);
    }
  };

  const placeBid = async () => {
    if (!isAuthenticated) {
      navigate("/signin");
      return;
    }
    const amount = parseFloat(bidAmount);
    if (isNaN(amount)) {
      alert("Please enter a valid bid amount.");
      return;
    }

    // Determine current and increment defensively
    const current = parseFloat(
      auction.currentBid ?? auction.CurrentBid ?? auction.startingBid ?? 0
    );
    const increment =
      parseFloat(auction.bidIncrement ?? auction.BidIncrement ?? 0) || 0;
    const minAllowed = current + increment;

    if (amount < minAllowed) {
      alert(`Bid amount must be at least $${minAllowed.toFixed(2)}`);
      return;
    }

    setPlacingBid(true);
    try {
      // Use PascalCase keys expected by the server DTO
      const payload = {
        AuctionId: parseInt(id, 10),
        Amount: amount,
        IsAutomaticBid: false,
      };

      // Pre-validate with server to surface validation reasons (avoids opaque 400)
      try {
        const validResp = await api.post("/bids/validate", payload);
        const isValid = validResp?.data?.isValid ?? validResp?.data ?? false;
        if (!isValid) {
          alert("Server rejected bid: bid does not meet minimum requirements.");
          setPlacingBid(false);
          return;
        }
      } catch (vErr) {
        // If validate endpoint returns error, surface it but continue to attempt placing bid
        console.warn(
          "Bid validation endpoint returned an error, proceeding to place bid. Details:",
          vErr?.response?.data ?? vErr.message
        );
      }

      const resp = await api.post("/bids", payload);
      // Optionally update UI immediately with response
      let created = resp.data;
      if (created) {
        // normalize server shape
        created = normalizeBid(created);

        // insert if not already present
        setBidHistory((prev) => {
          const exists = prev.some(
            (b) => b.id && created.id && String(b.id) === String(created.id)
          );
          if (exists) return prev;
          return [created, ...prev];
        });

        setAuction((prev) => ({
          ...prev,
          currentBid: created.amount ?? created.Amount ?? prev.currentBid,
        }));
        // Soft refresh after successful bid: re-fetch auction and bids to ensure consistency
        try {
          await loadAuctionDetails();
          await loadBidHistory();
        } catch (refreshErr) {
          console.warn("AuctionDetail: refresh after bid failed:", refreshErr);
        }
      }

      // The bid update will also come through SignalR
    } catch (error) {
      console.error("Error placing bid:", error);
      // Show full server response payload when available to help debugging
      const respData = error?.response?.data;
      if (respData) {
        console.error("Server response body:", respData);
        // If server returned { message: '...' } show that, otherwise stringify
        const serverMessage = respData.message ?? JSON.stringify(respData);
        alert(serverMessage);
      } else {
        alert(error.message || "Failed to place bid");
      }
    } finally {
      setPlacingBid(false);
    }
  };

  const toggleWatchlist = async () => {
    if (!isAuthenticated) {
      navigate("/signin");
      return;
    }

    try {
      if (isWatchlisted) {
        await api.delete(`/profile/watchlist/${id}`);
        setIsWatchlisted(false);
      } else {
        await api.post(`/profile/watchlist/${id}`);
        setIsWatchlisted(true);
      }
    } catch (error) {
      console.error("Error toggling watchlist:", error);
    }
  };

  const calculateTimeRemaining = (endTime) => {
    const now = new Date().getTime();
    const end = new Date(endTime).getTime();
    const diff = end - now;

    if (diff <= 0) return "Auction Ended";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
    return `${minutes}m ${seconds}s`;
  };

  const getAuctionStatus = () => {
    if (!auction) return { text: "Loading...", color: "#6b7280" };

    const now = new Date();
    const start = new Date(auction.startTime);
    const end = new Date(auction.endTime);

    if (now < start) return { text: "Scheduled", color: "#f59e0b" };
    if (now > end) return { text: "Ended", color: "#ef4444" };
    return { text: "Live", color: "#10b981" };
  };

  const getJewelryImageUrl = (jewelryItem, index = 0) => {
    // Return relative paths so Vite dev server proxy handles them and avoids opaque responses.
    const imageFromArray = jewelryItem?.images?.[index]?.imageUrl;
    if (imageFromArray) {
      // If the backend already returns a full URL use it, otherwise treat it as a relative path
      return /^https?:\/\//i.test(imageFromArray)
        ? imageFromArray
        : `${imageFromArray.startsWith("/") ? "" : ""}${imageFromArray}`;
    }

    const fallbackPaths = [
      `/uploads/jewelry/${jewelryItem?.id}.jpg`,
      `/uploads/jewelry/${jewelryItem?.id}-${index + 1}.jpg`,
      `/uploads/jewelry/jewelry-${jewelryItem?.id}-${index}.png`,
      `/uploads/jewelry/${index + 1}.png`,
    ];

    return fallbackPaths[index % fallbackPaths.length];
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="auction-detail-loading">
          <div className="loading-spinner">
            <Gavel className="loading-icon" />
            <p>Loading auction details...</p>
          </div>
        </div>
      </>
    );
  }

  if (error || !auction) {
    return (
      <>
        <Navbar />
        <div className="auction-detail-error">
          <AlertCircle size={48} color="#ef4444" />
          <h2>Auction Not Found</h2>
          <p>{error || "The requested auction could not be found."}</p>
          <Link to="/auctions" className="btn btn-primary">
            <ArrowLeft size={16} />
            Back to Auctions
          </Link>
        </div>
      </>
    );
  }

  const status = getAuctionStatus();
  const isLive = status.text === "Live";
  const hasEnded = status.text === "Ended";

  return (
    <>
      <Navbar />
      <div className="auction-detail">
        {/* Breadcrumb */}
        <div className="auction-breadcrumb">
          <div className="container">
            <Link to="/" className="breadcrumb-link">
              Home
            </Link>
            <span className="breadcrumb-separator">/</span>
            <Link to="/auctions" className="breadcrumb-link">
              Auctions
            </Link>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-current">{auction.title}</span>
          </div>
        </div>

        <div className="full-width-container">
          {/* Main Content Grid */}
          <div className="auction-grid">
            {/* Left Side - Auction Details */}
            <div className="auction-left">
              {/* Image Gallery */}
              <div className="auction-images">
                <div className="image-gallery">
                  <div className="main-image-container">
                    <img
                      src={getJewelryImageUrl(
                        auction.jewelryItem,
                        mainImageIndex
                      )}
                      alt={auction.jewelryItem?.name || auction.title}
                      className="main-image"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />

                    {/* Status Badge */}
                    <div
                      className={`status-badge ${status.text.toLowerCase()}`}
                    >
                      {status.text === "Live" && <Zap size={16} />}
                      {status.text === "Scheduled" && <Timer size={16} />}
                      {status.text === "Ended" && <CheckCircle size={16} />}
                      {status.text}
                    </div>
                  </div>

                  <div className="thumbnail-grid">
                    {[0, 1, 2, 3].map((index) => (
                      <div key={index} className="thumbnail-container">
                        <img
                          src={getJewelryImageUrl(auction.jewelryItem, index)}
                          alt={`${
                            auction.jewelryItem?.name || auction.title
                          } - Image ${index + 1}`}
                          className="thumbnail-image"
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                          onClick={() => setMainImageIndex(index)}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="image-actions">
                  <button
                    className={`action-btn ${isWatchlisted ? "active" : ""}`}
                    onClick={toggleWatchlist}
                    title={
                      isWatchlisted
                        ? "Remove from Watchlist"
                        : "Add to Watchlist"
                    }
                  >
                    <Heart
                      size={20}
                      fill={isWatchlisted ? "#e53e3e" : "none"}
                    />
                    {isWatchlisted ? "Watching" : "Watch"}
                  </button>

                  <button className="action-btn" title="Share Auction">
                    <Share2 size={20} />
                    Share
                  </button>
                </div>
              </div>

              {/* Auction Info */}
              <div className="auction-info">
                <div className="auction-header">
                  <h1 className="auction-title">{auction.title}</h1>
                  <div className="auction-meta">
                    <span className="lot-number">Lot #{auction.id}</span>
                    <span className="separator">•</span>
                    <span className="seller">
                      Seller: {auction.seller?.username || "Royal Bidz Seller"}
                    </span>
                  </div>
                </div>

                <div className="auction-description">
                  <h3>Description</h3>
                  <p>{auction.description || "No description available."}</p>
                </div>

                {/* Jewelry Details */}
                {auction.jewelryItem && (
                  <div className="jewelry-details">
                    <h3>
                      <Gem size={20} />
                      Item Details
                    </h3>
                    <div className="details-grid">
                      <div className="detail-item">
                        <span className="label">Type:</span>
                        <span className="value">
                          {getJewelryTypeName(auction.jewelryItem.type)}
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="label">Material:</span>
                        <span className="value">
                          {getJewelryMaterialName(
                            auction.jewelryItem.primaryMaterial
                          )}
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="label">Condition:</span>
                        <span className="value">
                          {getConditionName(auction.jewelryItem.condition)}
                        </span>
                      </div>
                      {auction.jewelryItem.weight && (
                        <div className="detail-item">
                          <span className="label">Weight:</span>
                          <span className="value">
                            {auction.jewelryItem.weight}g
                          </span>
                        </div>
                      )}
                      <div className="detail-item">
                        <span className="label">Estimated Value:</span>
                        <span className="value highlight">
                          $
                          {auction.jewelryItem.estimatedValue?.toLocaleString() ||
                            "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Auction Terms */}
                <div className="auction-terms">
                  <h3>Auction Terms</h3>
                  <div className="terms-grid">
                    <div className="term-item">
                      <span className="label">Starting Bid:</span>
                      <span className="value">
                        ${auction.startingBid?.toLocaleString()}
                      </span>
                    </div>
                    <div className="term-item">
                      <span className="label">Bid Increment:</span>
                      <span className="value">
                        ${auction.bidIncrement?.toLocaleString()}
                      </span>
                    </div>
                    {auction.reservePrice && (
                      <div className="term-item">
                        <span className="label">Reserve Price:</span>
                        <span className="value">
                          ${auction.reservePrice?.toLocaleString()}
                        </span>
                      </div>
                    )}
                    {auction.buyNowPrice && (
                      <div className="term-item">
                        <span className="label">Buy Now:</span>
                        <span className="value highlight">
                          ${auction.buyNowPrice?.toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Bidding Interface */}
            <div className="auction-right">
              <div className="bidding-panel">
                {/* Current Bid Display */}
                <div className="current-bid">
                  <h3>
                    <TrendingUp size={24} />
                    Current Bid
                  </h3>
                  <div className="bid-amount">
                    $
                    {auction.currentBid?.toLocaleString() ||
                      auction.startingBid?.toLocaleString()}
                  </div>
                  {auction.currentBid > 0 && (
                    <div className="winning-bidder">
                      Leading Bidder:{" "}
                      {auction.winningBidder?.username || "Anonymous"}
                    </div>
                  )}
                </div>

                {/* Auction Timeline */}
                <div className="auction-timeline">
                  <div className="timeline-item">
                    <Clock size={16} />
                    <div className="timeline-content">
                      <span className="timeline-label">Time Remaining:</span>
                      <span
                        className={`timeline-value ${
                          timeRemaining.includes("m") &&
                          !timeRemaining.includes("h") &&
                          !timeRemaining.includes("d")
                            ? "urgent"
                            : ""
                        }`}
                      >
                        {timeRemaining}
                      </span>
                    </div>
                  </div>

                  <div className="timeline-item">
                    <Timer size={16} />
                    <div className="timeline-content">
                      <span className="timeline-label">Start Time:</span>
                      <span className="timeline-value">
                        {new Date(auction.startTime).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="timeline-item">
                    <Timer size={16} />
                    <div className="timeline-content">
                      <span className="timeline-label">End Time:</span>
                      <span className="timeline-value">
                        {new Date(auction.endTime).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Auction Statistics */}
                <div className="auction-stats">
                  <div className="stat-item">
                    <Users size={16} />
                    <span className="stat-value">{activeUsers}</span>
                    <span className="stat-label">Watching</span>
                  </div>
                  <div className="stat-item">
                    <Gavel size={16} />
                    <span className="stat-value">{bidHistory.length}</span>
                    <span className="stat-label">Bids</span>
                  </div>
                  <div className="stat-item">
                    <Eye size={16} />
                    <span className="stat-value">{auction.viewCount || 0}</span>
                    <span className="stat-label">Views</span>
                  </div>
                </div>

                {/* Auction Technical Details */}
                <div className="technical-details">
                  <h4>Auction Information</h4>
                  <div className="tech-grid">
                    <div className="tech-item">
                      <span className="tech-label">Lot Number:</span>
                      <span className="tech-value">#{auction.id}</span>
                    </div>
                    <div className="tech-item">
                      <span className="tech-label">Starting Bid:</span>
                      <span className="tech-value">
                        ${auction.startingBid?.toLocaleString()}
                      </span>
                    </div>
                    <div className="tech-item">
                      <span className="tech-label">Bid Increment:</span>
                      <span className="tech-value">
                        ${auction.bidIncrement?.toLocaleString()}
                      </span>
                    </div>
                    {auction.reservePrice && (
                      <div className="tech-item">
                        <span className="tech-label">Reserve Price:</span>
                        <span className="tech-value">
                          ${auction.reservePrice?.toLocaleString()}
                        </span>
                      </div>
                    )}
                    {auction.buyNowPrice && (
                      <div className="tech-item">
                        <span className="tech-label">Buy Now Price:</span>
                        <span className="tech-value highlight">
                          ${auction.buyNowPrice?.toLocaleString()}
                        </span>
                      </div>
                    )}
                    <div className="tech-item">
                      <span className="tech-label">Status:</span>
                      <span
                        className={`tech-value status-${status.text.toLowerCase()}`}
                      >
                        {status.text}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bidding Form */}
                {isLive && (
                  <div className="bidding-form">
                    <h4>Place Your Bid</h4>
                    <div className="bid-input-container">
                      <span className="currency-symbol">$</span>
                      <input
                        type="number"
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)}
                        placeholder="Enter bid amount"
                        min={auction.currentBid + auction.bidIncrement}
                        step={auction.bidIncrement}
                        className="bid-input"
                      />
                    </div>

                    <div className="bid-info">
                      <span>
                        Minimum bid: $
                        {(
                          (auction.currentBid || auction.startingBid) +
                          auction.bidIncrement
                        ).toLocaleString()}
                      </span>
                    </div>

                    <button
                      onClick={placeBid}
                      disabled={placingBid || !isAuthenticated}
                      className="place-bid-btn"
                    >
                      <Gavel size={20} />
                      {placingBid
                        ? "Placing Bid..."
                        : isAuthenticated
                        ? "Place Bid"
                        : "Sign In to Bid"}
                    </button>

                    {auction.buyNowPrice && (
                      <button className="buy-now-btn">
                        <Zap size={20} />
                        Buy Now - ${auction.buyNowPrice?.toLocaleString()}
                      </button>
                    )}
                  </div>
                )}

                {hasEnded && (
                  <div className="auction-ended">
                    <CheckCircle size={48} color="#10b981" />
                    <h3>Auction Ended</h3>
                    <p>This auction has concluded.</p>
                    {auction.winningBidder && (
                      <div className="final-result">
                        <strong>Winning Bid:</strong> $
                        {auction.currentBid?.toLocaleString()}
                        <br />
                        <strong>Winner:</strong>{" "}
                        {auction.winningBidder.username}
                      </div>
                    )}
                  </div>
                )}

                {/* Bid History */}
                <div className="bid-history">
                  <h4>
                    <Gavel size={18} />
                    Bid History
                  </h4>
                  <div className="bid-list">
                    {bidHistory.length === 0 ? (
                      <div className="no-bids">
                        <p>No bids yet. Be the first to bid!</p>
                      </div>
                    ) : (
                      bidHistory.slice(0, 10).map((bid, index) => (
                        <div
                          key={`${bid.id ?? "x"}-${
                            bid.bidder?.id ?? bid.bidder?.Id ?? index
                          }-${new Date(bid.bidTime).getTime()}`}
                          className="bid-item"
                        >
                          <div className="bid-details">
                            <span className="bid-amount">
                              $
                              {Number.isFinite(Number(bid.amount))
                                ? Number(bid.amount).toLocaleString()
                                : bid.amount}
                            </span>
                            <span className="bidder-name">
                              {" \u2014 "}
                              {bid.bidder?.username || "Anonymous"}
                            </span>
                          </div>
                          <div className="bid-time">
                            {new Date(bid.bidTime).toLocaleTimeString()}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AuctionDetail;
