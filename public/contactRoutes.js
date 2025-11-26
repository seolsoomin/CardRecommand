const authenticate = require('../auth'); 

const express = require('express');
const router = express.Router(); 

const pool = require("./maria");

//구글 캘린더에 저장.
router
.post('/calendar/save', authenticate, async (req, res) => {
    const { summary, description, date } = req.body;
    const userEmail = req.user.email;

    try {
        console.log(`[Google Calendar] ${userEmail}의 캘린더에 이벤트 추가 요청 수신: ${summary}`);
        
        res.status(200).json({ 
            success: true, 
            message: 'Google 캘린더 인증 완료 및 데이터 수신 성공' 
        });

    } catch (err) {
        console.error(`[Google Calendar] 이벤트 추가 실패: ${err.message}`);
        res.status(500).json({ success: false, message: `캘린더 저장을 실패하였습니다. ${err.message}` });
    }
});

//curd?``
router
.get("/lookup", authenticate, async(req, res) => {//db에서 데이터 불러옴.
    let conn; //연결 변수
    userId = req.user.email; //인증 모듈에서 유저 이메일 가져옴.

    try{
        conn = await pool.getConnection(); //db와 연결
 
        const sql = "select date_format(spendDate, '%Y-%m-%d') as spendDate, tag, howMuch, memo from spendtbl where userID = ?"; //sql문
        const row = await conn.query(sql, userId); //sql문 실행

        console.log(`DB에서 데이터를 성공적으로 가져왔습니다.`); //로딩이 성공적인걸 알려줌.
        res.status(200).json({ //성공적으로 가져왔을 시 상태코드를 200으로 지정, 결과 json 지정
            success : true,
            spends : row
        });
    }
    catch(err){
        console.error(`오류 발생 : ${err}`);

        res.status(500).json({
            success : false,
            message : `데이터를 불러오지 못했습니다.`
        }); //res의 상태를 500으로 설정하고, 성공여부와 오류 메시지를 json에 저장함.
    }
    finally{
        if(conn){
            conn.release(); //연결해제
        }
    }   
})
.post("/save", authenticate, async(req, res) => { //사용자가 데이터 입력 했을 때, 사용자 별로 저장
    let conn; //연결 관련 변수
    const {spendDate, tag, howMuch, memo} = req.body; //body의 정보 가져옴
    const userID = req.user.email;

    try{
        conn = await pool.getConnection(); //db 연결

        if(!tag || !howMuch){ //필수 값이 입력되었는지 체크 후 오류 처리
            res.status(404).json({
                success : false,
                message : `태그 혹은 값은 필수 입력 값입니다.`
            });
        }

        if(parseInt(howMuch) <= 0){ //금액의 입력값이 0 이하인 경우 오류 처리
            res.status(400).json({
                success : false,
                message : `금액은 0 이하일 수 없습니다.`
            });
        }

        const sql = await conn.query("INSERT INTO spendtbl (userID, spendDate, tag, howMuch, memo) VALUES (?, ?, ?, ?, ?)", [userID, spendDate, tag, howMuch, memo]); //db에서 sql문 실행과 ?에 대한 인자.

        console.log("DB에 성공적으로 데이터를 저장하였습니다."); //성공 했을음 출력
        res.status(201).json({success : true, message : "저장 성공"}); //201 상태 설정하고, json으로 응답 넘김.
    }
    catch (err){
        console.error(`오류 발생 : ${err}`); //오류 발생했음을 알리고, 어떠한 오류인지 출력

        res.status(500).json({
            success : false,
            message : `저장에 실패했습니다.`
        }); //res의 상태를 500으로 지정하고 json에 성공여부와 오류 메시지 저장.
    }
    finally{
        if(conn)
            conn.release(); //db 연결 해제
    }
})
.put("/delete", async(req, res) => { //삭제 요청이 들어왔을 때 데이터 삭제. delete로 요청을 하는 것이 맞지만, body가 들어있으면 작동이 잘 되지 않아 put을 이용
    let conn;
    const {spendDate, tag, howMuch, memo} = req.body; //fetch 통해 데이터 가져옴

    if(memo === 'undefined'){ //만약에 memo가 undefined로 되어있으면, 일단 null로 바꿔줌
        memo == null;
    }

    try{
        conn = await pool.getConnection(); //db 연결

        const sql = `delete from spendtbl where spendDate = ? and tag = ? and howMuch = ? and memo = ?`
        await conn.query(sql, [spendDate, tag, howMuch, memo]); //DELETE sql문 실행
        
        console.log(`DB에서 데이터를 성공적으로 삭제하였습니다.`); //삭제 성공 알림 
        res.status(200).json({
                success : true, 
                message : "삭제 성공"}); //status 200으로 설정하고, json으로 넘김
    }
    catch (err) { //오류 발생 시 오류 발생 띄우고 미들웨어한테 오류 처리 맡김
        console.error(`오류 발생 : ${err}`);

        res.status(500).json({
                success : false,
                message : `삭제에 실패했습니다.`
            }
        ); //상태를 500으로 저장하고, 성공여부와 오류 메시지 json에 저장
    }
    finally{
        if(conn)
            conn.release(); //db 연결 해제
    }
});

