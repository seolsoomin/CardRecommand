const express = require('express'); //express 프레임 워크 사용 선언
const pool = require("./maria.js"); //db 연결 pool 가져옴

const app = express(); //express 인스턴스 생성
const port = 3000; //포트 번호 설정

app.use(express.static(__dirname + '/public')); //middltwqre으로 ./public 사용. css와 js 들어있음. 


app.use(express.json()); //json 사용한다고 선언
app.use(express.urlencoded({extended : true})); //쓸지는 모르겠는데 혹시 모르니까...

app.get("/", (req, res) => { //루트 들어왔을 때 상태를 200으로 설정하고 html 파일 전송 후 디스플레이(?)
    res.status(200); //상태 설정
    res.sendFile(__dirname + "/html/index.html"); //html 파일 전송
})

app.use("/", require("./routes/contactRoutes.js")); //router 사용 선언

//서버 응답 들어오는게 기다리기?
app.listen(port, () => {
    console.log(`${port}번 포트에서 서버 실행 중`);
});

const errorhandler = require("./middlewares/errorhandler.js"); //middleware 가져오는 설정, 오류 처리해줌.
app.use(errorhandler);  //errorhandler 사용 선언

