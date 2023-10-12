import { parse } from "dotenv";
import db from "../config/db";

export const getCourseList = async (req,res) => {
    //로그인했는지 여부를 판단한다. 그래서 유저 id를 가져온다. 로그인 안했으면 null
    const userId = req.user ? req.user.user_id : null;

    //데이터베이스에서 코스 정보와 방문여부를 가져온다
    const QUERY =`
        SELECT c.*, uc.users_course_id FROM course c
        LEFT JOIN users_course uc
        ON c.course_id = uc.course_id
        AND uc.user_id = ?
    `
    //데이터베이스 보내는 것
    const courseList = await db.execute(QUERY, [userId]).then((result)=>result[0])
    res.json(courseList);

    // console.log(courseList)
}
// controller => service(중요한 처리들) => repository

export const qrCheck = async (req,res) => {
    //TODO 임의로 유저 데이터 만듦(테스트용)
    const userId = req.user.user_id;

    const qrInfoData = req.body;
    console.log(qrInfoData.qrCode)
    //검증코드 1 : 들어온 qr코드에 해당하는 코스가 있는지 여부
    const QUERY1 = `
        SELECT * FROM course WHERE course_qr = ?
     `
    const course = await db.execute(QUERY1, [req.body.qrCode]).then((result)=>result[0][0]);
    if(!course) return res.status(400).json({status:"올바른 qr 코드가 아닙니다."})

    //검증코드 2 : 해당유저가 이 코스에 방문한 적이 있는지
    const QUERY2 = `
        SELECT * FROM users_course WHERE user_id = ? AND course_id = ?
     `
    const userVisited = await db.execute(QUERY2, [userId, course.course_id]).then((result)=>result[0][0]);

    if(userVisited) return res.status(400).json({status:"이미 방문한 장소입니다."});

    console.log("성공");

    //검증코드 3(수학): 반경 100내에 있을때만 qr코드 찍을 수 있음(선택사항)
    calculateDistance(qrInfoData.latitude, qrInfoData.longitude, course.latitude, course.longitude)
    if (dist > 100) return response.status(400).json({ status: "거리가 너무 멉니다." });

    // 방문완료 - 데이터베이스에 추가
  const QUERY3 = `INSERT INTO users_course (user_id, course_id) VALUES (?,?)`
  await db.execute(QUERY3, [userId, course.course_id]);
  return response.status(201).json({ status: "success" });

}

const calculateDistance = (currentLat, currentLon, targetLat, targetLon) => {
    currentLat = parseFloat(currentLat); //문자열을 실수(숫자)로 바꿔줘서 계산할 수 있게 해주는 것
    currentLon = parseFloat(currentLon);
    targetLat = parseFloat(targetLat);
    targetLon = parseFloat(targetLon);

    const dLat = (targetLat - currentLat) * 111000 //지도에서 계산하려면 평면이 아니기 때문에 실제 거리로 변환하기 위해서 111km를 곱해줘야 한대
    const dLon = (targetLon - currentLon) * 111000 * Math.cos(currentLat * (Math.PI / 180))

    return Math.sqrt(dLat * dLat + dLon * dLon);
}