const express = require('express');
const router = express.Router(); 

const pool = require("../maria"); //mariadb와 nodejs 연결

router
.post("/save", async(req, res, next) => { //사용자가 데이터 입력 했을 때
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

        const sql = await conn.query("INSERT INTO spendtbl (spendDate, tag, howMuch, memo) VALUES (?, ?, ?, ?)", [spendDate, tag, howMuch, memo]); //db에서 sql문 실행과 ?에 대한 인자.

        console.log("save success."); //성공 했을음 출력
        res.status(201).json({success : true, message : "저장 성공"}); //201 상태 설정하고, json으로 응답 넘김.
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
.put("/delete", async(req, res, next) => { //삭제 요청이 들어왔을 때 데이터 삭제. delete로 요청을 하는 것이 맞지만, body가 들어있으면 작동이 잘 되지 않아 put을 이용
    let conn;
    const {spendDate, tag, howMuch, memo} = req.body;

    if(memo === 'undefined'){
        memo == null;
    }

    try{
        conn = await pool.getConnection();

        await conn.query("DELETE FROM spendtbl WHERE spendDate  = ? AND tag = ? AND howMuch = ? AND memo = ?", [spendDate, tag, howMuch, memo]);
        
        console.log('delete success.');
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
})
.put("/update", async(req, res, next) => { //자료 수정 요청이 있을 때 업데이트 해줌
    let conn; //db 연결 관련 변수
    const {spendDate, tag, howMuch, memo, o_Tag, o_howMuch, o_memo} = req.body; //front에서 데이터 가져옴 by fetch

    console.log(req.body);

    if(memo === `undefined`){
        memo = null;
    } else if(o_memo === `undefined`){
        o_memo = null;
    }

    try{
        conn = await pool.getConnection();//db 연결

        await conn.query("UPDATE spendtbl SET tag = ?, howMuch = ?, memo = ? WHERE spendDate = ? AND tag = ?", [tag, howMuch, memo, spendDate, o_Tag, o_howMuch, o_memo]);

        console.log("update success");
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
});

module.exports = router;
