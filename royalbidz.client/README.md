# RoyalBidz Frontend Development Guide

## ??? Architecture

The frontend is built with React 18 and Vite, featuring:
- **Component-based architecture** with reusable UI components
- **Context API** for state management (authentication)
- **React Router** for navigation
- **Axios** for API communication
- **Lucide React** for icons

## ?? Getting Started

### Prerequisites
- Node.js 18+ and npm
- Backend API running on port 7006

### Setup
1. Navigate to frontend directory: `cd royalbidz.client`
2. Install dependencies: `npm install`
3. Start development server: `npm run dev`
4. Open browser to: `https://localhost:3117`

## ?? Development Workflow

### Adding a New Page

1. **Create Page Component** (`src/pages/YourPage.jsx`)import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { SomeIcon } from 'lucide-react';

const YourPage = () => {
  const { user, isAuthenticated } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/your-endpoint');
      setData(response.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading">
          <div className="spinner"></div>
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="card">
        <div className="card-header">
          <h1 className="card-title">
            <SomeIcon size={24} /> Your Page Title
          </h1>
        </div>
        {/* Your content */}
      </div>
    </div>
  );
};

export default YourPage;
2. **Add Route** (`src/App.jsx`)import YourPage from './pages/YourPage';

// In Routes component
<Route path="/your-page" element={<YourPage />} />
3. **Add Navigation** (`src/components/Navbar.jsx`)// Add to navItems array
{ path: '/your-page', icon: <SomeIcon size={16} />, label: 'Your Page' }
### Creating Reusable Components

1. **Create Component** (`src/components/YourComponent.jsx`)import React from 'react';

const YourComponent = ({ title, data, onAction }) => {
  return (
    <div className="card">
      <h3>{title}</h3>
      <div className="content">
        {data.map(item => (
          <div key={item.id} onClick={() => onAction(item)}>
            {item.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default YourComponent;
2. **Use Component** in pages:import YourComponent from '../components/YourComponent';

<YourComponent 
  title="Items" 
  data={items} 
  onAction={handleItemClick} 
/>
### Managing Authentication

Access authentication state using the AuthContext:import { useAuth } from '../contexts/AuthContext';

const MyComponent = () => {
  const { user, isAuthenticated, login, logout } = useAuth();
  
  // Check if user is authenticated
  if (!isAuthenticated) {
    return <div>Please login</div>;
  }
  
  // Check user role
  if (user?.role !== 'Admin') {
    return <div>Access denied</div>;
  }
  
  // User is authenticated admin
  return <div>Welcome {user.firstName}</div>;
};
### Making API Calls

Use axios with automatic proxy to backend:// GET request
const fetchData = async () => {
  try {
    const response = await axios.get('/api/auctions');
    setAuctions(response.data);
  } catch (error) {
    console.error('Error:', error);
  }
};

// POST request with authentication
const createAuction = async (auctionData) => {
  try {
    const response = await axios.post('/api/auctions', auctionData);
    return response.data;
  } catch (error) {
    console.error('Error creating auction:', error);
    throw error;
  }
};

// Authenticated requests (JWT token handled automatically by AuthContext)
const fetchProtectedData = async () => {
  const token = localStorage.getItem('token');
  const response = await axios.get('/api/protected-endpoint', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};
### Using Icons

Import and use Lucide React icons:import { User, Settings, LogOut, Plus, Edit, Trash } from 'lucide-react';

// Basic usage
<User size={16} />

// With styling
<Settings size={20} color="#667eea" />

// In buttons
<button className="btn btn-primary">
  <Plus size={16} /> Add New
</button>
### Styling Guidelines

Use the existing CSS classes:// Layout
<div className="page-container">        // Main page wrapper
<div className="card">                  // Card container
<div className="card-header">           // Card header
<div className="grid grid-2">           // 2-column grid
<div className="grid grid-3">           // 3-column grid
<div className="grid grid-4">           // 4-column grid

// Buttons
<button className="btn btn-primary">    // Primary button
<button className="btn btn-secondary">  // Secondary button
<button className="btn btn-outline">    // Outline button
<button className="btn btn-sm">         // Small button

// Status badges
<span className="badge badge-active">   // Green badge
<span className="badge badge-pending">  // Yellow badge
<span className="badge badge-inactive"> // Red badge

// Tables
<div className="table-container">
<table className="table">

// Loading states
<div className="loading">
  <div className="spinner"></div>
  <span>Loading...</span>
</div>

// Alerts
<div className="alert alert-error">     // Error alert
<div className="alert alert-success">   // Success alert
## ?? Design System

### Colors
- Primary: `#667eea`
- Secondary: `#48bb78`
- Warning: `#ed8936`
- Error: `#f56565`
- Text: `#2d3748`
- Muted: `#718096`

### Typography
- Headings: Various sizes with proper hierarchy
- Body: Clean, readable font stack
- Monospace: For code/data display

## ?? Configuration

### Environment Variables
Create `.env.local` for local overrides:VITE_API_BASE_URL=https://localhost:7006
### Proxy Configuration
API calls are automatically proxied to the backend. Configuration in `vite.config.js`:
- `/api/*` ? Backend API
- `/swagger/*` ? Swagger UI
- `/auctionHub` ? SignalR hub

## ?? Testing

### Manual Testing
1. Start both backend and frontend
2. Test all user flows:
   - Registration/Login
   - Browse auctions/jewelry
   - Place bids (if authenticated)
   - Admin functions (if admin user)

### Browser Developer Tools
- Use React Developer Tools extension
- Check Network tab for API calls
- Monitor Console for errors

## ?? Responsive Design

The app uses CSS Grid and Flexbox for responsive layouts:
- Desktop: Full grid layouts
- Tablet: Reduced columns
- Mobile: Single column, stacked layout

## ?? Security Considerations

1. **Never store sensitive data** in local storage (except JWT tokens)
2. **Validate user permissions** before showing UI elements
3. **Handle API errors gracefully** with user feedback
4. **Sanitize user input** before display
5. **Use HTTPS** in production

## ?? Build and Deployment

### Development Buildnpm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
### Production Deployment
1. Build the app: `npm run build`
2. Serve the `dist` folder with a web server
3. Configure reverse proxy for API calls
4. Set up proper HTTPS certificates

## ?? Project Structure
royalbidz.client/
??? src/
?   ??? components/          # Reusable UI components
?   ?   ??? Navbar.jsx      # Navigation bar
?   ??? pages/              # Page components
?   ?   ??? Dashboard.jsx   # Main dashboard
?   ?   ??? Login.jsx       # Login page
?   ?   ??? Register.jsx    # Registration page
?   ?   ??? Auctions.jsx    # Auctions listing
?   ?   ??? Jewelry.jsx     # Jewelry catalog
?   ?   ??? Bids.jsx        # User bids
?   ?   ??? Payments.jsx    # Payment history
?   ?   ??? Users.jsx       # User management (admin)
?   ?   ??? Profile.jsx     # User profile
?   ??? contexts/           # React contexts
?   ?   ??? AuthContext.jsx # Authentication state
?   ??? App.jsx             # Main app component
?   ??? main.jsx            # App entry point
?   ??? App.css             # Global styles
?   ??? index.css           # Base styles
??? index.html              # HTML template
??? package.json            # Dependencies and scripts
??? vite.config.js          # Vite configuration
## ?? Contributing

1. Follow the established code patterns
2. Use meaningful component and variable names
3. Add proper error handling
4. Test your changes manually
5. Keep components focused and reusable
