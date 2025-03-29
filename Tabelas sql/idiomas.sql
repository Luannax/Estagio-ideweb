# Host: localhost:3325  (Version 5.5.5-10.1.37-MariaDB)
# Date: 2025-03-28 20:56:33
# Generator: MySQL-Front 6.1  (Build 1.26)


#
# Structure for table "idiomas"
#

DROP TABLE IF EXISTS `idiomas`;
CREATE TABLE `idiomas` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(50) NOT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

#
# Data for table "idiomas"
#

INSERT INTO `idiomas` VALUES (1,'Português - pt-BR'),(2,'Inglês (EUA) - en-US');
