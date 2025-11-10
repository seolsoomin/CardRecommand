const express = require('express');
const router = express.Router();

const pool = require("../maria");

router
.post("/savespend", async(req, res, next) => {
    let conn;
    const {spendDate, tag, howMuch, memo} = req.body;

    try{
        conn = await pool.getConnection();

        if(!tag || !howMuch){
            const error = new Error("필수 값이 입력되지 않았습니다.");
            error.status = 400;
            next(error);
        }

        if(parseInt(howMuch) <= 0){
            const error = new Error("금액은 0 이하 일 수 없습니다.");
            error.status = 400;
            next(error);
        }
        
        await conn.query("INSERT INTO spendtbl (spendDate, tag, howMuch, memo ) VALUES (?, ?, ?, ?)", [spendDate, tag, howMuch, memo]);
        
        console.log("save success.");
        res.status(201).json({success : true, message : "저장 성공"});
    }
    catch (err){
        console.log(`오류 발생 : ${err}`);

        const error = new Error('저장에 실패하였습니다.');
        error.status = 500;
        next(error);
    }
    finally{
        if(conn)
            conn.release();
    }
});

module.exports = router;