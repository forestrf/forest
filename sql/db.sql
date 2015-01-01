-- phpMyAdmin SQL Dump
-- version 4.2.7
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1:3306
-- Generation Time: Oct 23, 2014 at 02:16 AM
-- Server version: 5.5.39
-- PHP Version: 5.4.31

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `db`
--

-- --------------------------------------------------------

--
-- Table structure for table `access-token`
--

CREATE TABLE `access-token` (
	`IDuser` int(11) NOT NULL,
	`dropbox_accessToken` text COLLATE utf8_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
ALTER TABLE `access-token` ADD PRIMARY KEY (`IDuser`);

-- --------------------------------------------------------

--
-- Table structure for table `files`
--

CREATE TABLE `files` (
	`hash` varchar(32) COLLATE utf8_bin NOT NULL,
	`data` mediumblob NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
ALTER TABLE `files` ADD PRIMARY KEY (`hash`);

-- --------------------------------------------------------

--
-- Table structure for table `session_data`
--

CREATE TABLE `session_data` (
	`session_id` varchar(32) NOT NULL DEFAULT '',
	`hash` varchar(32) NOT NULL DEFAULT '',
	`session_data` blob NOT NULL,
	`session_expire` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
ALTER TABLE `session_data` ADD PRIMARY KEY (`session_id`);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
	`IDuser` int(11) NOT NULL AUTO_INCREMENT,
	`nick` varchar(15) COLLATE utf8_bin NOT NULL,
	`password` varchar(32) COLLATE utf8_bin NOT NULL,
	`email` varchar(50) COLLATE utf8_bin NOT NULL,
	`RND` varchar(32) COLLATE utf8_bin NOT NULL,
	`level` int(11) NOT NULL DEFAULT '0',
	`validation` varchar(5) COLLATE utf8_bin NOT NULL,
	`recover_code_due_date` date NOT NULL,
	`creation_date` date NOT NULL
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
ALTER TABLE `users` ADD PRIMARY KEY (`IDuser`);
ALTER TABLE `users` ADD UNIQUE KEY `nick` (`nick`);
ALTER TABLE `users` ADD UNIQUE KEY `email` (`email`);

-- --------------------------------------------------------

--
-- Table structure for table `variables`
--

CREATE TABLE `variables` (
	`IDuser` int(11) NOT NULL,
	`IDwidget` int(11) NOT NULL,
	`variable` varchar(30) COLLATE utf8_bin NOT NULL,
	`value` text COLLATE utf8_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
ALTER TABLE `variables` ADD PRIMARY KEY (`IDuser`,`IDwidget`,`variable`);
ALTER TABLE `variables` ADD KEY `variables IDwidget` (`IDwidget`);

-- --------------------------------------------------------

--
-- Table structure for table `widgets`
--

CREATE TABLE `widgets` (
	`IDwidget` int(11) NOT NULL AUTO_INCREMENT,
	`name` varchar(30) COLLATE utf8_bin NOT NULL,
	`description` TEXT NOT NULL, 
	`fulldescription` TEXT NOT NULL, 
	`images` TEXT NOT NULL COMMENT 'JSON array with the static image filenames', 
	`ownerID` int(11) NOT NULL,
	`published` int(11) NOT NULL DEFAULT '-1' COMMENT 'Si se publica cambiar a 0 o + desde php. Nunca volver a -1',
	`creation_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
ALTER TABLE `widgets` ADD PRIMARY KEY (`IDwidget`);
ALTER TABLE `widgets` ADD UNIQUE KEY `name` (`name`);
ALTER TABLE `widgets` ADD KEY `ownerID` (`ownerID`);

-- --------------------------------------------------------

--
-- Table structure for table `widgets-content`
--

CREATE TABLE `widgets-content` (
	`IDwidget` int(11) NOT NULL,
	`version` int(11) NOT NULL,
	`name` varchar(50) COLLATE utf8_bin NOT NULL,
	`hash` varchar(32) COLLATE utf8_bin NOT NULL,
	`mimetype` text COLLATE utf8_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
ALTER TABLE `widgets-content` ADD PRIMARY KEY (`IDwidget`,`version`,`name`);

-- --------------------------------------------------------

--
-- Table structure for table `widgets-user`
--

CREATE TABLE `widgets-user` (
	`IDuser` int(11) NOT NULL,
	`IDwidget` int(11) NOT NULL,
	`autoupdate` tinyint(1) NOT NULL DEFAULT '1',
	`version` int(11) NOT NULL COMMENT 'Mirar cuando autoupdate = 0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
ALTER TABLE `widgets-user` ADD PRIMARY KEY (`IDuser`,`IDwidget`);
ALTER TABLE `widgets-user` ADD KEY `widgets-user IDwidget` (`IDwidget`);

-- --------------------------------------------------------

--
-- Table structure for table `widgets-versions`
--

CREATE TABLE `widgets-versions` (
	`IDwidget` int(11) NOT NULL,
	`version` int(11) NOT NULL,
	`public` tinyint(1) NOT NULL COMMENT '0 = privada, 1 = pública',
	`visible` tinyint(1) NOT NULL DEFAULT '1' COMMENT '0 = oculto, 1 = visible',
	`comment` tinytext COLLATE utf8_bin NOT NULL,
	`creation_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
ALTER TABLE `widgets-versions` ADD PRIMARY KEY (`IDwidget`,`version`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `variables`
--
ALTER TABLE `variables`
ADD CONSTRAINT `variables IDwidget` FOREIGN KEY (`IDwidget`) REFERENCES `widgets` (`IDwidget`) ON DELETE CASCADE ON UPDATE CASCADE,
ADD CONSTRAINT `variables IDuser` FOREIGN KEY (`IDuser`) REFERENCES `users` (`IDuser`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `widgets`
--
ALTER TABLE `widgets`
ADD CONSTRAINT `widget owner` FOREIGN KEY (`ownerID`) REFERENCES `users` (`IDuser`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `widgets-content`
--
ALTER TABLE `widgets-content`
ADD CONSTRAINT `widgets-content IDwidget` FOREIGN KEY (`IDwidget`) REFERENCES `widgets` (`IDwidget`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `widgets-user`
--
ALTER TABLE `widgets-user`
ADD CONSTRAINT `widgets-user IDuser` FOREIGN KEY (`IDuser`) REFERENCES `users` (`IDuser`) ON DELETE CASCADE ON UPDATE CASCADE,
ADD CONSTRAINT `widgets-user IDwidget` FOREIGN KEY (`IDwidget`) REFERENCES `widgets` (`IDwidget`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `widgets-versions`
--
ALTER TABLE `widgets-versions`
ADD CONSTRAINT `widgets-versions IDwidget` FOREIGN KEY (`IDwidget`) REFERENCES `widgets` (`IDwidget`) ON DELETE CASCADE ON UPDATE CASCADE;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;





-- This will allow global variables
INSERT INTO `users` (`IDuser`, `nick`, `password`, `email`, `RND`, `level`, `validation`, `recover_code_due_date`, `creation_date`) VALUES ('0', 'global', '-', '-', '-', '0', '', '', '');
INSERT INTO `widgets` (`IDwidget`, `name`, `ownerID`, `published`) VALUES ('-1', 'global', '0', '-1');
