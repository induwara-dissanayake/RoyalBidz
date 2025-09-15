# RoyalBidz - Jewelry Auction Platform

A full-stack web application for online jewelry auctions built with ASP.NET Core 8 and React.

## ??? Architecture Overview

- **Backend**: ASP.NET Core 8 Web API with MySQL database
- **Frontend**: React 18 with Vite
- **Real-time**: SignalR for live bidding
- **Authentication**: JWT tokens with role-based authorization
- **Database**: Entity Framework Core with MySQL

## ?? Quick Start

### Prerequisites

- .NET 8 SDK
- Node.js 18+ and npm
- MySQL Server (XAMPP recommended for development)

### Development Setup

1. **Clone the repository**git clone <repository-url>
cd RoyalBidz
2. **Start MySQL Service**
   - Install and start XAMPP
   - Start MySQL service
   - Create database named `RoyalBidz` in phpMyAdmin

3. **Backend Setup**cd RoyalBidz.Server

# Copy example settings and configure
cp appsettings.Example.json appsettings.Development.json

# Edit appsettings.Development.json:
# - Set your MySQL connection string
# - Set a secure JWT SecretKey (minimum 32 characters)

dotnet restore
dotnet run   Backend will run on: http://localhost:5242

4. **Frontend Setup**cd royalbidz.client
npm install
npm run dev   Frontend will run on: https://localhost:3117

## ?? Configuration

### Development Configuration

Create `RoyalBidz.Server/appsettings.Development.json`:{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=RoyalBidz;User=root;Password=your-password;Port=3306;Convert Zero Datetime=True;"
  },
  "JwtSettings": {
    "SecretKey": "your-super-secure-jwt-secret-key-at-least-32-characters-long",
    "Issuer": "RoyalBidz",
    "Audience": "RoyalBidzUsers"
  }
}
### Production Deployment

For production deployment, set these environment variables:
# Required Environment Variables
export ConnectionStrings__DefaultConnection="your-production-database-connection"
export JwtSettings__SecretKey="your-production-jwt-secret-key"
export ASPNETCORE_ENVIRONMENT="Production"
Or use appsettings.Production.json (ensure it's not in version control):{
  "ConnectionStrings": {
    "DefaultConnection": "your-production-connection-string"
  },
  "JwtSettings": {
    "SecretKey": "your-production-jwt-secret-minimum-32-characters"
  }
}
## ?? Project Structure
RoyalBidz/
??? RoyalBidz.Server/          # Backend API
?   ??? Controllers/           # API controllers
?   ??? Services/             # Business logic
?   ??? Repositories/         # Data access layer
?   ??? Models/               # Entity models
?   ??? DTOs/                 # Data transfer objects
?   ??? Data/                 # Database context
?   ??? Hubs/                 # SignalR hubs
?   ??? Mappings/             # AutoMapper profiles
??? royalbidz.client/         # Frontend React app
    ??? src/
    ?   ??? components/       # Reusable components
    ?   ??? pages/            # Page components
    ?   ??? contexts/         # React contexts
    ?   ??? main.jsx          # App entry point
    ??? package.json
## ?? Test Accounts

The system includes pre-configured test accounts:

- **Admin**: admin@royalbidz.com / Admin123!
- **Seller**: seller@royalbidz.com / Seller123!
- **Buyer**: buyer@royalbidz.com / Buyer123!

## ?? API Documentation

Once the backend is running, visit: http://localhost:5242/swagger

## ?? Useful Links

- **Frontend**: https://localhost:3117
- **Backend API**: http://localhost:5242
- **Swagger UI**: http://localhost:5242/swagger
- **SignalR Hub**: http://localhost:5242/auctionHub

## ??? Development Workflow

See individual README files:
- [Backend Development Guide](RoyalBidz.Server/README.md)
- [Frontend Development Guide](royalbidz.client/README.md)

## ?? Security Notes

### For Development
- Copy `appsettings.Example.json` to `appsettings.Development.json`
- Set your own secure JWT SecretKey (minimum 32 characters)
- Never commit `appsettings.Development.json` to version control

### For Production
- Use environment variables for all sensitive configuration
- Set a strong, randomly generated JWT SecretKey
- Use HTTPS with proper SSL certificates
- Review and configure CORS settings appropriately
- Use a production-ready database with proper security
- Implement proper logging and monitoring

## ?? Deployment

### Backend Deployment
1. Publish the application: `dotnet publish -c Release`
2. Set production environment variables
3. Deploy to your hosting platform (Azure, AWS, etc.)

### Frontend Deployment
1. Build for production: `npm run build`
2. Deploy the `dist` folder to your web server
3. Configure reverse proxy for API calls

## ?? Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Ensure all tests pass
5. Submit a pull request

## ?? License

This project is for educational purposes.