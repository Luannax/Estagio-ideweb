# Host: localhost:3325  (Version 5.5.5-10.1.37-MariaDB)
# Date: 2025-03-28 20:56:48
# Generator: MySQL-Front 6.1  (Build 1.26)


#
# Structure for table "usuarios"
#

DROP TABLE IF EXISTS `usuarios`;
CREATE TABLE `usuarios` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `matricula` char(15) NOT NULL DEFAULT '',
  `senha` varchar(255) NOT NULL DEFAULT '',
  `nome` varchar(255) NOT NULL DEFAULT '',
  `email` varchar(255) NOT NULL DEFAULT '',
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4;

#
# Data for table "usuarios"
#

