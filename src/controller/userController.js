import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../config/db";

export const join = async (req,res) => {
    const joinData = req.body;

    //id 중복여부 체크
    const QUERY1 = `
        SELECT * FROM  users WHERE user_email = ?
    `;
    const user = await db.execute(QUERY1, [joinData.userId]).then((result)=>result[0][0]);

    if(user){
        return res.status(400).json({status : "아이디 중복"})
    };

    //비밀번호 암호화
    //8번이 최소, 12번 좀 많은데?
    //높읈수록 암호화 높음, 시간이 많이 듦
    const hashPassword = await bcrypt.hash(joinData.userPassword, 8);
    console.log(hashPassword)

    //회원가입
    const QUERY2 = `
        INSERT INTO users
            (user_email, user_password, user_name, user_provider)
        VALUES
            (?,?,?,?)
    `;
    db.execute(QUERY2, [joinData.userId, hashPassword, joinData.userName, "로컬"])
    
    res.status(201).json({status : "success"});
}

export const login = async (req, res) => {
    const loginData = req.body; //userId, userPassword값이 들어온다
    
    //1. 들어온 이메일에 해당하는 유저가 있는지 확인
    const QUERY1 = `
        SELECT * FROM users WHERE user_email = ?
    `;
    const user = await db.execute(QUERY1, [loginData.userId]).then((result)=> result[0][0]);

    if(!user){
        return res.status(400).json({statue : "아이디, 비밀번호 확인"});
    }

    //2. 비밀번호 확인 - DB비밀번호(bcrypt로 암호화된 값)랑 프론트에서 보낸 비밀번호를 비교
    const isPoasswordRight = await bcrypt.compare(loginData.userPassword, user.user_password); //결과값이 true, false로만 나온다
    
    if(!isPoasswordRight){ //비밀번호가 틀리면?
        return res.status(400).json({statue : "아이디, 비밀번호 확인"});
    }

    //3. json web token을 만들어야함 ->  로그인 유지
    const accessToken = jwt.sign({id: user.user_id}, process.env.SECRET_KEY, {expiresIn: "30d"}) //3개의 값을 넣는다 : (1)넣을 값, (2)시크릿값, (3)만료일
    return res.status(200).json({accessToken : accessToken});
}

export const authMe = async (req, res)=>{
    const user = req.user;
    return res.status(200).json(user);
}