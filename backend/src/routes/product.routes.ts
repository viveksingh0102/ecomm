import express from "express"
import { createProduct, deleteProduct, getProduct, getProductByCategoryId, getProductByPrdctId } from "../controllers/product.controller"
import { protect } from "../middlewares/auth.middleware"
import { authorizeRoles } from "../middlewares/role.middleware"

const router = express.Router()

router.post("/", protect, authorizeRoles("ADMIN"), createProduct)
router.get("/", protect, getProduct)
router.delete("/:id", protect, authorizeRoles("ADMIN"), deleteProduct)
router.get("/:id", protect, getProductByPrdctId)
router.get("/categoryId/:id", protect, getProductByCategoryId)

export default router;
