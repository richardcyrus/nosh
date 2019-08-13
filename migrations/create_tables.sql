--
-- For Sequelize Sessions
--
CREATE TABLE `Sessions` (
  `sid` varchar(36) NOT NULL,
  `expires` datetime DEFAULT NULL,
  `data` text,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`sid`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8;
--
-- User Profile Table.
--
CREATE TABLE `profiles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `latitude` varchar(255) DEFAULT NULL,
  `longitude` varchar(255) DEFAULT NULL,
  `radius` int(11) DEFAULT '3',
  `searchResults` int(11) DEFAULT '3',
  `gender` varchar(255) DEFAULT NULL,
  `photo` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8;
--
-- Users table with FK to profiles.
--
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `providerId` varchar(255) DEFAULT NULL,
  `provider` varchar(255) NOT NULL,
  `displayName` varchar(255) NOT NULL,
  `lastName` varchar(255) NOT NULL,
  `firstName` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `token` varchar(255) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `passwordResetToken` varchar(255) DEFAULT NULL,
  `passwordResetExpires` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `ProfileId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `users_email` (`email`),
  UNIQUE KEY `users_provider_id` (`providerId`),
  KEY `ProfileId` (`ProfileId`),
  KEY `users_display_name` (`displayName`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`ProfileId`) REFERENCES `profiles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8;
