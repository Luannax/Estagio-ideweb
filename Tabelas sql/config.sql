# Host: localhost:3325  (Version 5.5.5-10.1.37-MariaDB)
# Date: 2025-03-28 20:56:22
# Generator: MySQL-Front 6.1  (Build 1.26)


#
# Structure for table "config"
#

DROP TABLE IF EXISTS `config`;
CREATE TABLE `config` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `iniciar_leitor` enum('S','N') NOT NULL DEFAULT 'N',
  `idioma_id` int(11) NOT NULL DEFAULT '0',
  `idioma_nome` varchar(255) NOT NULL DEFAULT '',
  `voz_id` int(11) NOT NULL DEFAULT '0',
  `voz_nome` varchar(255) DEFAULT NULL,
  `velocidade` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `unique_user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

#
# Data for table "config"
#

