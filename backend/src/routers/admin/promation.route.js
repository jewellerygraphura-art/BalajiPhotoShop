import {Router} from "express";
import isAuth from "../../middlewares/requiredLogin.middleware.js";
import {promation} from "../../controllers/admin/promation.controllers.js";

const router = Router();

router.route("/promation").post(isAuth, promation);

export default router
