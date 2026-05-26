import { Router } from "express";
import isAuth from "../../middlewares/requiredLogin.middleware.js";
import {
    getPendingB2BUsers,
    getApprovedB2BUsers,
    approveB2BUser,
    rejectB2BUser
} from "../../controllers/admin/b2bAdmin.controller.js";

const router = Router();

router.route("/pending").get(isAuth, getPendingB2BUsers);
router.route("/approved").get(isAuth, getApprovedB2BUsers);
router.route("/:userId/approve").put(isAuth, approveB2BUser);
router.route("/:userId/reject").put(isAuth, rejectB2BUser);

export default router;
