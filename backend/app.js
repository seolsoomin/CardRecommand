const express = require('express');
const pool = require("./maria.js");

const app = express(); //express 인스턴스 생성
const port = 3000; //포트 번호 설정

app.use(express.static(__dirname + '/public'));


app.use(express.json()); //json 사용한다고 선언
app.use(express.urlencoded({extended : true})); //쓸지는 모르겠는데 혹시 모르니까...

app.get("/", (req, res) => {
    res.status(200);
    res.sendFile(__dirname + "/html/index.html");
})

app.use("/", require("./routes/contactRoutes.js"));

//서버 응답 들어오는게 기다리기?
app.listen(port, () => {
    console.log(`${port}번 포트에서 서버 실행 중`);
});

const errorhandler = require("./middlewares/errorhandler.js");
app.use(errorhandler);

