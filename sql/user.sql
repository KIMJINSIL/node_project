CREATE TABLE `users` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_email` varchar(100) NOT NULL,
  `user_password` varchar(1000) DEFAULT NULL,
  `user_name` varchar(50) DEFAULT NULL,
  `user_image` varchar(1000) DEFAULT NULL,
  `user_provider` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `user_email_UNIQUE` (`user_email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


CREATE TABLE `course` (
  `course_id` int(11) NOT NULL COMMENT '코스 고유 넘버',
  `course_name` varchar(100) DEFAULT NULL COMMENT '코스 이름',
  `course_latitude` varchar(1000) NOT NULL COMMENT '코스 위도',
  `course_longitude` varchar(1000) NOT NULL COMMENT '코스 경도',
  `course_qr` varchar(100) NOT NULL COMMENT '코스 큐알정보',
  PRIMARY KEY (`course_id`),
  UNIQUE KEY `course_qr_UNIQUE` (`course_qr`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


CREATE TABLE `users_course` (
  `users_course_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `course_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`users_course_id`),
  KEY `fk_users_idx` (`user_id`),
  KEY `fk_course_idx` (`course_id`),
  CONSTRAINT `fk_course` FOREIGN KEY (`course_id`) REFERENCES `course` (`course_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
