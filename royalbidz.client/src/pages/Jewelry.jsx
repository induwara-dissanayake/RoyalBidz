import React from "react";
import { FaSearch, FaFacebookF, FaInstagram, FaYoutube, FaLinkedinIn } from "react-icons/fa";

const JewelleryPage = () => {
  const items = [
    {
      id: 1,
      name: "Gold Plated Kundan Jewellery",
      category: "Necklace",
      image: "https://images.unsplash.com/photo-1600181953299-3a2a3b9b8d1c?w=400",
    },
    {
      id: 2,
      name: "Possibly moissanite or zircon",
      category: "Ring",
      image: "https://images.unsplash.com/photo-1600185365483-26d7a4b2ed2e?w=400",
    },
    {
      id: 3,
      name: "Bengali terminology",
      category: "Bangles",
      image: "https://images.unsplash.com/photo-1600185365237-8d65b8c3c72b?w=400",
    },
    {
      id: 4,
      name: "Gold wedding Jewellery",
      category: "Bangles",
      image: "https://images.unsplash.com/photo-1600181952980-5cfb6d3d7c5b?w=400",
    },
    {
      id: 5,
      name: "Manufacturer of 22ct Gold ring",
      category: "Ring",
      image: "https://images.unsplash.com/photo-1600181953300-392f1a6e6b9b?w=400",
    },
    {
      id: 6,
      name: "Gold wedding Jewellery",
      category: "Pendants",
      image: "https://images.unsplash.com/photo-1600185365142-0e928c9e5ef7?w=400",
    },
    {
      id: 7,
      name: "Gold wedding Jewellery",
      category: "Ring",
      image: "https://images.unsplash.com/photo-1600181953065-7d64f735399e?w=400",
    },
    {
      id: 8,
      name: "Lyra Pendant",
      category: "Pendants",
      image: "https://images.unsplash.com/photo-1600181953228-9a5563b2b776?w=400",
    },
  ];

  return (
    <div className="font-sans bg-white text-gray-900">
      {/* Header */}
      <header className="bg-[#C89B3C] py-4 shadow-md">
        <div className="container mx-auto flex items-center justify-between px-6">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <img
              src="https://i.ibb.co/nL9MtFy/royalbidz-logo.png"
              alt="RoyalBidz Logo"
              className="h-10 w-auto"
            />
            <h1 className="text-2xl font-bold text-white tracking-wide">RoyalBidz</h1>
          </div>

          {/* Search bar */}
          <div className="flex items-center bg-white rounded overflow-hidden w-64">
            <input
              type="text"
              placeholder="Search"
              className="px-3 py-2 w-full text-gray-700 outline-none"
            />
            <button className="bg-[#003366] p-2 text-white">
              <FaSearch />
            </button>
          </div>

          {/* Nav */}
          <nav className="flex items-center space-x-6 text-white text-lg">
            <a href="#" className="hover:text-gray-200">Home</a>
            <a href="#" className="hover:text-gray-200">For You</a>
            <a href="#" className="hover:text-gray-200">Items</a>
            <a href="#" className="hover:text-gray-200">Contact</a>
            <a href="#" className="hover:text-gray-200">Sign in</a>
            <button className="bg-[#0056B3] px-4 py-1.5 rounded hover:bg-[#004080] transition">
              Register
            </button>
          </nav>
        </div>
      </header>

      {/* Banner Section */}
      <section className="text-center py-12 bg-[#fdf5e6]">
        <h2 className="text-3xl font-bold mb-2">Jewellery Items</h2>
        <p className="text-gray-700 mb-8">
          Explore our curated collection of fine jewelry.
        </p>

        <div
          className="max-w-4xl mx-auto rounded-lg overflow-hidden shadow-md"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1600181953315-8b2a6b72b9e2?w=800')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="bg-white bg-opacity-70 py-10 px-8">
            <h3 className="text-3xl font-semibold mb-2">FLASH SALE FRIDAY</h3>
            <p className="text-2xl font-bold text-[#C89B3C] mb-2">
              SAVE 20% ON SELECT ITEMS
            </p>
            <p className="text-gray-800 text-lg">
              PROMO CODE: <b>FRIYAT</b>
            </p>
          </div>
        </div>
      </section>

      {/* Items Grid */}
      <section className="py-12 px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 container mx-auto">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-lg shadow hover:shadow-lg transition p-3 text-center"
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-56 object-cover rounded-md mb-3"
            />
            <h3 className="text-lg font-semibold">{item.name}</h3>
            <p className="text-sm text-red-600">{item.category}</p>
          </div>
        ))}
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-[#D9A441] to-[#C89B3C] text-white py-10">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 px-6">
          {/* Brand */}
          <div>
            <h2 className="text-2xl font-bold mb-2">RoyalBidz</h2>
            <p>Luxury Jewelry</p>
            <div className="flex space-x-4 mt-4 text-xl">
              <FaFacebookF className="hover:text-gray-200 cursor-pointer" />
              <FaInstagram className="hover:text-gray-200 cursor-pointer" />
              <FaYoutube className="hover:text-gray-200 cursor-pointer" />
              <FaLinkedinIn className="hover:text-gray-200 cursor-pointer" />
            </div>
          </div>

          {/* Pages */}
          <div>
            <h3 className="font-semibold mb-3">Our Pages</h3>
            <ul className="space-y-1">
              <li>Home</li>
              <li>For You</li>
              <li>Items</li>
              <li>Register</li>
              <li>Sign In</li>
              <li>Contact Us</li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold mb-3">Categories</h3>
            <ul className="space-y-1">
              <li>Necklaces</li>
              <li>Pendants</li>
              <li>Rings</li>
              <li>Bangles</li>
              <li>Bracelets</li>
              <li>Ear Studs</li>
            </ul>
          </div>

          {/* Address */}
          <div>
            <h3 className="font-semibold mb-3">Address</h3>
            <p>NSBM Green University of Sri Lanka</p>
            <p>Email: <a href="mailto:info@royalbidz.com" className="underline">info@royalbidz.com</a></p>
            <p>Tel: +97 71444444</p>
          </div>
        </div>

        <div className="text-center mt-10 text-sm border-t border-white/40 pt-4">
          © 2025 Vogue Jewellers. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
};

export default JewelleryPage;
