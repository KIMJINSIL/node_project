// apiRouter.js
import express from "express";
import { getCourseList, qrCheck } from "../controller/courseController";

const apiRouter = express.Router();

apiRouter.get("/courses", getCourseList)
apiRouter.post("/courses", qrCheck)

export default apiRouter;
