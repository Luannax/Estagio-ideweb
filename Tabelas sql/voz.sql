# Host: localhost:3325  (Version 5.5.5-10.1.37-MariaDB)
# Date: 2025-03-28 20:57:00
# Generator: MySQL-Front 6.1  (Build 1.26)


#
# Structure for table "voz"
#

DROP TABLE IF EXISTS `voz`;
CREATE TABLE `voz` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(255) NOT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=latin1;

#
# Data for table "voz"
#

INSERT INTO `voz` VALUES (1,'Google US English'),(2,'Google UK English Male'),(3,'Google UK English Female'),(4,'Microsoft Zira'),(5,'Microsoft David'),(6,'Microsoft Mark'),(7,'Apple Samantha'),(8,'Apple Alex');
