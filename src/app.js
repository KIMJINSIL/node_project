import "dotenv/config";
import "regenerator-runtime"; //async await을 사용하기 위한 문법 - 노드 14버전 기준으로

import express from "express";
import viewRouter from "./router/viewRouter";
import apiRouter from "./router/apiRouter";


const app = express();


// app.get("/", (req, res)=>{
//     res.send("루트로 들어왔습니다!!");
// })  //app 주소로 get을 요청했을 때, 함수를 실행시킨다 
//     //응답에 함수에 담아준 내용을 보내주는 것

// app.get("/abc", (req,res)=>{
//     res.send("abc로 들어왔습니다")
// })


/* express야 나 ejs 쓸거야 */
app.set("view engine", "ejs");

/* ejs의 파일 위치는 여기야 */
app.set("views", process.cwd()+"/src/client/html")
// console.log(process.cwd());

app.use("/api", apiRouter);
app.use("/", viewRouter);

app.use("/css", express.static("src/client/css"));
app.use("/js", express.static("src/client/js"));
app.use("/file", express.static("src/client/file"));

// app.get("/", (req,res)=>{
//     const homeData = {
//         data: [{name:"철수"},{name:"영희"},{name:"민수"}],
//     }
//     res.render("home", homeData);
// });

// app.get("/introduce", (req,res)=>{
//     res.render("introduce")
// })

app.listen(8080,()=>{
    console.info("8080포트서버 열림 http://localhost:8080");
}) //서버를 8080포트로 여는데, 열고나면 뒤에거 실행시켜줘


