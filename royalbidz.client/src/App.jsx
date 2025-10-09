import { AuthProvider } from './contexts/AuthContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Carousel from './components/Carousel';
import Collage from './components/Collage';
import Content from './components/Content';
import BgImgContent from './components/BgImgContent';
import Item from './components/Item';
import Footer from './components/Footer';

import './App.css';

function App() {
    // Sample jewelry items data
    const jewelryItems = [
        {
            id: 1,
            name: "Elegant Gold Ring",
            category: "Rings",
            price: 299,
            originalPrice: 399,
            image: "/src/img/i1.png",
            rating: 5,
            reviewCount: 24,
            isSpecial: true
        },
        {
            id: 2,
            name: "Diamond Necklace",
            category: "Necklaces",
            price: 899,
            image: "/src/img/i2.png",
            rating: 4,
            reviewCount: 18,
            isSpecial: false
        },
        {
            id: 3,
            name: "Pearl Earrings",
            category: "Earrings",
            price: 199,
            image: "/src/img/i3.png",
            rating: 5,
            reviewCount: 32,
            isSpecial: true
        },
        {
            id: 4,
            name: "Gold Bracelet",
            category: "Bracelets",
            price: 449,
            image: "/src/img/i4.png",
            rating: 4,
            reviewCount: 15,
            isSpecial: false
        },
        {
            id: 5,
            name: "Sapphire Pendant",
            category: "Pendants",
            price: 599,
            originalPrice: 799,
            image: "/src/img/i5.png",
            rating: 5,
            reviewCount: 28,
            isSpecial: true
        },
        {
            id: 6,
            name: "Emerald Ring",
            category: "Rings",
            price: 349,
            image: "/src/img/ring.png",
            rating: 4,
            reviewCount: 21,
            isSpecial: false
        }
    ];

    return (
        <AuthProvider>
            <Router>
                <div className="app">
                    <Navbar />
                    <Carousel />
                    <Collage />
                    <Content />
                    <BgImgContent />
                    
                    {/* Items Section */}
                    <section className="items-section">
                        <div className="items-container">
                            <h2 className="items-title">Our Best Sellers</h2>
                            <div className="items-grid">
                                {jewelryItems.map((item) => (
                                    <Item key={item.id} item={item} />
                                ))}
                            </div>
                        </div>
                    </section>
                    
                    <Footer />
                    
                    <main className="main-content">
                        
                    </main>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;