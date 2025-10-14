-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 14, 2025 at 09:55 PM
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
(1, 'Vintage Diamond Ring Auction', 'Don\'t miss this rare opportunity to own a vintage Cartier diamond ring.', 1, 2, 3000.00, 12000.00, 100.00, 18000.00, '2025-09-08 13:37:46.499995', '2025-09-16 13:37:46.499996', 3, 3000.00, NULL, '2024-01-01 00:00:00.000000', '2025-09-18 15:50:29.882147'),
(2, 'Cultured Pearl Necklace', 'Beautiful cultured pearl necklace perfect for special occasions.', 2, 2, 1000.00, NULL, 50.00, NULL, '2025-09-08 13:37:46.499995', '2025-09-19 13:37:46.499996', 3, 1000.00, NULL, '2024-01-01 00:00:00.000000', '2025-09-24 05:44:33.304416'),
(3, 'Emerald Tennis Bracelet Auction', 'Exquisite Tiffany & Co emerald tennis bracelet. Perfect for collectors of fine jewelry.', 4, 2, 3000.00, 10000.00, 250.00, 15000.00, '2025-09-22 12:01:54.000000', '2025-09-29 12:01:54.000000', 3, 3000.00, NULL, '2024-01-01 00:00:00.000000', '2025-10-08 14:13:47.331271'),
(4, 'Antique Patek Philippe Pocket Watch', 'Rare 19th century pocket watch from renowned Swiss manufacturer. A true collector\'s piece.', 5, 2, 8000.00, 20000.00, 500.00, 30000.00, '2025-09-23 12:01:54.000000', '2025-10-04 12:01:54.000000', 3, 8500.00, NULL, '2024-01-01 00:00:00.000000', '2025-10-08 14:13:47.433850'),
(5, 'Bulgari Sapphire Pendant', 'Stunning sapphire pendant with diamond accents. Perfect for special occasions.', 6, 2, 2000.00, 6000.00, 150.00, 10000.00, '2025-09-24 12:01:54.000000', '2025-10-02 12:01:54.000000', 3, 2000.00, NULL, '2024-01-01 00:00:00.000000', '2025-10-08 14:13:47.437218'),
(6, 'Art Deco Diamond Brooch', 'Authentic 1920s Art Deco brooch from Van Cleef & Arpels. Museum quality piece.', 7, 2, 5000.00, 15000.00, 300.00, 22000.00, '2025-09-24 09:01:54.000000', '2025-09-30 12:01:54.000000', 3, 5300.00, NULL, '2024-01-01 00:00:00.000000', '2025-10-08 14:13:47.439086'),
(7, 'Mikimoto Pearl Ring', 'Classic vintage Mikimoto pearl ring with diamond accents. Timeless elegance.', 8, 2, 1200.00, 3500.00, 100.00, 5000.00, '2025-09-24 12:01:54.000000', '2025-09-28 12:01:54.000000', 3, 1200.00, NULL, '2024-01-01 00:00:00.000000', '2025-10-08 14:13:47.440978'),
(8, 'Modern Silver Anklet', 'Contemporary Italian sterling silver anklet with unique geometric design.', 9, 2, 150.00, NULL, 25.00, 600.00, '2025-09-24 13:01:54.000000', '2025-09-27 12:01:54.000000', 3, 150.00, NULL, '2024-01-01 00:00:00.000000', '2025-10-08 14:13:47.442773'),
(9, 'Harry Winston Ruby Diamond Necklace', 'Magnificent ruby and diamond necklace. The crown jewel of any collection.', 10, 2, 12000.00, 30000.00, 1000.00, 45000.00, '2025-09-24 08:01:54.000000', '2025-10-08 12:01:54.000000', 3, 13000.00, NULL, '2024-01-01 00:00:00.000000', '2025-10-08 14:13:47.444392'),
(10, 'Ruby Earrings Auction', 'Exquisite platinum ruby earrings. Perfect pair for the discerning collector.', 3, 2, 2500.00, 7000.00, 200.00, 10000.00, '2025-09-24 06:01:54.000000', '2025-10-03 12:01:54.000000', 3, 2700.00, NULL, '2024-01-01 00:00:00.000000', '2025-10-08 14:13:47.445943');

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
(4, 3, '/images/ruby-earrings-1.jpg', NULL, 1, 1, '2024-01-01 00:00:00.000000'),
(5, 4, '/images/emerald-bracelet-1.jpg', NULL, 1, 1, '2024-01-01 00:00:00.000000'),
(6, 4, '/images/emerald-bracelet-2.jpg', NULL, 0, 2, '2024-01-01 00:00:00.000000'),
(7, 5, '/images/pocket-watch-1.jpg', NULL, 1, 1, '2024-01-01 00:00:00.000000'),
(8, 6, '/images/sapphire-pendant-1.jpg', NULL, 1, 1, '2024-01-01 00:00:00.000000'),
(9, 7, '/images/art-deco-brooch-1.jpg', NULL, 1, 1, '2024-01-01 00:00:00.000000'),
(10, 8, '/images/pearl-ring-1.jpg', NULL, 1, 1, '2024-01-01 00:00:00.000000'),
(11, 9, '/images/silver-anklet-1.jpg', NULL, 1, 1, '2024-01-01 00:00:00.000000'),
(12, 10, '/images/ruby-diamond-necklace-1.jpg', NULL, 1, 1, '2024-01-01 00:00:00.000000'),
(13, 10, '/images/ruby-diamond-necklace-2.jpg', NULL, 0, 2, '2024-01-01 00:00:00.000000');

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
(3, 'Ruby Earrings', 'Pair of exquisite ruby earrings set in platinum.', 2, 5, NULL, 8.100, NULL, 2, NULL, NULL, NULL, 8500.00, '2024-01-01 00:00:00.000000'),
(4, 'Emerald Tennis Bracelet', 'Stunning tennis bracelet featuring 20 emerald-cut emeralds set in 18k white gold.', 3, 6, 'Tiffany & Co', 28.500, NULL, 1, 2010, 'Colombia', NULL, 12500.00, '2024-01-01 00:00:00.000000'),
(5, 'Antique Pocket Watch', 'Rare 19th century gold pocket watch with intricate engravings and Roman numerals.', 4, 0, 'Patek Philippe', 85.000, NULL, 2, 1890, 'Switzerland', NULL, 25000.00, '2024-01-01 00:00:00.000000'),
(6, 'Sapphire Pendant', 'Elegant sapphire pendant surrounded by diamonds on a platinum chain.', 6, 7, 'Bulgari', 15.200, NULL, 1, 2015, 'Sri Lanka', NULL, 8500.00, '2024-01-01 00:00:00.000000'),
(7, 'Art Deco Diamond Brooch', 'Geometric Art Deco brooch from the 1920s featuring diamonds and onyx.', 5, 3, 'Van Cleef & Arpels', 22.800, NULL, 2, 1925, 'France', NULL, 18000.00, '2024-01-01 00:00:00.000000'),
(8, 'Vintage Pearl Ring', 'Classic cultured pearl ring with diamond accents in yellow gold setting.', 0, 4, 'Mikimoto', 6.400, NULL, 1, 1975, 'Japan', NULL, 4200.00, '2024-01-01 00:00:00.000000'),
(9, 'Modern Silver Anklet', 'Contemporary sterling silver anklet with geometric patterns.', 7, 1, NULL, 12.100, NULL, 0, 2022, 'Italy', NULL, 450.00, '2024-01-01 00:00:00.000000'),
(10, 'Ruby and Diamond Necklace', 'Luxurious necklace featuring alternating rubies and diamonds in platinum.', 1, 5, 'Harry Winston', 65.300, NULL, 1, 2018, 'Burma', NULL, 35000.00, '2024-01-01 00:00:00.000000');

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
  `Username` varchar(50) NOT NULL,
  `Email` varchar(255) NOT NULL,
  `PasswordHash` longtext NOT NULL,
  `PhoneNumber` varchar(20) DEFAULT NULL,
  `Role` int(11) NOT NULL DEFAULT 0,
  `Status` int(11) NOT NULL DEFAULT 0,
  `CreatedAt` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `LastLogin` datetime(6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`Id`, `Username`, `Email`, `PasswordHash`, `PhoneNumber`, `Role`, `Status`, `CreatedAt`, `LastLogin`) VALUES
