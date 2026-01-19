import express from "express"
import { createCategory, fetchCategory, fetchCategoryById, updateCategory } from "../controllers/category.controller"
import { protect } from "../middlewares/auth.middleware"
import { authorizeRoles } from "../middlewares/role.middleware"

const router = express.Router()

router.post("/", protect, authorizeRoles("ADMIN"), createCategory)
router.get("/", protect, fetchCategory)
router.get("/:id", protect, fetchCategoryById)
router.put("/:id", protect, updateCategory)

export default router
