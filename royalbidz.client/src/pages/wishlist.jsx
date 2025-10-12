import React, { useState } from "react";
const Wishlist = () => {
  const [wishlist, setWishlist] = useState([
    {
      id: 1,
      name: " Rings",
      price: "$200",
      quantity: 1,
      status: "In stock",
      image: "https://via.placeholder.com/80",
    },
    {
      id: 2,
      name: " Necklaces",
      price: "$420",
      quantity: 1,
      status: "In stock",
      image: "https://via.placeholder.com/80",
    },
    {
      id: 3,
      name: "Bangles",
      price: "$520",
      quantity: 1,
      status: "In stock",
      image: "https://via.placeholder.com/80",
    },
    {
      id: 4,
      name: "Pendants",
      price: "$720",
      quantity: 1,
      status: "In stock",
      image: "https://via.placeholder.com/80",
    },
  ]);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-yellow-600 text-white px-6 py-3 flex justify-between items-center">
        <h1 className="text-xl font-semibold">Royal Bidz Jewellery</h1>
        <div className="flex gap-4 items-center">
          <input
            type="text"
            placeholder="Search"
            className="rounded px-2 py-1 text-black"
          />
          <button className="bg-white text-yellow-600 px-3 py-1 rounded">
            Search
          </button>
        </div>
      </header>

      {/* Wishlist Section */}
      <section className="py-10 px-8 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">My Wishlist</h2>

        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 text-center">
            <thead className="bg-yellow-100">
              <tr>
                <th></th>
                <th>Jewellery Name</th>
                <th>Jewellery Price</th>
                <th>Quantity</th>
                <th>Stock Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {wishlist.map((item) => (
                <tr key={item.id} className="border-t hover:bg-gray-50">
                  <td>
                    <input type="checkbox" />
                  </td>
                  <td className="flex items-center gap-3 py-3 justify-center">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-14 h-14 object-cover rounded"
                    />
                    <span>{item.name}</span>
                  </td>
                  <td>{item.price}</td>
                  <td>{item.quantity}</td>
                  <td className="text-green-600">{item.status}</td>
                  <td>
                    <button className="bg-blue-800 text-white px-4 py-1 rounded">
                      Bidding
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center mt-6">
          <div className="flex gap-2 items-center">
            <select className="border px-3 py-2 rounded">
              <option>Add to cart</option>
            </select>
            <button className="bg-yellow-600 text-white px-4 py-2 rounded">
              Apply
            </button>
          </div>
          <button className="bg-blue-800 text-white px-6 py-2 rounded">
            Add All to Bidding
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-yellow-600 text-white py-6 mt-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 px-8">
          <div>
            <h3 className="font-bold mb-2">Our Pages</h3>
            <ul>
              <li>Home</li>
              <li>Items</li>
              <li>Sign in</li>
              <li>Register</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-2">Categories</h3>
            <ul>
              <li>Pendants</li>
              <li>Rings</li>
              <li>Earrings</li>
              <li>Necklaces</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-2">Useful Links</h3>
            <ul>
              <li>Privacy Policy</li>
              <li>Terms & Conditions</li>
              <li>Quality Policy</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-2">Address</h3>
            <p>NSBM Green University of Sri Lanka</p>
            <p>Email: info@royalbidz.com</p>
            <p>Tel: +94 71 444 4441</p>
          </div>
        </div>
        <p className="text-center text-sm mt-6">
          © 2025 Royal Bidz Jewellery. All Rights Reserved.
        </p>
      </footer>
    </div>
  );
};

export default Wishlist;
