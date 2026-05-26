import express from "express";
import { searchProducts, searchSuggestions} from "../../controllers/common/search.controller.js";

const router = express.Router();

router.get("/search", searchProducts);
router.get("/suggestion", searchSuggestions);

export default router;
