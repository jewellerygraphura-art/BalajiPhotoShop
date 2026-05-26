import {Router} from "express";
import multer from "multer";
import otp from "../../controllers/common/otp.controllers.js";
import {Signup, Login, ForgotPassword, changePassword, Signout, UpdateProfile, myProfile, getAllUsers, getAllCustomers, getCustomerDetails, deleteCustomer, deleteUser} from "../../controllers/admin/auth.controllers.js";
import duplicateEmail from "../../middlewares/duplicationEmail.middlware.js";
import {adminEmail} from "../../middlewares/emailPresent.middlware.js";
import isAuth from "../../middlewares/requiredLogin.middleware.js";

let router = Router();

let storage = multer.memoryStorage();
let upload = multer({storage});

router.route("/signupOtp").post(duplicateEmail, otp);
router.route("/signup").post(Signup);
router.route("/login").post(adminEmail, Login);
router.route("/forgetPasswordOtp").post(adminEmail, otp);
router.route("/forgetPassword").put(ForgotPassword);
router.route("/changepassword").put(isAuth, changePassword)
router.route("/signout").post(Signout);
router.route("/profile").put(isAuth, upload.single("profileImage"), UpdateProfile)
router.route('/myprofile').get(isAuth, myProfile);

router.route("/getemployee").get(isAuth, getAllUsers);
router.route("/customers").get(isAuth, getAllCustomers);
router.route("/customers/:customerId").get(isAuth, getCustomerDetails);
router.route("/customers/:customerId").delete(isAuth, deleteCustomer);
router.route("/deleteemployee").delete(isAuth, deleteUser)

export default router;
