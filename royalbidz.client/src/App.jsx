import { AuthProvider } from "./contexts/AuthContext";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { useState, useEffect } from "react";
import api from "./utils/api";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Carousel from "./components/Carousel";
import Collage from "./components/Collage";
import Content from "./components/Content";
import BgImgContent from "./components/BgImgContent";
import { Item } from "./components/Item";
import Footer from "./components/Footer";

// Import pages
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Auctions from "./pages/Auctions";
import AuctionDetail from "./pages/AuctionDetail";
import Jewelry from "./pages/Jewelry";
import Bids from "./pages/Bids";
import Payments from "./pages/Payments";
import Users from "./pages/Users";
import Foryou from "./pages/Foryou";
import Wishlist from "./pages/wishlist";
import Notifications from "./pages/Notifications";
import VerifyEmail from "./pages/VerifyEmail";
import PaymentPage from "./pages/PaymentPage";
import PaymentSuccess from "./pages/PaymentSuccess";

import "./App.css";
import ContactUs from "./pages/ContactUs";

function App() {
  // Home page component with real data
  const HomePage = () => {
    const [jewelryItems, setJewelryItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
      loadJewelryItems();
    }, []);

    const loadJewelryItems = async () => {
      try {
        setLoading(true);
        const response = await api.get("/jewelry");

        // Map the database jewelry items to the format expected by the Item component
        const mappedItems = response.data.slice(0, 6).map((item) => ({
          id: item.id,
          name: item.name,
          category: getJewelryTypeName(item.type),
          price: item.estimatedValue,
          originalPrice: item.estimatedValue * 1.2, // Add 20% as original price for display
          image:
            item.images?.[0]?.imageUrl || "/images/placeholder-jewelry.jpg",
          rating: 4 + Math.random(), // Random rating between 4-5
          reviewCount: Math.floor(Math.random() * 50) + 10, // Random review count
          isSpecial: item.estimatedValue > 10000, // Mark expensive items as special
          description: item.description,
          brand: item.brand,
          material: getMaterialName(item.primaryMaterial),
          condition: getConditionName(item.condition),
          yearMade: item.yearMade,
          origin: item.origin,
        }));

        setJewelryItems(mappedItems);
      } catch (error) {
        console.error("Error loading jewelry items:", error);
        setError("Failed to load jewelry items");
        // Fallback to sample data if API fails
        setJewelryItems([
          {
            id: 1,
            name: "Featured Jewelry Collection",
            category: "Premium",
            price: 1299,
            image: "/src/img/i1.png",
            rating: 5,
            reviewCount: 24,
            isSpecial: true,
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    // Helper functions to convert enum values to display names
    const getJewelryTypeName = (type) => {
      const types = {
        0: "Rings",
        1: "Necklaces",
        2: "Earrings",
        3: "Bracelets",
        4: "Watches",
        5: "Brooches",
        6: "Pendants",
        7: "Anklets",
      };
      return types[type] || "Jewelry";
    };

    const getMaterialName = (material) => {
      const materials = {
        0: "Gold",
        1: "Silver",
        2: "Platinum",
        3: "Diamond",
        4: "Pearl",
        5: "Ruby",
        6: "Emerald",
        7: "Sapphire",
      };
      return materials[material] || "Premium";
    };

    const getConditionName = (condition) => {
      const conditions = {
        0: "New",
        1: "Excellent",
        2: "Very Good",
        3: "Good",
        4: "Fair",
      };
      return conditions[condition] || "Good";
    };

    return (
      <div className="app">
        <Carousel />
        <Collage />
        <Content />
        <BgImgContent />

        {/* Items Section */}
        <section className="items-section">
          <div className="items-container">
            <h2 className="items-title">Featured Jewelry Collection</h2>

            {error && (
              <div
                style={{
                  textAlign: "center",
                  color: "#f56565",
                  marginBottom: "20px",
                  padding: "15px",
                  background: "#fff5f5",
                  borderRadius: "8px",
                  border: "1px solid #fed7d7",
                }}
              >
                {error}
              </div>
            )}

            {loading ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  minHeight: "200px",
                  color: "#718096",
                }}
              >
                <div className="spinner" style={{ marginRight: "10px" }}></div>
                Loading jewelry collection...
              </div>
            ) : (
              <div className="items-grid">
                {jewelryItems.map((item, index) => (
                  <Item key={item.id || `item-${index}`} item={item} />
                ))}
              </div>
            )}

            {!loading && jewelryItems.length === 0 && !error && (
              <div
                style={{
                  textAlign: "center",
                  color: "#718096",
                  padding: "40px 20px",
                }}
              >
                <p>No jewelry items available at the moment.</p>
                <p style={{ fontSize: "14px", marginTop: "10px" }}>
                  Please check back later or contact support.
                </p>
              </div>
            )}
          </div>
        </section>

        <Footer />
      </div>
    );
  };

  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Navbar />

          <main className="main-content">
            <Routes>
              <Route path="/contact" element={<ContactUs />} />
              <Route path="/" element={<HomePage />} />
              <Route path="/verify-email" element={<VerifyEmail />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route path="/auctions" element={<Auctions />} />
              <Route path="/auctions/:id" element={<AuctionDetail />} />
              <Route path="/jewelry" element={<Jewelry />} />
              <Route path="/jewelry/:category" element={<Jewelry />} />
              <Route path="/bids" element={<Bids />} />
              <Route path="/payments" element={<Payments />} />
              <Route path="/users" element={<Users />} />
              <Route
                path="/foryou"
                element={
                  <ProtectedRoute>
                    <Foryou />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/wishlist"
                element={
                  <ProtectedRoute>
                    <Wishlist />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/notifications"
                element={
                  <ProtectedRoute>
                    <Notifications />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/payment/:auctionId"
                element={
                  <ProtectedRoute>
                    <PaymentPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/payment-success/:auctionId"
                element={
                  <ProtectedRoute>
                    <PaymentSuccess />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
