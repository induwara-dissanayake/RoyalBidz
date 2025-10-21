import React, { useState } from "react";
import {
  X,
  Copy,
  Check,
  MessageCircle,
  Facebook,
  Twitter,
  Instagram,
} from "lucide-react";
import "./ShareModal.css";

const ShareModal = ({ isOpen, onClose, shareData, type = "auction" }) => {
  const [copied, setCopied] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(null);

  if (!isOpen) return null;

  const { title, url, description, imageUrl } = shareData;

  // Generate share URLs for different platforms
  const generateShareUrls = () => {
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);
    const encodedDescription = encodeURIComponent(description);

    return {
      whatsapp: `https://api.whatsapp.com/send?text=${encodedTitle}%0A${encodedDescription}%0A${encodedUrl}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      instagram: `https://www.instagram.com/`, // Instagram doesn't support direct URL sharing
    };
  };

  const shareUrls = generateShareUrls();

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy link:", error);
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShare = async (platform) => {
    // Record the share in backend
    try {
      await fetch("/api/socialshare", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(localStorage.getItem("token") && {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          }),
        },
        body: JSON.stringify({
          platform: platform,
          shareType: type,
          sharedUrl: url,
          auctionId: shareData.auctionId || null,
        }),
      });
    } catch (error) {
      console.error("Failed to record share:", error);
      // Continue with sharing even if recording fails
    }

    if (platform === "instagram") {
      // Instagram doesn't support direct URL sharing, so we'll copy the link and show a message
      handleCopyLink();
      setShareSuccess(
        "Link copied for Instagram! You can now paste it in your story or post."
      );
      setTimeout(() => setShareSuccess(null), 3000);
      return;
    }

    // Show success message and open share window
    setShareSuccess(`Opening ${platform} to share...`);
    setTimeout(() => setShareSuccess(null), 2000);
    window.open(shareUrls[platform], "_blank", "width=600,height=400");
  };

  return (
    <div className="share-modal-overlay" onClick={onClose}>
      <div className="share-modal" onClick={(e) => e.stopPropagation()}>
        <div className="share-modal-header">
          <h3>{type === "auction" ? "Share Auction" : "Share Your Win!"}</h3>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="share-modal-content">
          {/* Success Message */}
          {shareSuccess && (
            <div className="share-success-message">
              <Check size={16} />
              {shareSuccess}
            </div>
          )}

          {/* Preview */}
          <div className="share-preview">
            <div className="preview-content">
              {imageUrl && (
                <img
                  src={imageUrl}
                  alt={title}
                  className="preview-image"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              )}
              <div className="preview-text">
                <h4>{title}</h4>
                <p>{description}</p>
              </div>
            </div>
          </div>

          {/* Social Media Buttons */}
          <div className="social-share-buttons">
            <button
              className="share-btn whatsapp"
              onClick={() => handleShare("whatsapp")}
              title="Share on WhatsApp"
            >
              <MessageCircle size={24} />
              <span>WhatsApp</span>
            </button>

            <button
              className="share-btn facebook"
              onClick={() => handleShare("facebook")}
              title="Share on Facebook"
            >
              <Facebook size={24} />
              <span>Facebook</span>
            </button>

            <button
              className="share-btn twitter"
              onClick={() => handleShare("twitter")}
              title="Share on Twitter"
            >
              <Twitter size={24} />
              <span>Twitter</span>
            </button>

            <button
              className="share-btn instagram"
              onClick={() => handleShare("instagram")}
              title="Share on Instagram"
            >
              <Instagram size={24} />
              <span>Instagram</span>
            </button>
          </div>

          {/* Copy Link */}
          <div className="copy-link-section">
            <div className="copy-link-input">
              <input type="text" value={url} readOnly className="link-input" />
              <button
                className={`copy-btn ${copied ? "copied" : ""}`}
                onClick={handleCopyLink}
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
