import {Router} from "express";
import multer from "multer";
import {addShowroom,getShowrooms, softDeleteShowroom, hardDeleteShowroom} from "../../controllers/admin/store.controllers.js";
import isAuth from "../../middlewares/requiredLogin.middleware.js";

const router = Router();

const storage = multer.memoryStorage();
const upload = multer({storage});

router.route("/").get(isAuth, getShowrooms);
router.route("/add").post(isAuth, upload.array("storeImage", 5), addShowroom);
router.route("/softdelete").put(isAuth, softDeleteShowroom);
router.route("/harddelete").delete(isAuth, hardDeleteShowroom);

export default router