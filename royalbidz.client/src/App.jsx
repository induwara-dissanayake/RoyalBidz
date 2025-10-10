import { AuthProvider } from './contexts/AuthContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Auctions from './pages/Auctions';
import Bids from './pages/Bids';
import Dashboard from './pages/Dashboard';
import Jewelry from './pages/Jewelry';
import Login from './pages/Login';
import Payments from './pages/Payments';
import Profile from './pages/Profile';
import Register from './pages/Register';
import Users from './pages/Users';
import Navbar from './components/Navbar';
import './App.css';

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="app">
                    <Navbar />
                    <main className="main-content">
                        <Routes>
                            <Route path="/" element={<Dashboard />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/auctions" element={<Auctions />} />
                            <Route path="/jewelry" element={<Jewelry />} />
                            <Route path="/bids" element={<Bids />} />
                            <Route path="/payments" element={<Payments />} />
                            <Route path="/users" element={<Users />} />
                            <Route path="/profile" element={<Profile />} />
                        </Routes>
                    </main>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;