//혜택 예상금액 계산 함수
function calculateBenefit(spendAmount, benefitVal) { 
    if (!benefitVal) return 0; //benefit 값 없으면 0 return
    
    const valStr = String(benefitVal).trim(); //benefitVal의 String으로 형변환하고, 공백 없앰

    // 혜택이 n% 인 경우 
    if (valStr.includes('%')) { 
        const rate = parseFloat(valStr.replace(/[^0-9.]/g, ''));
        return Math.floor(spendAmount * (rate / 100));
    } else { //한도가 cashcback인 경우
        const limit = parseInt(valStr.replace(/[^0-9]/g, ''), 10);
        
        const cashback = 1000 * parseInt(spendAmount / 10000);

        if(spendAmount >= 10000){
            return Math.min(limit, cashback);
        } else{
            return 0;   
        }
    }
}

//json 데이터 cardinfotbl과 tagtbl에 저장
async function mygrate(name){
    let conn; //db 연결변수

    try{

        conn = await pool.getConnection(); //db연결
        
        const rows = await conn.query(`select cardInfo 
                                        from cardjsontbl 
                                        where cardName = ?`, [name]); //cardjsontbl에서 추가한 카드의 json 가져옴

        if (!rows || rows.length === 0) { //만약 데이터가 존재하지 않는 경우 (db에 올바르게 추가되지 않은 경우임)
            console.log(`'${name}'에 관한 데이터가 없습니다.`);
            return;
        }

        const cardJson = rows[0]; //conn.query는 항상 array형태로 반환. 따라서 인덱스를 통해 데이터를 가져옴.
        const cardInfo = cardJson.cardInfo; //가져온 데이터에서 cardInfo 저장

        const imgUrl = cardInfo["card.img"] || ""; //데이터에서 이미지 경로를 가져옴. 없는 경우 null

        let benefits = Array.isArray(cardInfo.benefits) ? cardInfo.benefits.join(', ') : (cardInfo.benefits || "");
        //

        await conn.query(`insert into cardinfotbl 
                          (cardName, imageUrl, benefits) 
                          values (?, ?, ?)`, [name, imgUrl, benefits]);
        
        //tag와 benefit에 맞춰서 데이터 저장.
        for(let i = 1; i <= 5; i++){
            const tag = cardInfo[`tag${i}`];  //tag1, tag2... i에 맞춰서 잘라옴
            const benefit = cardInfo[`benefit${i}`]; //benefit1, benefit2.. tag와 맞춰서 가져옴
            
            if (!tag) { //만약 tag가 없어도 반복문 계속 진행
                continue;
            } 

            await conn.query(`insert into tagtbl (cardName, tag, benefitVal)
                              values (?, ?, ?)`, [name, tag, benefit || ""]); //tagtbl에 데이터 삽입
        }

    } catch (err) {
        console.error(`데이터 저장 실패 : ${err}`); //에러 출력
    } finally{
        if(conn) {
            conn.release(); //db 연결 해제
        }
    }
}
//card 정보와 관련된 라우터들.
router
.get("/card/load", async(req, res) => { //cardjsontbl에서 카드 정보 읽어옴
    let conn; //db 연결 변수
    
    try{
        conn = await pool.getConnection(); //db 연결

        console.log(req.body);

        const sql = `select cardInfo from cardjsontbl`; //card에 대해서 json으로 저장한 값을 가져오게 함. 

        const rows = await conn.query(sql); //sql문 실행 한 결과 저장 (배열로 저장)

        const cardList = rows.map(row => { //array.map 함수 이용해서 가져온 값들 순환 처리.
            return typeof row.cardInfo === 'string' ? JSON.parse(row.cardInfo) : row.cardInfo;
            //만약 rows의 cardInfo가 json이 아니라 String이라면 Json.parse를 통해 json형태로 변환. 아닌 경우 그대로 사용.
        });
        
        console.log(`카드 데이터를 DB에서 성공적으로 읽어왔습니다.`)
        res.status(200).json(cardList); //결과를 성공으로 저장하고, db에 저장한 json 데이터를 res로 지정.

    } catch(err) { //에러 처리
        console.error(`로딩 실패 : ${err}`); //에러가 발생했음을 알리고 어떠한 오류가 발생해는지 출력

        res.status(500).json({success :false, message : `데이터를 불러오지 못했습니다.`}); 
        //res의 상태를 500으로 지정하고 성공여부와 오류 메시지 json으로 저장

    } finally {
        if(conn) {
            conn.release(); //db 해제
        } 
    }
})
.post("/card/save", async(req, res) => { //admin 페이지에서 카드 정보 저장 처리하는 라우터.
    let conn; //연결 변수
    const cardName = req.body['card.name']; //카드 이름 

    try{
        conn = await pool.getConnection(); //db 연결

        const sql = `insert into cardjsontbl (cardName, cardInfo) values (?, ?)`; //저장 sql문

        await conn.query(sql, [cardName, req.body]); //카드 이름과 json 저장

        console.log(`카드 정보를 성공적으로 저장하였습니다.`); //저장 성공했음 알림
        res.status(201).json({ //상태 201로 지정해 생성 성공으로 하고, json 지정
            success : true,
            message : `카드 정보 저장 성공`
        });
    } catch (err) { //저장에 실패했을 때 오류.
        console.error(`저장 실패 : ${err}`);
        
        res.status(500).json({ //코드 500으로 설정해 서버 오류라고 상태를 알리고, json 내용 지정
            success : false,
            message : `카드 정보 추가를 실패했습니다.`
        })
    } finally {
        mygrate(cardName);

        if(conn) {
            conn.release(); //db 연결 해제
        }
    }
})
.get("/card/recommend", authenticate, async(req, res) => {
    let conn; //db 연결 관련 변수
    const userID = req.user.email; //userID가져옴

    try{
        conn = await pool.getConnection(); //db 연결

        await conn.query(`delete from userspendtbl where userEmail = ?`, userID); //통계 데이터 생성을 위해 이미 데이터가 있다면 삭제.

        const statSql = `insert into userspendtbl (userEmail, tag, totalSpend)
                        select userID, tag, sum(howMuch)
                        from spendtbl
                        where userID = ? 
                        group by tag`  //데이터에 관해 통계를 내고, 데이터 삽입. spendtbl에서 데이터 가져와서 통계냄(로그인한 사용자에 대해서만)
                         
        await conn.query(statSql, userID); //통계 테이블에 데이터 삽입

        const sql = `
            SELECT 
                C.cardName,
                C.imageUrl,
                C.benefits,
                T.tag,
                T.benefitVal, 
                COALESCE(SUM(S.howMuch), 0) as tagTotalSpend
            FROM cardinfotbl C
            JOIN tagtbl T ON C.cardName = T.cardName
            LEFT JOIN spendtbl S ON T.tag = S.tag AND S.userID = ?
            GROUP BY C.cardName, T.tag`; //추천 위한 데이터 가져옴 (JOIN 이용)

        const recommendData = await conn.query(sql, userID); //추천 데이터 가져옴.

        const cardMap = {}; //넘겨 줄 정보

        recommendData.forEach(row => {
            const { cardName, imageUrl, benefits, tag, benefitVal, tagTotalSpend } = row; //row에서 데이터 가져옴

            if (!cardMap[cardName]) { //각 카드 별로 넘겨 줄 json 생성
                cardMap[cardName] = {
                    name: cardName, //카드이름
                    imageUrl: imageUrl, //카드 이미지 파일 경로
                    benefits: benefits, //카드 혜택 
                    maxBenefit: 0, //카드 사용 시 얻는 혜택
                    matchedTags: [], //match된 태그
                    otherTags : [] //match 되지 않은 태그
                };
            }

           let benefitAmt = 0; //태그 별 혜택 임시 저장
    
            if (tagTotalSpend > 0) {
                benefitAmt = calculateBenefit(Number(tagTotalSpend), benefitVal); //
            }

            if (benefitAmt > 0) {//카드 태그에 혜택 금액이 존재하는 경우
                cardMap[cardName].maxBenefit += benefitAmt; //maxBenefit에 +
                cardMap[cardName].matchedTags.push(`${tag}`); //push통해 matchtag 추가
            } else {
                cardMap[cardName].otherTags.push(tag); //match되지 않았을 경우 otherTags에 tag 추가
            }
        });

        const sortedCards = Object.values(cardMap) //객체를 배열로 바꿈 현재 상태 ) "신한카드" : {정보}
            .sort((a, b) => b.maxBenefit - a.maxBenefit) //혜택 금액을 내림차순으로 정렬
            .slice(0, 3); //혜택이 큰 카드 3순위 가져옴.

        const recommendations = sortedCards.map(card => ({ //sortedCards array.map 이용해 순회.
            name: card.name, //카드 이름
            imageUrl: card.imageUrl, //이미지 경로 
            benefits: card.benefits, //카드 혜택
            tags: [...card.matchedTags, ...card.otherTags], // 태그가 없으면 빈 배열, ...은 전개연산자로 배열의 요소 하나하나 넘겨준다. 
            maxBenefit: card.maxBenefit || 0 //만약 값이 없으면 0
        }));
        
        console.log(`카드 추천 로직이 성공적으로 실행되었습니다.`); //카드 추천 로직 성공함을 알림.
        return res.status(200).json({ //200으로 상태를 정하고, 추천 결과 넘겨줌
            success : true,
            recommandation :recommendations
        });

    } catch(err) {
        console.error(`오류 발생 : ${err}`); //오류 띄우기

        res.status(500).json({ //res에 상태 500으로 설정, 결과를 json으로 저장
            success : false,
            message : `카드 추천에 실패하였습니다.`
        });
        
    } finally {
        if(conn) {
            conn.release(); //db연결 해제
        }
    }
});

module.exports = router; //내보내주는 코드
