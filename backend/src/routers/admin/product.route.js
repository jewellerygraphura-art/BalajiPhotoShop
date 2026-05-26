import {Router} from "express";
import multer from "multer";
import isAuth from "../../middlewares/requiredLogin.middleware.js";
import {uploadNewProduct, getAllItem, updatePrice, updateQuantity, hardDeleteProduct, softDeleteProduct, restoreProduct} from "../../controllers/admin/product.controllers.js";

const router = Router();

let storage = multer.memoryStorage();

let upload = multer({storage});

router.route("/addProduct").post(isAuth, upload.array("productImage", 5) ,uploadNewProduct);
router.route("/getall").get(isAuth, getAllItem);
router.route("/price").put(isAuth, updatePrice);
router.route("/quantity").put(isAuth,updateQuantity);
router.route("/harddelete").delete(isAuth, hardDeleteProduct);
router.route("/softdelete").put(isAuth,softDeleteProduct);
router.route("/restore").put(isAuth, restoreProduct);
// router.route("/image").put(isAuth, upload.array("productImage", 5), imageUpload)

export default router;