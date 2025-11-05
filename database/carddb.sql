-- --------------------------------------------------------
-- 호스트:                          127.0.0.1
-- 서버 버전:                        11.4.8-MariaDB - mariadb.org binary distribution
-- 서버 OS:                        Win64
-- HeidiSQL 버전:                  12.11.0.7065
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

-- 테이블 carddb.cardinfotbl 구조 내보내기
CREATE TABLE IF NOT EXISTS `cardinfotbl` (
  `cardName` varchar(45) NOT NULL,
  `tag` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`tag`)),
  `tagBenefit` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`tagBenefit`)),
  PRIMARY KEY (`cardName`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 테이블 데이터 carddb.cardinfotbl:~0 rows (대략적) 내보내기
INSERT INTO `cardinfotbl` (`cardName`, `tag`, `tagBenefit`) VALUES
	('신한카드 Hey Young 체크', '["편의점", "쇼핑", "카페/베이커리", "구독"]', '["최대 5천원 캐시백 제공"]'),
	('신한카드 On 체크', '["편의점", "쇼핑", "카페/베이커리", "통신/렌탈", "레저/스포츠"]', '["생활편의영역 이용 시 최대 2% 적립"]'),
	('신한카드 Pick E 체크', '["편의점", "카페/베이커리", "외식/배달"]', '["4대 편의점(GS25, CU, 세븐일레븐, 이마트 24) 마이 신한 포인트 10% 적립", "커피 업종 이용시 마이 신한 포인트 10% 적립", "월 최다 이용 요식 가맹점 마이 신한 포인트 최대 3천 포인트 적립"]'),
	('신한카드 Pick I 체크', '["편의점", "카페/베이커리", "구독", "쇼핑"]', '["4대 편의점(GS25, CU, 세븐일레븐, 이마트 24) 마이 신한 포인트 10% 적립", "커피 업종 이용시 마이 신한 포인트 10% 적립", "디지털 구독 영역(음악, OTT, 도서) 이용 시 마이신한 포인트 10% 적립", "월 최다 이용 온라인 쇼핑몰 가맹점 마이신한 포인트 최대 3천 포인트 적립"]'),
	('신한카드 Point Plan 체크', '["편의점", "외식/배달"]', '["CU, GS25, 세븐일레븐 이용금약 5% 적립", "주말 배달비 건당 2만원 이상 결제 시 1천 포인트 적립"]'),
	('신한카드 Way 체크', '["편의점", "쇼핑", "카페/베이커리", "통신/렌탈", "레저/스포츠", "대중교통"]', '["생활편의영역 이용 시 최대 2% 적립", "대중교통(버스/지하철) 이용시 최대 5% 적립"]'),
	('신한카드 처음 체크', '["편의점", "카페/베이커리", "쇼핑"]', '["5 ~ 7% 적립", "3천 포인트 적립"]');

-- 테이블 carddb.recepittbl 구조 내보내기
CREATE TABLE IF NOT EXISTS `recepittbl` (
  `tag` varchar(45) NOT NULL,
  `howMuch` int(11) DEFAULT NULL,
  `spendTotal` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 테이블 데이터 carddb.recepittbl:~0 rows (대략적) 내보내기

-- 테이블 carddb.spendtbl 구조 내보내기
CREATE TABLE IF NOT EXISTS `spendtbl` (
  `spendDate` date NOT NULL,
  `tag` varchar(45) NOT NULL,
  `howMuch` int(11) DEFAULT NULL,
  `memo` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`tag`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 테이블 데이터 carddb.spendtbl:~0 rows (대략적) 내보내기

-- 테이블 carddb.tagtbl 구조 내보내기
CREATE TABLE IF NOT EXISTS `tagtbl` (
  `tagName` varchar(45) NOT NULL,
  PRIMARY KEY (`tagName`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 테이블 데이터 carddb.tagtbl:~12 rows (대략적) 내보내기
INSERT INTO `tagtbl` (`tagName`) VALUES
	('구독'),
	('대중교통'),
	('대형마트'),
	('레저/스포츠'),
	('쇼핑'),
	('여행/숙박'),
	('영화/공연'),
	('외식/배달'),
	('주유'),
	('카페/베이커리'),
	('통신/렌탈'),
	('편의점');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
