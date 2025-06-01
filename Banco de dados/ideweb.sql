# Host: localhost:3325  (Version 5.5.5-10.4.32-MariaDB)
# Date: 2025-06-01 16:33:58
# Generator: MySQL-Front 6.1  (Build 1.26)


#
# Structure for table "config"
#

DROP TABLE IF EXISTS `config`;
CREATE TABLE `config` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `user_name` varchar(255) NOT NULL DEFAULT '',
  `idioma_id` int(11) NOT NULL DEFAULT 0,
  `idioma_nome` varchar(255) NOT NULL DEFAULT '',
  `voz_id` int(11) NOT NULL DEFAULT 0,
  `voz_nome` varchar(255) NOT NULL DEFAULT '',
  `velocidade` varchar(255) NOT NULL DEFAULT '',
  PRIMARY KEY (`Id`),
  UNIQUE KEY `unique_user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

#
# Data for table "config"
#


#
# Structure for table "idiomas"
#

DROP TABLE IF EXISTS `idiomas`;
CREATE TABLE `idiomas` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(50) NOT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

#
# Data for table "idiomas"
#

INSERT INTO `idiomas` VALUES (1,'pt-BR'),(2,'en-EUA');

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
  `face_encoding` blob DEFAULT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `matricula_UNIQUE` (`matricula`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

#
# Data for table "usuarios"
#


#
# Structure for table "voz"
#

DROP TABLE IF EXISTS `voz`;
CREATE TABLE `voz` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(255) NOT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

#
# Data for table "voz"
#

INSERT INTO `voz` VALUES (1,'Microsoft Daniel Desktop'),(2,'Microsoft Zira');
