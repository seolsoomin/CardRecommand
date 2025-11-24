const express = require('express'); //express 프레임 워크 사용 선언
const pool = require("./maria.js"); //db 연결 pool 가져옴
const path = require('path'); // Node.js 'path' 모듈 추가

const app = express(); //express 인스턴스 생성
const port = 3000; //포트 번호 설정

app.use(express.static(path.join(__dirname, '../'))); 


app.use(express.json()); //json 사용한다고 선언
app.use(express.urlencoded({extended : true})); //쓸지는 모르겠는데 혹시 모르니까...

app.get("/", (req, res) => {
    res.status(200);
    res.sendFile(path.join(__dirname, "index.html")); 
});

app.get("/login", (req, res) => {
    res.status(200);
    res.sendFile(path.join(__dirname, "login.html")); 
});

app.get("/index", (req, res) => {
    res.status(200);
    res.sendFile(path.join(__dirname, "index.html")); 
});

app.get("/admin", (req,res) =>{
    res.status(200);
    res.sendFile(path.join(__dirname, "adminpage.html"));
})

app.use("/", require("./contactRoutes.js")); //router 사용 선언

//서버 응답 들어오는게 기다리기?
app.listen(port, () => {
    console.log(`${port}번 포트에서 서버 실행 중`);
});

//const errorhandler = require("./errorhandler.js"); //middleware 가져오는 설정, 오류 처리해줌.
//app.use(errorhandler);  //errorhandler 사용 선언