(1, 'admin', 'admin@royalbidz.com', '$2a$11$z74G0vlVhZHSL9lJncHtd.6.EN1q./.4rESGjM8yC6f9PvqczAeTS', '+1234567890', 2, 0, '2024-01-01 00:00:00.000000', NULL),
(2, 'seller1', 'seller@royalbidz.com', '$2a$11$9yE3NmzviiJAITHM6XdsCuTYKflVwbmUveTDvqEd7Pt1MEfptMXcS', '+1234567891', 1, 0, '2024-01-01 00:00:00.000000', NULL),
(3, 'buyer1', 'buyer@royalbidz.com', '$2a$11$y9pqcETt2c0NcIfYyAJcweER7tWnJpGUIGNm9dO.zr2DZDyHkkNpi', '+1234567892', 0, 0, '2024-01-01 00:00:00.000000', '2025-10-14 19:44:08.539816'),
(4, 'aaa', 'aaa@gmail.com', '$2a$11$z/YOU9JOD8cK0i7cR09VKuLWseJpm.uuJGOujNsiZYM6Cuc4BHhJq', '1111111111', 0, 0, '2025-10-14 19:03:14.352756', '2025-10-14 19:40:57.763229');

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
  ADD UNIQUE KEY `IX_Users_Email` (`Email`),
  ADD UNIQUE KEY `IX_Users_Username` (`Username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `auctions`
--
ALTER TABLE `auctions`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `bids`
--
ALTER TABLE `bids`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `jewelryimages`
--
ALTER TABLE `jewelryimages`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `jewelryitems`
--
ALTER TABLE `jewelryitems`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

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
