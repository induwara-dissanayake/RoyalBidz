import React, { useState } from "react";
import Notification from "../components/Notification";
import "./Foryou.css";

const Foryou = () => {
  const [formData, setFormData] = useState({
    // Jewelry Item Data
    name: "",
    description: "",
    type: "Ring",
    primaryMaterial: "Gold",
    brand: "",
    weight: "",
    dimensions: "",
    condition: "Excellent",
    yearMade: "",
    origin: "",
    certificationDetails: "",
    estimatedValue: "",
    images: [],

    // Auction Data
    title: "",
    auctionDescription: "",
    startingBid: "",
    reservePrice: "",
    bidIncrement: "1.00",
    buyNowPrice: "",
    startTime: "",
    endTime: "",
    restrictions: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [notification, setNotification] = useState({
    isVisible: false,
    message: "",
    type: "success",
  });

  const showNotification = (message, type = "success") => {
    setNotification({
      isVisible: true,
      message,
      type,
    });
  };

  const hideNotification = () => {
    setNotification((prev) => ({
      ...prev,
      isVisible: false,
    }));
  };

  const jewelryTypes = [
    "Ring",
    "Necklace",
    "Earrings",
    "Bracelet",
    "Watch",
    "Brooch",
    "Pendant",
    "Anklet",
    "Other",
  ];

  const jewelryMaterials = [
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

  const itemConditions = [
    "New",
    "Excellent",
    "VeryGood",
    "Good",
    "Fair",
    "Poor",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Clear specific field error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (formData.images.length + files.length > 5) {
      alert("Maximum 5 images allowed");
      return;
    }

    setFormData((prevData) => ({
      ...prevData,
      images: [...prevData.images, ...files],
    }));
  };

  const removeImage = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      images: prevData.images.filter((_, i) => i !== index),
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    // Jewelry Item Validation
    if (!formData.name.trim()) newErrors.name = "Jewelry name is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.estimatedValue || parseFloat(formData.estimatedValue) <= 0) {
      newErrors.estimatedValue = "Valid estimated value is required";
    }
    if (formData.images.length === 0) {
      newErrors.images = "At least one image is required";
    }

    // Auction Validation
    if (!formData.title.trim()) newErrors.title = "Auction title is required";
    if (!formData.auctionDescription.trim())
      newErrors.auctionDescription = "Auction description is required";
    if (!formData.startingBid || parseFloat(formData.startingBid) <= 0) {
      newErrors.startingBid = "Valid starting bid is required";
    }
    if (!formData.startTime) newErrors.startTime = "Start time is required";
    if (!formData.endTime) newErrors.endTime = "End time is required";

    // Date validation
    const startDate = new Date(formData.startTime);
    const endDate = new Date(formData.endTime);
    const now = new Date();

    if (startDate <= now) {
      newErrors.startTime = "Start time must be in the future";
    }
    if (endDate <= startDate) {
      newErrors.endTime = "End time must be after start time";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const uploadImages = async (jewelryItemId) => {
    const uploadPromises = formData.images.map(async (file, index) => {
      const uploadFormData = new FormData();
      uploadFormData.append("file", file);
      uploadFormData.append("jewelryItemId", jewelryItemId.toString());
      uploadFormData.append("altText", `${formData.name} - Image ${index + 1}`);
      uploadFormData.append("isPrimary", index === 0 ? "true" : "false");
      uploadFormData.append("displayOrder", index.toString());

      const response = await fetch("/api/jewelry/upload-image", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: uploadFormData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to upload image ${index + 1}: ${errorText}`);
      }

      return response.json();
    });

    return Promise.all(uploadPromises);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login to create an auction");
        return;
      }

      // Step 1: Create Jewelry Item
      const jewelryItemData = {
        name: formData.name,
        description: formData.description,
        type: formData.type,
        primaryMaterial: formData.primaryMaterial,
        brand: formData.brand || null,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        dimensions: formData.dimensions || null,
        condition: formData.condition,
        yearMade: formData.yearMade ? parseInt(formData.yearMade) : null,
        origin: formData.origin || null,
        certificationDetails: formData.certificationDetails || null,
        estimatedValue: parseFloat(formData.estimatedValue),
        images: [], // Will be added after upload
      };

      const jewelryResponse = await fetch("/api/jewelry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(jewelryItemData),
      });

      if (!jewelryResponse.ok) {
        const errorData = await jewelryResponse.json();
        throw new Error(errorData.message || "Failed to create jewelry item");
      }

      const jewelryItem = await jewelryResponse.json();

      const jewelryItemId = jewelryItem.Id || jewelryItem.id; // Handle both cases
      if (!jewelryItemId) {
        throw new Error("Jewelry item was created but no ID was returned");
      }

      // Step 2: Upload Images
      if (formData.images.length > 0) {
        await uploadImages(jewelryItemId);
      }

      // Step 3: Create Auction
      const auctionData = {
        title: formData.title,
        description: `${formData.auctionDescription}\n\nRestrictions: ${formData.restrictions}`,
        jewelryItemId: jewelryItemId,
        startingBid: parseFloat(formData.startingBid),
        reservePrice: formData.reservePrice
          ? parseFloat(formData.reservePrice)
          : null,
        bidIncrement: parseFloat(formData.bidIncrement),
        buyNowPrice: formData.buyNowPrice
          ? parseFloat(formData.buyNowPrice)
          : null,
        startTime: new Date(formData.startTime).toISOString(),
        endTime: new Date(formData.endTime).toISOString(),
      };

      const auctionResponse = await fetch("/api/auctions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(auctionData),
      });

      if (!auctionResponse.ok) {
        const errorData = await auctionResponse.json();
        throw new Error(errorData.message || "Failed to create auction");
      }

      const auction = await auctionResponse.json();

      showNotification(
        `Auction "${auction.Title || auction.title}" created successfully! 🎉`,
        "success"
      );

      // Reset form
      setFormData({
        name: "",
        description: "",
        type: "Ring",
        primaryMaterial: "Gold",
        brand: "",
        weight: "",
        dimensions: "",
        condition: "Excellent",
        yearMade: "",
        origin: "",
        certificationDetails: "",
        estimatedValue: "",
        images: [],
        title: "",
        auctionDescription: "",
        startingBid: "",
        reservePrice: "",
        bidIncrement: "1.00",
        buyNowPrice: "",
        startTime: "",
        endTime: "",
        restrictions: "",
      });
    } catch (error) {
      console.error("Error creating auction:", error);
      showNotification(`Error: ${error.message}`, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="foryou-container">
      <h1 className="foryou-title">
        Create Your Auction - Tell them of all that's precious to your precious
        'bidz!
      </h1>
      <p className="foryou-description">
        This platform allows you to create exclusive jewelry auctions. Submit
        your precious items and let bidders discover unique treasures. Complete
        all sections below to create a professional auction listing.
      </p>

      <form className="foryou-form" onSubmit={handleSubmit}>
        {/* Jewelry Item Section */}
        <div className="form-section">
          <h2>Jewelry Item Details</h2>

          <div className="form-group">
            <label htmlFor="name">Jewelry Item Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Vintage Diamond Ring"
              required
            />
            {errors.name && <span className="error">{errors.name}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="type">Jewelry Type *</label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
              >
                {jewelryTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="primaryMaterial">Primary Material *</label>
              <select
                id="primaryMaterial"
                name="primaryMaterial"
                value={formData.primaryMaterial}
                onChange={handleChange}
                required
              >
                {jewelryMaterials.map((material) => (
                  <option key={material} value={material}>
                    {material}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="condition">Condition *</label>
              <select
                id="condition"
                name="condition"
                value={formData.condition}
                onChange={handleChange}
                required
              >
                {itemConditions.map((condition) => (
                  <option key={condition} value={condition}>
                    {condition.replace(/([A-Z])/g, " $1").trim()}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="brand">Brand</label>
              <input
                type="text"
                id="brand"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                placeholder="e.g., Tiffany & Co."
              />
            </div>

            <div className="form-group">
              <label htmlFor="weight">Weight (grams)</label>
              <input
                type="number"
                id="weight"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                placeholder="e.g., 5.2"
                step="0.1"
                min="0"
              />
            </div>

            <div className="form-group">
              <label htmlFor="estimatedValue">Estimated Value ($) *</label>
              <input
                type="number"
                id="estimatedValue"
                name="estimatedValue"
                value={formData.estimatedValue}
                onChange={handleChange}
                placeholder="e.g., 1500"
                step="0.01"
                min="0"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="dimensions">Dimensions</label>
              <input
                type="text"
                id="dimensions"
                name="dimensions"
                value={formData.dimensions}
                onChange={handleChange}
                placeholder="e.g., 20mm x 15mm"
              />
            </div>

            <div className="form-group">
              <label htmlFor="yearMade">Year Made</label>
              <input
                type="number"
                id="yearMade"
                name="yearMade"
                value={formData.yearMade}
                onChange={handleChange}
                placeholder="e.g., 1950"
                min="1800"
                max="2030"
              />
            </div>

            <div className="form-group">
              <label htmlFor="origin">Origin</label>
              <input
                type="text"
                id="origin"
                name="origin"
                value={formData.origin}
                onChange={handleChange}
                placeholder="e.g., Italy, France"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Item Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Detailed description of the jewelry item..."
              rows="4"
              required
            ></textarea>
            {errors.description && (
              <span className="error">{errors.description}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="certificationDetails">Certification Details</label>
            <textarea
              id="certificationDetails"
              name="certificationDetails"
              value={formData.certificationDetails}
              onChange={handleChange}
              placeholder="Certificate numbers, appraisal details, etc."
              rows="3"
            ></textarea>
          </div>
        </div>

        {/* Image Upload Section */}
        <div className="form-section">
          <h2>Upload Item Images *</h2>
          <p>Upload up to 5 high-quality images of your jewelry item</p>

          <div className="image-upload-area">
            {formData.images.map((image, index) => (
              <div key={index} className="image-preview">
                <img
                  src={URL.createObjectURL(image)}
                  alt={`Preview ${index + 1}`}
                />
                <button
                  type="button"
                  className="remove-image"
                  onClick={() => removeImage(index)}
                >
                  ×
                </button>
                {index === 0 && <span className="primary-badge">Primary</span>}
              </div>
            ))}

            {formData.images.length < 5 && (
              <div className="image-placeholder">
                <span className="upload-icon">+</span>
                <p>Add Image</p>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="hidden-file-input"
                />
              </div>
            )}
          </div>
          {errors.images && <span className="error">{errors.images}</span>}
        </div>

        {/* Auction Details Section */}
        <div className="form-section">
          <h2>Auction Details</h2>

          <div className="form-group">
            <label htmlFor="title">Auction Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Vintage 1950s Diamond Ring - Rare Estate Piece"
              required
            />
            {errors.title && <span className="error">{errors.title}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="auctionDescription">Auction Description *</label>
            <textarea
              id="auctionDescription"
              name="auctionDescription"
              value={formData.auctionDescription}
              onChange={handleChange}
              placeholder="Compelling description for bidders..."
              rows="4"
              required
            ></textarea>
            {errors.auctionDescription && (
              <span className="error">{errors.auctionDescription}</span>
            )}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="startingBid">Starting Bid ($) *</label>
              <input
                type="number"
                id="startingBid"
                name="startingBid"
                value={formData.startingBid}
                onChange={handleChange}
                placeholder="e.g., 100"
                step="0.01"
                min="0"
                required
              />
              {errors.startingBid && (
                <span className="error">{errors.startingBid}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="reservePrice">Reserve Price ($)</label>
              <input
                type="number"
                id="reservePrice"
                name="reservePrice"
                value={formData.reservePrice}
                onChange={handleChange}
                placeholder="e.g., 500"
                step="0.01"
                min="0"
              />
            </div>

            <div className="form-group">
              <label htmlFor="bidIncrement">Bid Increment ($) *</label>
              <input
                type="number"
                id="bidIncrement"
                name="bidIncrement"
                value={formData.bidIncrement}
                onChange={handleChange}
                step="0.01"
                min="0.01"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="buyNowPrice">Buy Now Price ($)</label>
              <input
                type="number"
                id="buyNowPrice"
                name="buyNowPrice"
                value={formData.buyNowPrice}
                onChange={handleChange}
                placeholder="e.g., 2000"
                step="0.01"
                min="0"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="startTime">Auction Start Time *</label>
              <input
                type="datetime-local"
                id="startTime"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                required
              />
              {errors.startTime && (
                <span className="error">{errors.startTime}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="endTime">Auction End Time *</label>
              <input
                type="datetime-local"
                id="endTime"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                required
              />
              {errors.endTime && (
                <span className="error">{errors.endTime}</span>
              )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="restrictions">Terms & Restrictions</label>
            <textarea
              id="restrictions"
              name="restrictions"
              value={formData.restrictions}
              onChange={handleChange}
              placeholder="Shipping terms, return policy, payment methods accepted, etc."
              rows="4"
            ></textarea>
          </div>
        </div>

        <button
          type="submit"
          className={`submit-button ${loading ? "loading" : ""}`}
          disabled={loading}
        >
          {loading ? "Creating Auction..." : "Create Auction"}
        </button>
      </form>

      <Notification
        message={notification.message}
        type={notification.type}
        isVisible={notification.isVisible}
        onClose={hideNotification}
        duration={3000}
      />
    </div>
  );
};

export default Foryou;
