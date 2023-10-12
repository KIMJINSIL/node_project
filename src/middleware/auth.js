import jwt from 'jsonwebtoken';
import db from '../config/db';

export const isAuth = async (req, res, next) => {
    //헤더의 key값으로 Authorization의 value를 가져온다
    //{Authorization : "Bearer accessToken값"}
    const authHeader = req.get("Authorization");
    if(!authHeader || !authHeader.startsWith('Bearer ')) {
        //인증이 필요한데 인증안함(401)
        return res.status(401).json({status:"인증 실패"});
    }
    //정상적으로 응답이 온 경우
    const token = authHeader.split(" ")[1]

    //jwt 토큰 풀기
    jwt.verify(
        token,
        process.env.SECRET_KEY,
        async (error, decoded) => {
            if(error){
                return res.status(401).json({status:"인증 실패"}); 
            }
            const id = decoded.id;

            const QUERY = `
                SELECT * FROM users WHERE user_id = ?
            `
            const user = await db.execute(QUERY, [id]).then((result)=>result[0][0])
            if(!user){
                return res.status(401).json({status:"인증 실패"}); 
            }
            req.user = user;
            next();
        }
    )
}

export const handleKakaoLogin = async (accessToken, refreshToken, profile, done) => {

    const provider = profile.provider;
    const id = profile.id;
    const username = profile.username;
    const profileImage = profile._json.properties.profile_image;

    //첫 접속인지 확인
    const QUERY1  = `
        SELECT * FROM users WHERE user_email = ? AND user_provider = ?
    `
    let user = await db.execute(QUERY1, [id, provider]).then((result) => result[0][0]);

    //첫 접속이면 회원가입
    if(!user){
        const QUERY2 = `
            INSERT INTO users
                (user_email, user_name, user_image, user_provider)
            VALUES
                (?, ?, ?, ?)
        `
        const data = await db.execute(QUERY2, [id, username, profileImage, provider]).then((result)=>result[0]);
        user = {user_id : data.insertId};
    }
    //로그인 완료
    return done(null, user);
}