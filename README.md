<div align="center">

# RoyalBidz — Modern Jewelry Auction Platform

Real-time, full-stack auction experience built with ASP.NET Core, React, and MySQL.

[![.NET](https://img.shields.io/badge/.NET-8.0-512BD4?logo=dotnet&logoColor=white)](https://dotnet.microsoft.com/)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=061A23)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?logo=mysql&logoColor=white)](https://www.mysql.com/)
[![SignalR](https://img.shields.io/badge/SignalR-Realtime-0FA9E6)](https://learn.microsoft.com/aspnet/core/signalr)
[![License](https://img.shields.io/badge/License-Educational-blue)](#license)

</div>

## ✨ Features

- Live auctions with real-time updates (SignalR)
- Role-based Admin dashboard and analytics
- Rich notifications center with actions (read, bulk read, delete)
- Email workflows: welcome, verification, password reset, payment receipts, inquiries (MailKit/SMTP)
- Profile management: summary, preferences, activity history, wishlist, payment methods, secure avatar upload
- Auction search and detail views with filtering, pagination, and DTO mapping
- Secure JWT authentication with role-based authorization

## 🧱 Tech Stack

- Backend: ASP.NET Core 8 (Web API), Entity Framework Core (MySQL), AutoMapper, SignalR
- Frontend: React 18, Vite, Context API/Fetch, Lucide Icons
- AuthN/Z: JWT tokens, role-based policies
- Email: MailKit/SMTP via configurable EmailSettings

## 🚀 Quick Start

### Prerequisites

- .NET 8 SDK
- Node.js 18+ and npm
- MySQL 8.x (XAMPP or local MySQL server)

### 1) Database

Create a database named `RoyalBidz` (via MySQL or phpMyAdmin). Ensure the MySQL service is running.

### 2) Backend (API)

From the repo root:

1. Open `RoyalBidz.Server/appsettings.Development.json` and configure:
   ```json
   {
     "ConnectionStrings": {
       "DefaultConnection": "Server=localhost;Database=RoyalBidz;User=root;Password=your-password;Port=3306;Convert Zero Datetime=True;"
     },
     "JwtSettings": {
       "SecretKey": "your-32+char-random-secret",
       "Issuer": "RoyalBidz",
       "Audience": "RoyalBidzUsers"
     },
     "EmailSettings": {
       "SmtpHost": "smtp.example.com",
       "SmtpPort": 587,
       "UseSsl": true,
       "Username": "smtp-user",
       "Password": "smtp-pass",
       "FromEmail": "no-reply@royalbidz.com",
       "FromName": "RoyalBidz"
     }
   }
   ```
2. Run the API:
   - Restore: `dotnet restore`
   - Run: `dotnet run` (default dev target in this repo is `http://localhost:5242`)

Swagger is available at `http://localhost:5242/swagger` and the SignalR hub at `/auctionHub`.

### 3) Frontend (React)

From `royalbidz.client/`:

1. Install deps: `npm install`
2. Start dev server: `npm run dev`

The app runs on `http://127.0.0.1:3000` and proxies `/api`, `/swagger`, `/auctionHub`, and `/uploads` to `http://localhost:5242` (see `vite.config.js`).

> Note: If your API runs on a different port, update the `target` in `royalbidz.client/vite.config.js`.

## 🗂️ Project Structure

```
RoyalBidz/
├─ RoyalBidz.Server/           # ASP.NET Core Web API
│  ├─ Controllers/             # API endpoints (Auth, Auctions, Bids, Admin, Profile, Notifications, etc.)
│  ├─ Services/                # Business logic (Interfaces + Implementations)
│  ├─ Repositories/            # Data access layer (Interfaces + Implementations)
│  ├─ DTOs/ Models/ Data/      # Contracts, entities, and DbContext
│  ├─ Hubs/                    # SignalR hubs (AuctionHub)
│  ├─ Mappings/                # AutoMapper profiles
│  └─ wwwroot/                 # Static files (uploads)
└─ royalbidz.client/           # React + Vite frontend
   └─ src/                     # Pages, components, contexts, styles, utils
```

## 🔧 Configuration & Environment

- JWT: set a strong `JwtSettings:SecretKey` (≥ 32 chars) and keep it out of source control.
- Email: configure `EmailSettings` for MailKit (SMTP). Leave as placeholders to disable sending in dev.
- CORS: dev uses Vite proxy, so no CORS changes needed. If calling the API directly from a browser origin, update the `AllowReactApp` policy in `Program.cs`.

## 🧪 API & Realtime

- API docs: `http://localhost:5242/swagger`
- SignalR hub: `http://localhost:5242/auctionHub`

## 📦 Build & Deployment

### Backend

1. Publish: `dotnet publish -c Release`
2. Configure env vars (connection string, JWT, email)
3. Deploy to your host (Azure, AWS, VM, container, etc.)

### Frontend

1. Build: `npm run build`
2. Serve the `dist/` folder (static host or reverse proxy to API)
3. Ensure reverse proxy routes `/api` and `/auctionHub` to the API base URL

## 🛡️ Security Notes

- Never commit secrets (connection strings, JWT secrets, SMTP creds).
- Use HTTPS in production and configure proper certificates.
- Validate/authorize all sensitive endpoints (roles: Admin/Seller/Buyer).

## 🧰 Troubleshooting

- “Cannot connect to MySQL”: verify service is running, DB `RoyalBidz` exists, and connection string is correct.
- Frontend can’t reach API: confirm API at `http://localhost:5242` or update `vite.config.js` target.
- SignalR not connecting: ensure WebSocket proxy is enabled (configured in Vite) and JWT is provided when required.

## 📄 License

This project is for educational purposes.
