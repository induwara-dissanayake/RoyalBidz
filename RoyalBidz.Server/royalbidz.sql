-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 15, 2025 at 12:45 PM
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
  `WinningBidderId` int(11) DEFAULT NULL,
  `CreatedAt` datetime(6) NOT NULL,
  `UpdatedAt` datetime(6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `auctions`
--

INSERT INTO `auctions` (`Id`, `Title`, `Description`, `JewelryItemId`, `SellerId`, `StartingBid`, `ReservePrice`, `BidIncrement`, `BuyNowPrice`, `StartTime`, `EndTime`, `Status`, `CurrentBid`, `WinningBidderId`, `CreatedAt`, `UpdatedAt`) VALUES
(1, 'Vintage Diamond Ring Auction', 'Don\'t miss this rare opportunity to own a vintage Cartier diamond ring.', 1, 2, 3000.00, 12000.00, 100.00, 18000.00, '2025-09-08 13:37:46.499995', '2025-09-16 13:37:46.499996', 2, 3000.00, NULL, '2024-01-01 00:00:00.000000', NULL),
(2, 'Cultured Pearl Necklace', 'Beautiful cultured pearl necklace perfect for special occasions.', 2, 2, 1000.00, NULL, 50.00, NULL, '2025-09-08 13:37:46.499995', '2025-09-19 13:37:46.499996', 2, 1000.00, NULL, '2024-01-01 00:00:00.000000', NULL);

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

--
-- Dumping data for table `jewelryimages`
--

INSERT INTO `jewelryimages` (`Id`, `JewelryItemId`, `ImageUrl`, `AltText`, `IsPrimary`, `DisplayOrder`, `CreatedAt`) VALUES
(1, 1, '/images/diamond-ring-1.jpg', NULL, 1, 1, '2024-01-01 00:00:00.000000'),
(2, 1, '/images/diamond-ring-2.jpg', NULL, 0, 2, '2024-01-01 00:00:00.000000'),
(3, 2, '/images/pearl-necklace-1.jpg', NULL, 1, 1, '2024-01-01 00:00:00.000000'),
(4, 3, '/images/ruby-earrings-1.jpg', NULL, 1, 1, '2024-01-01 00:00:00.000000');

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

--
-- Dumping data for table `jewelryitems`
--

INSERT INTO `jewelryitems` (`Id`, `Name`, `Description`, `Type`, `PrimaryMaterial`, `Brand`, `Weight`, `Dimensions`, `Condition`, `YearMade`, `Origin`, `CertificationDetails`, `EstimatedValue`, `CreatedAt`) VALUES
(1, 'Vintage Diamond Ring', 'A stunning vintage diamond ring from the 1950s featuring a 2-carat center stone.', 0, 3, 'Cartier', 5.200, NULL, 1, 1955, 'France', NULL, 15000.00, '2024-01-01 00:00:00.000000'),
(2, 'Pearl Necklace', 'Elegant cultured pearl necklace with 18k gold clasp.', 1, 4, NULL, 45.800, NULL, 0, NULL, NULL, NULL, 3500.00, '2024-01-01 00:00:00.000000'),
(3, 'Ruby Earrings', 'Pair of exquisite ruby earrings set in platinum.', 2, 5, NULL, 8.100, NULL, 2, NULL, NULL, NULL, 8500.00, '2024-01-01 00:00:00.000000');

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
  `ProcessedAt` datetime(6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `Id` int(11) NOT NULL,
  `FirstName` varchar(100) NOT NULL,
  `LastName` varchar(100) NOT NULL,
  `Email` varchar(255) NOT NULL,
  `PasswordHash` longtext NOT NULL,
  `PhoneNumber` varchar(20) DEFAULT NULL,
  `Address` varchar(500) DEFAULT NULL,
  `Role` int(11) NOT NULL,
  `Status` int(11) NOT NULL,
  `CreatedAt` datetime(6) NOT NULL,
  `LastLogin` datetime(6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`Id`, `FirstName`, `LastName`, `Email`, `PasswordHash`, `PhoneNumber`, `Address`, `Role`, `Status`, `CreatedAt`, `LastLogin`) VALUES
(1, 'Admin', 'User', 'admin@royalbidz.com', '$2a$11$z74G0vlVhZHSL9lJncHtd.6.EN1q./.4rESGjM8yC6f9PvqczAeTS', NULL, NULL, 2, 0, '2024-01-01 00:00:00.000000', '2025-09-15 10:42:52.464342'),
(2, 'John', 'Seller', 'seller@royalbidz.com', '$2a$11$9yE3NmzviiJAITHM6XdsCuTYKflVwbmUveTDvqEd7Pt1MEfptMXcS', NULL, NULL, 1, 0, '2024-01-01 00:00:00.000000', NULL),
(3, 'Jane', 'Buyer', 'buyer@royalbidz.com', '$2a$11$y9pqcETt2c0NcIfYyAJcweER7tWnJpGUIGNm9dO.zr2DZDyHkkNpi', NULL, NULL, 0, 0, '2024-01-01 00:00:00.000000', NULL);

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
  ADD KEY `IX_Auctions_WinningBidderId` (`WinningBidderId`);

--
-- Indexes for table `bids`
--
ALTER TABLE `bids`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `IX_Bids_AuctionId_BidTime` (`AuctionId`,`BidTime`),
  ADD KEY `IX_Bids_BidderId` (`BidderId`);

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
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `IX_Payments_AuctionId` (`AuctionId`),
  ADD KEY `IX_Payments_PayerId` (`PayerId`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`Id`),
  ADD UNIQUE KEY `IX_Users_Email` (`Email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `auctions`
--
ALTER TABLE `auctions`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `bids`
--
ALTER TABLE `bids`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `jewelryimages`
--
ALTER TABLE `jewelryimages`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `jewelryitems`
--
ALTER TABLE `jewelryitems`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

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
-- Constraints for table `jewelryimages`
--
ALTER TABLE `jewelryimages`
  ADD CONSTRAINT `FK_JewelryImages_JewelryItems_JewelryItemId` FOREIGN KEY (`JewelryItemId`) REFERENCES `jewelryitems` (`Id`) ON DELETE CASCADE;

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `FK_Payments_Auctions_AuctionId` FOREIGN KEY (`AuctionId`) REFERENCES `auctions` (`Id`),
  ADD CONSTRAINT `FK_Payments_Users_PayerId` FOREIGN KEY (`PayerId`) REFERENCES `users` (`Id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
