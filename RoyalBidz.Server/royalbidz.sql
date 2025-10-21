-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 21, 2025 at 11:35 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `royalbidz`
--

-- --------------------------------------------------------

--
-- Table structure for table `auctions`
--

CREATE TABLE `auctions` (
  `Id` int(11) NOT NULL,
  `Title` varchar(200) NOT NULL,
  `Description` varchar(1000) DEFAULT NULL,
  `JewelryItemId` int(11) NOT NULL,
  `SellerId` int(11) NOT NULL,
  `StartingBid` decimal(18,2) NOT NULL,
  `ReservePrice` decimal(18,2) DEFAULT NULL,
  `BidIncrement` decimal(18,2) NOT NULL,
  `BuyNowPrice` decimal(18,2) DEFAULT NULL,
  `StartTime` datetime(6) NOT NULL,
  `EndTime` datetime(6) NOT NULL,
  `Status` int(11) NOT NULL,
  `CurrentBid` decimal(18,2) NOT NULL,
  `LeadingBidderId` int(11) DEFAULT NULL,
  `WinningBidderId` int(11) DEFAULT NULL,
  `CreatedAt` datetime(6) NOT NULL,
  `UpdatedAt` datetime(6) DEFAULT NULL,
  `ViewCount` int(11) DEFAULT 0 COMMENT 'Number of views',
  `TotalBids` int(11) DEFAULT 0 COMMENT 'Total bids placed',
  `IsPublished` tinyint(1) DEFAULT 0 COMMENT 'Is auction live and visible',
  `IsFeatured` tinyint(1) DEFAULT 0 COMMENT 'Featured on homepage'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `bids`
--

CREATE TABLE `bids` (
  `Id` int(11) NOT NULL,
  `AuctionId` int(11) NOT NULL,
  `BidderId` int(11) NOT NULL,
  `Amount` decimal(18,2) NOT NULL,
  `Status` int(11) NOT NULL,
  `BidTime` datetime(6) NOT NULL,
  `IsAutomaticBid` tinyint(1) NOT NULL,
  `MaxAutoBidAmount` decimal(18,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `contact_inquiries`
--

CREATE TABLE `contact_inquiries` (
  `Id` int(11) NOT NULL,
  `Name` varchar(100) NOT NULL,
  `Email` varchar(255) NOT NULL,
  `MobileNumber` varchar(20) DEFAULT NULL,
  `Enquiry` text NOT NULL,
  `Status` enum('Pending','InProgress','Resolved','Closed') DEFAULT 'Pending',
  `Priority` enum('Low','Medium','High','Urgent') DEFAULT 'Medium',
  `AssignedToUserId` int(11) DEFAULT NULL,
  `CreatedAt` datetime NOT NULL DEFAULT current_timestamp(),
  `UpdatedAt` datetime DEFAULT NULL,
  `RespondedAt` datetime DEFAULT NULL,
  `Notes` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `jewelryimages`
--

CREATE TABLE `jewelryimages` (
  `Id` int(11) NOT NULL,
  `JewelryItemId` int(11) NOT NULL,
  `ImageUrl` varchar(500) NOT NULL,
  `AltText` varchar(200) DEFAULT NULL,
  `IsPrimary` tinyint(1) NOT NULL,
  `DisplayOrder` int(11) NOT NULL,
  `CreatedAt` datetime(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `jewelryitems`
--

CREATE TABLE `jewelryitems` (
  `Id` int(11) NOT NULL,
  `Name` varchar(200) NOT NULL,
  `Description` varchar(2000) DEFAULT NULL,
  `Type` int(11) NOT NULL,
  `PrimaryMaterial` int(11) NOT NULL,
  `Brand` varchar(100) DEFAULT NULL,
  `Weight` decimal(8,3) DEFAULT NULL,
  `Dimensions` varchar(50) DEFAULT NULL,
  `Condition` int(11) NOT NULL,
  `YearMade` int(11) DEFAULT NULL,
  `Origin` varchar(100) DEFAULT NULL,
  `CertificationDetails` varchar(500) DEFAULT NULL,
  `EstimatedValue` decimal(18,2) NOT NULL,
  `CreatedAt` datetime(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `Id` int(11) NOT NULL,
  `UserId` int(11) NOT NULL,
  `Type` varchar(100) NOT NULL,
  `Title` varchar(200) NOT NULL,
  `Message` varchar(1000) NOT NULL,
  `IsRead` tinyint(1) NOT NULL DEFAULT 0,
  `EntityType` varchar(50) DEFAULT NULL,
  `EntityId` int(11) DEFAULT NULL,
  `Amount` decimal(18,2) DEFAULT NULL,
  `CreatedAt` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `ReadAt` datetime(6) DEFAULT NULL,
  `ActionUrl` varchar(500) DEFAULT NULL COMMENT 'URL for notification action',
  `ActionLabel` varchar(100) DEFAULT NULL COMMENT 'Label for action button',
  `ActionCancelUrl` varchar(500) DEFAULT NULL,
  `ActionCancelLabel` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `Id` int(11) NOT NULL,
  `AuctionId` int(11) NOT NULL,
  `PayerId` int(11) NOT NULL,
  `Amount` decimal(18,2) NOT NULL,
  `AuctioneerFee` decimal(18,2) DEFAULT NULL,
  `ProcessingFee` decimal(18,2) DEFAULT NULL,
  `TotalAmount` decimal(18,2) NOT NULL,
  `Method` int(11) NOT NULL,
  `Status` int(11) NOT NULL,
  `TransactionId` varchar(100) DEFAULT NULL,
  `PaymentGatewayResponse` varchar(100) DEFAULT NULL,
  `CreatedAt` datetime(6) NOT NULL,
  `ProcessedAt` datetime(6) DEFAULT NULL,
  `PaymentDeadline` datetime(6) DEFAULT NULL COMMENT 'Deadline for payment completion',
  `BidId` int(11) DEFAULT NULL COMMENT 'Associated bid that won the auction'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `payment_methods`
--

CREATE TABLE `payment_methods` (
  `Id` int(11) NOT NULL,
  `UserId` int(11) NOT NULL,
  `Type` varchar(50) NOT NULL,
  `Brand` varchar(100) DEFAULT NULL,
  `Last4` varchar(4) DEFAULT NULL,
  `ExpiryDate` varchar(7) DEFAULT NULL,
  `Email` varchar(255) DEFAULT NULL,
  `BankName` varchar(255) DEFAULT NULL,
  `AccountNumber` varchar(100) DEFAULT NULL,
  `IsDefault` tinyint(1) NOT NULL DEFAULT 0,
  `IsActive` tinyint(1) NOT NULL DEFAULT 1,
  `CreatedAt` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `UpdatedAt` datetime(6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `social_shares`
--

CREATE TABLE `social_shares` (
  `Id` int(11) NOT NULL,
  `UserId` int(11) DEFAULT NULL,
  `AuctionId` int(11) DEFAULT NULL,
  `Platform` varchar(50) NOT NULL,
  `ShareType` varchar(20) NOT NULL,
  `SharedUrl` varchar(500) NOT NULL,
  `UserAgent` varchar(500) DEFAULT NULL,
  `IpAddress` varchar(50) DEFAULT NULL,
  `CreatedAt` datetime(6) NOT NULL DEFAULT current_timestamp(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `Id` int(11) NOT NULL,
  `Username` varchar(50) NOT NULL,
  `Email` varchar(255) NOT NULL,
  `PasswordHash` longtext NOT NULL,
  `PhoneNumber` varchar(20) DEFAULT NULL,
  `Role` int(11) NOT NULL DEFAULT 0,
  `Status` int(11) NOT NULL DEFAULT 0,
  `CreatedAt` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `LastLogin` datetime(6) DEFAULT NULL,
  `UpdatedAt` datetime(6) DEFAULT NULL,
  `EmailVerified` tinyint(1) NOT NULL DEFAULT 0,
  `EmailVerificationCode` varchar(6) DEFAULT NULL,
  `EmailVerificationCodeExpiry` datetime(6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`Id`, `Username`, `Email`, `PasswordHash`, `PhoneNumber`, `Role`, `Status`, `CreatedAt`, `LastLogin`, `UpdatedAt`, `EmailVerified`, `EmailVerificationCode`, `EmailVerificationCodeExpiry`) VALUES
(1, 'admin', 'admin@royalbidz.com', '$2a$11$z74G0vlVhZHSL9lJncHtd.6.EN1q./.4rESGjM8yC6f9PvqczAeTS', '+1234567890', 2, 0, '2024-01-01 00:00:00.000000', '2025-10-20 20:01:18.404911', '2025-10-18 08:01:38.589228', 0, NULL, NULL),
(2, 'seller1', 'seller@royalbidz.com', '$2a$11$9yE3NmzviiJAITHM6XdsCuTYKflVwbmUveTDvqEd7Pt1MEfptMXcS', '+1234567891', 1, 0, '2024-01-01 00:00:00.000000', '2025-10-20 19:00:20.635190', '2025-10-20 19:50:54.219153', 0, NULL, NULL),
(3, 'buyer1', 'buyer@royalbidz.com', '$2a$11$y9pqcETt2c0NcIfYyAJcweER7tWnJpGUIGNm9dO.zr2DZDyHkkNpi', '+1234567892', 0, 0, '2024-01-01 00:00:00.000000', '2025-10-20 10:55:13.887610', '2025-10-18 09:48:07.747318', 0, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `user_activities`
--

CREATE TABLE `user_activities` (
  `Id` int(11) NOT NULL,
  `UserId` int(11) NOT NULL,
  `ActivityType` varchar(50) NOT NULL,
  `Description` varchar(500) NOT NULL,
  `EntityType` varchar(50) DEFAULT NULL,
  `EntityId` int(11) DEFAULT NULL,
  `Amount` decimal(18,2) DEFAULT NULL,
  `CreatedAt` datetime(6) NOT NULL DEFAULT current_timestamp(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_preferences`
--

CREATE TABLE `user_preferences` (
  `Id` int(11) NOT NULL,
  `UserId` int(11) NOT NULL,
  `EmailNotifications` tinyint(1) NOT NULL DEFAULT 1,
  `SmsNotifications` tinyint(1) NOT NULL DEFAULT 0,
  `PushNotifications` tinyint(1) NOT NULL DEFAULT 1,
  `BidNotifications` tinyint(1) NOT NULL DEFAULT 1,
  `AuctionEndNotifications` tinyint(1) NOT NULL DEFAULT 1,
  `NewsletterSubscription` tinyint(1) NOT NULL DEFAULT 1,
  `TwoFactorEnabled` tinyint(1) NOT NULL DEFAULT 0,
  `Currency` varchar(10) NOT NULL DEFAULT 'USD',
  `Language` varchar(10) NOT NULL DEFAULT 'en',
  `Timezone` varchar(50) NOT NULL DEFAULT 'UTC',
  `PrivacyLevel` int(11) NOT NULL DEFAULT 0,
  `CreatedAt` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `UpdatedAt` datetime(6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_profiles`
--

CREATE TABLE `user_profiles` (
  `Id` int(11) NOT NULL,
  `UserId` int(11) NOT NULL,
  `FirstName` varchar(50) DEFAULT NULL,
  `LastName` varchar(50) DEFAULT NULL,
  `Address` varchar(500) DEFAULT NULL,
  `City` varchar(100) DEFAULT NULL,
  `State` varchar(100) DEFAULT NULL,
  `ZipCode` varchar(20) DEFAULT NULL,
  `Country` varchar(100) DEFAULT NULL,
  `ProfileImageUrl` varchar(500) DEFAULT NULL,
  `DateOfBirth` date DEFAULT NULL,
  `Bio` varchar(1000) DEFAULT NULL,
  `CreatedAt` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `UpdatedAt` datetime(6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `wishlists`
--

CREATE TABLE `wishlists` (
  `Id` int(11) NOT NULL,
  `UserId` int(11) NOT NULL,
  `JewelryItemId` int(11) NOT NULL,
  `CreatedAt` datetime(6) NOT NULL DEFAULT current_timestamp(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `auctions`
--
ALTER TABLE `auctions`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `IX_Auctions_JewelryItemId` (`JewelryItemId`),
  ADD KEY `IX_Auctions_SellerId` (`SellerId`),
  ADD KEY `IX_Auctions_WinningBidderId` (`WinningBidderId`),
  ADD KEY `idx_status_endtime` (`Status`,`EndTime`),
  ADD KEY `idx_featured_published` (`IsFeatured`,`IsPublished`),
  ADD KEY `IX_Auctions_LeadingBidderId` (`LeadingBidderId`);

--
-- Indexes for table `bids`
--
ALTER TABLE `bids`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `IX_Bids_AuctionId_BidTime` (`AuctionId`,`BidTime`),
  ADD KEY `IX_Bids_BidderId` (`BidderId`);

--
-- Indexes for table `contact_inquiries`
--
ALTER TABLE `contact_inquiries`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `idx_status` (`Status`),
  ADD KEY `idx_created_at` (`CreatedAt`),
  ADD KEY `idx_email` (`Email`),
  ADD KEY `AssignedToUserId` (`AssignedToUserId`);

--
-- Indexes for table `jewelryimages`
--
ALTER TABLE `jewelryimages`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `IX_JewelryImages_JewelryItemId` (`JewelryItemId`);

--
-- Indexes for table `jewelryitems`
--
ALTER TABLE `jewelryitems`
  ADD PRIMARY KEY (`Id`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `IX_notifications_UserId_CreatedAt` (`UserId`,`CreatedAt`),
  ADD KEY `IX_notifications_UserId_IsRead` (`UserId`,`IsRead`),
  ADD KEY `IX_notifications_Type` (`Type`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `IX_Payments_AuctionId` (`AuctionId`),
  ADD KEY `IX_Payments_PayerId` (`PayerId`),
  ADD KEY `IX_Payments_BidId` (`BidId`);

--
-- Indexes for table `payment_methods`
--
ALTER TABLE `payment_methods`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `IX_PaymentMethods_UserId` (`UserId`);

--
-- Indexes for table `social_shares`
--
ALTER TABLE `social_shares`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `IX_SocialShares_Platform` (`Platform`),
  ADD KEY `IX_SocialShares_ShareType` (`ShareType`),
  ADD KEY `IX_SocialShares_CreatedAt` (`CreatedAt`),
  ADD KEY `IX_SocialShares_UserId_CreatedAt` (`UserId`,`CreatedAt`),
  ADD KEY `IX_SocialShares_AuctionId_CreatedAt` (`AuctionId`,`CreatedAt`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`Id`),
  ADD UNIQUE KEY `IX_Users_Email` (`Email`),
  ADD UNIQUE KEY `IX_Users_Username` (`Username`);

--
-- Indexes for table `user_activities`
--
ALTER TABLE `user_activities`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `IX_UserActivities_UserId_CreatedAt` (`UserId`,`CreatedAt`),
  ADD KEY `IX_UserActivities_ActivityType` (`ActivityType`);

--
-- Indexes for table `user_preferences`
--
ALTER TABLE `user_preferences`
  ADD PRIMARY KEY (`Id`),
  ADD UNIQUE KEY `IX_UserPreferences_UserId` (`UserId`);

--
-- Indexes for table `user_profiles`
--
ALTER TABLE `user_profiles`
  ADD PRIMARY KEY (`Id`),
  ADD UNIQUE KEY `IX_UserProfiles_UserId` (`UserId`);

--
-- Indexes for table `wishlists`
--
ALTER TABLE `wishlists`
  ADD PRIMARY KEY (`Id`),
  ADD UNIQUE KEY `IX_Wishlists_UserId_JewelryItemId` (`UserId`,`JewelryItemId`),
  ADD KEY `IX_Wishlists_UserId` (`UserId`),
  ADD KEY `IX_Wishlists_JewelryItemId` (`JewelryItemId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `auctions`
--
ALTER TABLE `auctions`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `bids`
--
ALTER TABLE `bids`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `contact_inquiries`
--
ALTER TABLE `contact_inquiries`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `jewelryimages`
--
ALTER TABLE `jewelryimages`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `jewelryitems`
--
ALTER TABLE `jewelryitems`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `payment_methods`
--
ALTER TABLE `payment_methods`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `social_shares`
--
ALTER TABLE `social_shares`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `user_activities`
--
ALTER TABLE `user_activities`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_preferences`
--
ALTER TABLE `user_preferences`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_profiles`
--
ALTER TABLE `user_profiles`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `wishlists`
--
ALTER TABLE `wishlists`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `auctions`
--
ALTER TABLE `auctions`
  ADD CONSTRAINT `FK_Auctions_JewelryItems_JewelryItemId` FOREIGN KEY (`JewelryItemId`) REFERENCES `jewelryitems` (`Id`),
  ADD CONSTRAINT `FK_Auctions_Users_SellerId` FOREIGN KEY (`SellerId`) REFERENCES `users` (`Id`),
  ADD CONSTRAINT `FK_Auctions_Users_WinningBidderId` FOREIGN KEY (`WinningBidderId`) REFERENCES `users` (`Id`) ON DELETE SET NULL;

--
-- Constraints for table `bids`
--
ALTER TABLE `bids`
  ADD CONSTRAINT `FK_Bids_Auctions_AuctionId` FOREIGN KEY (`AuctionId`) REFERENCES `auctions` (`Id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_Bids_Users_BidderId` FOREIGN KEY (`BidderId`) REFERENCES `users` (`Id`);

--
-- Constraints for table `contact_inquiries`
--
ALTER TABLE `contact_inquiries`
  ADD CONSTRAINT `contact_inquiries_ibfk_1` FOREIGN KEY (`AssignedToUserId`) REFERENCES `users` (`Id`) ON DELETE SET NULL;

--
-- Constraints for table `jewelryimages`
--
ALTER TABLE `jewelryimages`
  ADD CONSTRAINT `FK_JewelryImages_JewelryItems_JewelryItemId` FOREIGN KEY (`JewelryItemId`) REFERENCES `jewelryitems` (`Id`) ON DELETE CASCADE;

--
-- Constraints for table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `FK_notifications_Users_UserId` FOREIGN KEY (`UserId`) REFERENCES `users` (`Id`) ON DELETE CASCADE;

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `FK_Payments_Auctions_AuctionId` FOREIGN KEY (`AuctionId`) REFERENCES `auctions` (`Id`),
  ADD CONSTRAINT `FK_Payments_Users_PayerId` FOREIGN KEY (`PayerId`) REFERENCES `users` (`Id`);

--
-- Constraints for table `payment_methods`
--
ALTER TABLE `payment_methods`
  ADD CONSTRAINT `FK_PaymentMethods_Users_UserId` FOREIGN KEY (`UserId`) REFERENCES `users` (`Id`) ON DELETE CASCADE;

--
-- Constraints for table `social_shares`
--
ALTER TABLE `social_shares`
  ADD CONSTRAINT `FK_SocialShares_Auctions_AuctionId` FOREIGN KEY (`AuctionId`) REFERENCES `auctions` (`Id`) ON DELETE SET NULL,
  ADD CONSTRAINT `FK_SocialShares_Users_UserId` FOREIGN KEY (`UserId`) REFERENCES `users` (`Id`) ON DELETE SET NULL;

--
-- Constraints for table `user_activities`
--
ALTER TABLE `user_activities`
  ADD CONSTRAINT `FK_UserActivities_Users_UserId` FOREIGN KEY (`UserId`) REFERENCES `users` (`Id`) ON DELETE CASCADE;

--
-- Constraints for table `user_preferences`
--
ALTER TABLE `user_preferences`
  ADD CONSTRAINT `FK_UserPreferences_Users_UserId` FOREIGN KEY (`UserId`) REFERENCES `users` (`Id`) ON DELETE CASCADE;

--
-- Constraints for table `user_profiles`
--
ALTER TABLE `user_profiles`
  ADD CONSTRAINT `FK_UserProfiles_Users_UserId` FOREIGN KEY (`UserId`) REFERENCES `users` (`Id`) ON DELETE CASCADE;

--
-- Constraints for table `wishlists`
--
ALTER TABLE `wishlists`
  ADD CONSTRAINT `FK_Wishlists_JewelryItems_JewelryItemId` FOREIGN KEY (`JewelryItemId`) REFERENCES `jewelryitems` (`Id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_Wishlists_Users_UserId` FOREIGN KEY (`UserId`) REFERENCES `users` (`Id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
