import {Router} from "express";
import {sendContactMail, sendConsultationMail} from "../../controllers/customer/inquiryMail.controllers.js"


const router = Router();

router.route("/").post(sendContactMail);
router.route("/consultation").post(sendConsultationMail)

export default router