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

-- 테이블 데이터 carddb.cardinfotbl:~7 rows (대략적) 내보내기
INSERT INTO `cardinfotbl` (`cardName`, `tag`, `tagBenefit`) VALUES
	('신한카드 Hey Young 체크', '["편의점", "쇼핑", "카페/베이커리", "구독"]', '["최대 5천원 캐시백 제공"]'),
	('신한카드 On 체크', '["편의점", "쇼핑", "카페/베이커리", "통신/렌탈", "레저/스포츠"]', '["생활편의영역 이용 시 최대 2% 적립"]'),
	('신한카드 Pick E 체크', '["편의점", "카페/베이커리", "외식/배달"]', '["4대 편의점(GS25, CU, 세븐일레븐, 이마트 24) 마이 신한 포인트 10% 적립", "커피 업종 이용시 마이 신한 포인트 10% 적립", "월 최다 이용 요식 가맹점 마이 신한 포인트 최대 3천 포인트 적립"]'),
	('신한카드 Pick I 체크', '["편의점", "카페/베이커리", "구독", "쇼핑"]', '["4대 편의점(GS25, CU, 세븐일레븐, 이마트 24) 마이 신한 포인트 10% 적립", "커피 업종 이용시 마이 신한 포인트 10% 적립", "디지털 구독 영역(음악, OTT, 도서) 이용 시 마이신한 포인트 10% 적립", "월 최다 이용 온라인 쇼핑몰 가맹점 마이신한 포인트 최대 3천 포인트 적립"]'),
	('신한카드 Point Plan 체크', '["편의점", "외식/배달"]', '["CU, GS25, 세븐일레븐 이용금약 5% 적립", "주말 배달비 건당 2만원 이상 결제 시 1천 포인트 적립"]'),
	('신한카드 Way 체크', '["편의점", "쇼핑", "카페/베이커리", "통신/렌탈", "레저/스포츠", "대중교통"]', '["생활편의영역 이용 시 최대 2% 적립", "대중교통(버스/지하철) 이용시 최대 5% 적립"]'),
	('신한카드 처음 체크', '["편의점", "카페/베이커리", "쇼핑"]', '["5 ~ 7% 적립", "3천 포인트 적립"]');

