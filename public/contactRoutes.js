const express = require('express');
const router = express.Router(); 

const pool = require("../maria"); //mariadb와 nodejs 연결

router
.post("/", async(req, res, next) => { //사용자가 데이터 입력 했을 때
    let conn; //연결 관련 변수
    const {spendDate, tag, howMuch, memo} = req.body; //body의 정보 가져옴

    try{
        conn = await pool.getConnection(); //db 연결

        if(!tag || !howMuch){ //필수 값이 입력되었는지 체크 후 오류 처리
            const error = new Error("필수 값이 입력되지 않았습니다.");
            error.status = 400;
            next(error);
        }

        if(parseInt(howMuch) <= 0){ //금액의 입력값이 0 이하인 경우 오류 처리
            const error = new Error("금액은 0 이하 일 수 없습니다.");
            error.status = 400;
            next(error);
        }

        const sql = "INSERT INTO spendtbl (spendDate, tag, howMuch, memo) VALUES (?, ?, ?, ?)"; //sql문

        await conn.query(sql, [spendDate, tag, howMuch, memo]); //db에서 sql문 실행과 ?에 대한 인자.

        console.log("save success."); //성공 했을음 출력
        res.status(201).json({success : true, message : "저장 성공", id : sql.insertId}); //201 상태 설정하고, json으로 응답 넘김.
    }
    catch (err){
        console.log(`오류 발생 : ${err}`); //오류 발생했음을 알리고, 어떠한 오류인지 출력

        const error = new Error('저장에 실패하였습니다.'); //errorhandler 이용한 오류 처리 (미들웨어)
        error.status = 500;
        next(error);
    }
    finally{
        if(conn)
            conn.release(); //db 연결 해제
    }
})
.put("/", async(req, res, next) => { //자료 수정 요청이 있을 때 업데이트 해줌
    let conn;

    try{
        conn.getConnection();//db 연결

        // const sql; //sql문

        res.status(200).json({success : true, message : "수정 성공"});

    }
    catch (err) { //오류처리
        console.log(`오류 발생 : ${err}`); //오류 발생했음을 알리고, 어떠한 오류인지 출력

        const error = new Error('저장에 실패하였습니다.'); //errorhandler 이용한 오류 처리 (미들웨어)
        error.status = 500;
        next(error);
    }
    finally{
        conn.release(); //db 연결 해제
    }
})
.delete("/:id", async(req, res, next) => { //삭제 요청이 들어왔을 때 데이터 삭제 해줌.
    let conn;

    try{
        conn = await pool.getConnection();

        const sql = 'DELETE FROM spendtbl WHERE id = ?';

        res.status(200).json({success : true, message : "삭제 성공"});

    }
    catch (err) {
        console.log(`오류 발생 : ${err}`);

        const error = new Error("삭제를 실패하였습니다.");
        error.status = 500;
        next(error);
    }
    finally{
        if(conn)
            conn.release();
    }
});

module.exports = router;
