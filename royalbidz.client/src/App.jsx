import { AuthProvider } from "./contexts/AuthContext";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import React, { useState, useEffect } from "react";
import api from "./utils/api";

import Navbar from "./components/Navbar";
import Carousel from "./components/Carousel";
import Collage from "./components/Collage";
import Content from "./components/Content";
import BgImgContent from "./components/BgImgContent";
import Item from "./components/Item";
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

import "./App.css";
import ContactUs from "./pages/ContactUs";

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

// Separate component to use useLocation hook
const AppContent = () => {
  const location = useLocation();
  const isAdminPage = location.pathname === "/admin";

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

        if (response.data && Array.isArray(response.data)) {
          const formattedItems = response.data.map((item) => ({
            id: item.ID || item.id,
            name: item.Name || item.name,
            category: getMaterialName(item.Material || item.material || 0),
            price: item.StartingPrice || item.price || 0,
            image:
              item.Images?.[0]?.ImageUrl || item.image || "/src/img/i1.png",
            rating: item.rating || 4.5,
            reviewCount: item.reviewCount || Math.floor(Math.random() * 50) + 5,
            isSpecial: item.isSpecial || false,
          }));
          setJewelryItems(formattedItems);
        } else {
          throw new Error("Invalid response format");
        }
      } catch (error) {
        console.error("Error loading jewelry items:", error);
        setError("Failed to load jewelry items. Showing sample data.");
        // Fallback to sample data
        setJewelryItems([
          {
            id: 1,
            name: "Royal Sapphire Ring",
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

    if (loading) {
      return (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "50vh",
          }}
        >
          Loading...
        </div>
      );
    }

    return (
      <div>
        {error && (
          <div
            style={{
              padding: "10px",
              backgroundColor: "#f8d7da",
              color: "#721c24",
              marginBottom: "20px",
              borderRadius: "4px",
            }}
          >
            {error}
          </div>
        )}
        <Carousel />
        <Collage />
        <BgImgContent />
        <Content />

        <section id="items">
          <div className="container">
            <h2 style={{ textAlign: "center", marginBottom: "30px" }}>
              Featured Jewelry
            </h2>
            <div className="items-grid">
              {[
                {
                  id: 1,
                  name: "Classic Diamond Ring",
                  price: 1599,
                  imageSrc: "/src/img/itme1.png",
                },
                {
                  id: 2,
                  name: "Heart-Shaped Diamond Ring",
                  price: 2890,
                  imageSrc: "/src/img/itme2.png",
                },
                {
                  id: 3,
                  name: "Rose Gold Teardrop Necklace",
                  price: 1890,
                  imageSrc: "/src/img/itme3.png",
                },
                {
                  id: 4,
                  name: "Gold Starburst Pendant",
                  price: 1450,
                  imageSrc: "/src/img/itme4.png",
                },
                {
                  id: 5,
                  name: "Elegant Pearl Earrings",
                  price: 980,
                  imageSrc: "/src/img/itme5.png",
                },
                {
                  id: 6,
                  name: "Diamond Tennis Bracelet",
                  price: 3200,
                  imageSrc: "/src/img/itme6.png",
                },
                {
                  id: 7,
                  name: "Emerald Drop Earrings",
                  price: 2100,
                  imageSrc: "/src/img/itme7.png",
                },
                {
                  id: 8,
                  name: "Ruby Statement Ring",
                  price: 2750,
                  imageSrc: "/src/img/itme1.png",
                },
              ].map((item) => (
                <Item key={item.id} item={item} />
              ))}
            </div>
          </div>
        </section>
      </div>
    );
  };

  return (
    <div className="app">
      {!isAdminPage && <Navbar />}

          <main className="main-content">
            <Routes>
              <Route path="/contact" element={<ContactUs />} />
              <Route path="/" element={<HomePage />} />
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
              <Route path="/jewelry" element={<Jewelry />} />
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
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