-- 테이블 carddb.cardjsontbl 구조 내보내기
CREATE TABLE IF NOT EXISTS `cardjsontbl` (
  `cardName` varchar(45) DEFAULT NULL,
  `cardInfo` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`cardInfo`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 테이블 데이터 carddb.cardjsontbl:~5 rows (대략적) 내보내기
INSERT INTO `cardjsontbl` (`cardName`, `cardInfo`) VALUES
	('신한카드 Hey Young 체크', '{\r\n    "card.name": "신한카드 Hey Young 체크",\r\n    "card.img": "../images/shinhanCardHeyYoung.png",\r\n    "tag1": "편의점",\r\n    "tag2": "쇼핑", \r\n    "tag3": "카페/베이커리", \r\n    "tag4": "구독",\r\n    "tag5": "",\r\n    "benefit1": "5000",\r\n    "benefit2": "5000",\r\n    "benefit3": "5000",\r\n    "benefit4": "5000",\r\n    "benefit5": "",\r\n    "benefits": "최대 5000원 캐시백 제공"\r\n  }'),
	('신한카드 On 체크', ' {\r\n    "card.name": "신한카드 On 체크",\r\n    "card.img": "../images/shinhanCardOnCheck.png",\r\n    "tag1": "편의점",\r\n    "tag2": "쇼핑",\r\n    "tag3": "카페/베이커리",\r\n    "tag4": "통신/렌탈",\r\n    "tag5": "레저/스포츠",\r\n    "benefit1": "2%",\r\n    "benefit2": "2%",\r\n    "benefit3": "2%",\r\n    "benefit4": "2%",\r\n    "benefit5": "2%",\r\n    "benefits": "생활편의영역 이용 시 최대 2% 적립"\r\n  }'),
	('신한카드 Pick E 체크', '{\r\n    "card.name": "신한카드 Pick E 체크",\r\n    "card.img": "../images/shinhanCardPickE.png",\r\n    "tag1": "편의점",\r\n    "tag2": "카페/베이커리",\r\n    "tag3": "외식/배달",\r\n    "tag4": "",\r\n    "tag5": "",\r\n    "benefit1": "10%",\r\n    "benefit2": "10%",\r\n    "benefit3": "3000",\r\n    "benefit4": "",\r\n    "benefit5": "",\r\n    "benefits": "4대 편의점(GS25, CU, 세븐일레븐, 이마트 24) 마이 신한 포인트 10% 적립 ,커피 업종 이용시 마이 신한 포인트 10% 적립, 월 최다 이용 요식 가맹점 마이 신한 포인트 최대 3천 포인트 적립"\r\n  }'),
	('신한카드 Pick I 체크', '{\r\n    "card.name": "신한카드 Pick I 체크",\r\n    "card.img": "../images/shinhanCardPickI.png",\r\n    "tag1": "편의점",\r\n    "tag2": "카페/베이커리",\r\n    "tag3": "구독",\r\n    "tag4": "쇼핑",\r\n    "tag5": "",\r\n    "benefit1": "10%",\r\n    "benefit2": "10%",\r\n    "benefit3": "10%",\r\n    "benefit4": "3000",\r\n    "benefit5": "",\r\n    "benefits": "4대 편의점(GS25, CU, 세븐일레븐, 이마트 24) 마이 신한 포인트 10% 적립, 커피 업종 이용시 마이 신한 포인트 10% 적립, 디지털 구독 영역(음악, OTT, 도서) 이용 시 마이신한 포인트 10% 적립, 월 최다 이용 온라인 쇼핑몰 가맹점 마이신한 포인트 최대 3천 포인트 적립"\r\n  }'),
	('신한카드 Way 체크', '{\r\n    "card.name": "신한카드 Way 체크",\r\n    "card.img": "../images/shinhanCardWay.png",\r\n    "tag1": "편의점",\r\n    "tag2": "카페/베이커리",\r\n    "tag3": "통신/렌탈",\r\n    "tag4": "레저/스포츠",\r\n    "tag5": "대중교통",\r\n    "benefit1": "2%",\r\n    "benefit2": "2%",\r\n    "benefit3": "2%",\r\n    "benefit4": "2%",\r\n    "benefit5": "5%",\r\n    "benefits": "생활편의영역 이용 시 최대 2% 적립, 대중교통(버스/지하철) 이용시 최대 5% 적립"\r\n  }');

-- 테이블 carddb.spendtbl 구조 내보내기
CREATE TABLE IF NOT EXISTS `spendtbl` (
  `spendDate` date NOT NULL,
  `tag` varchar(45) NOT NULL,
  `howMuch` int(11) NOT NULL,
  `memo` varchar(45) DEFAULT NULL,
  `userID` varchar(230) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 테이블 데이터 carddb.spendtbl:~18 rows (대략적) 내보내기
INSERT INTO `spendtbl` (`spendDate`, `tag`, `howMuch`, `memo`, `userID`) VALUES
	('2025-11-07', '편의점', 3000, '', 'son2497474@gmail.com'),
	('2025-11-01', '카페/베이커리', 9000, '', 'son2497474@gmail.com'),
	('2025-11-22', '쇼핑', 80000, '', 'son2497474@gmail.com'),
	('2025-11-12', '편의점', 3000, '', 'son2497474@gmail.com'),
	('2025-11-10', '대형마트', 5000, '과자 쇼핑', 'son2497474@gmail.com'),
	('2025-11-06', '외식/배달', 8000, '', 'son2497474@gmail.com'),
	('2025-11-11', '외식/배달', 6000, '학식', 'son2497474@gmail.com'),
	('2025-11-11', '카페/베이커리', 4400, '', 'son2497474@gmail.com'),
	('2025-11-29', '대중교통', 8400, '시외버스(왕복)', 'son2497474@gmail.com'),
	('2025-11-24', '구독', 7000, '넷플', 'son2497474@gmail.com'),
	('2025-11-04', '편의점', 5500, '점심', 'son2497474@gmail.com'),
	('2025-11-11', '쇼핑', 20000, '', 'modney2911@gmail.com'),
	('2025-11-14', '대중교통', 4200, '시외버스', 'modney2911@gmail.com'),
	('2025-11-14', '영화/공연', 8000, '영화', 'modney2911@gmail.com'),
	('2025-11-08', '쇼핑', 40000, '쇼핑', 'modney2911@gmail.com'),
	('2025-11-02', '외식/배달', 12300, '스파게티', 'son2497474@gmail.com'),
	('2025-11-28', '카페/베이커리', 4700, '먹을만 했따?', 'son2497474@gmail.com'),
	('2025-11-20', '쇼핑', 90000, '취미생활용', 'son2497474@gmail.com'),
	('2025-11-19', '쇼핑', 60000, '^0^', 'son2497474@gmail.com');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
