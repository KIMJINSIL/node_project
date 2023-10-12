// apiRouter.js
import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import { getCourseList, qrCheck } from "../controller/courseController";
import { authMe, join, login } from "../controller/userController";
import { handleKakaoLogin, isAuth } from "../middleware/auth";
import {Strategy as KakaoStrategy} from "passport-kakao";

const apiRouter = express.Router();

//코스
apiRouter.get("/courses", isAuth, getCourseList)
apiRouter.post("/courses", isAuth, qrCheck)

//회원가입
apiRouter.post("/join", join)
apiRouter.post("/login", login)

//카카오 로그인
const clientID = process.env.CLIENT_ID;
const callback = "/api/kakao/callback";

passport.use(new KakaoStrategy({clientID : clientID, callbackURL : callback}, handleKakaoLogin));

apiRouter.get("/kakao", passport.authenticate("kakao", {session : false}));
apiRouter.get("/kakao/callback", (req, res)=>{
    passport.authenticate("kakao", {session : false},  async(err, user, info)=>{
        //info로  들어오면
        if(info){
            console.error(info);
            return res.redirect("/login?error="+info);
        }else if(!user){
            return res.redirect("/login?error=sns_login_fail")
        }else{
            const accessToken = jwt.sign({id: user.user_id}, process.env.SECRET_KEY, {expiresIn: "30d"}) //3개의 값을 넣는다 : (1)넣을 값, (2)시크릿값, (3)만료일
            return res.redirect("/login/callback?accessToken="+accessToken);
        }
    })(req, res);
})

apiRouter.post('/token/check', isAuth, authMe )




export default apiRouter;
