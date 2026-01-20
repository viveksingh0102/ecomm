import cors from "cors"
import express from "express"
import morgan from "morgan"
import { errorHandler } from "./middlewares/error.middleware"
import authRoutes from "./routes/auth.routes"
import categoryRoutes from "./routes/category.routes"
import productRoutes from "./routes/product.routes"

const app = express()

app.use(cors())
app.use(express.json())
app.use(morgan("dev"))

app.use("/api/auth", authRoutes)
app.use("/api/category", categoryRoutes)
app.use("/api/product", productRoutes)

app.use(errorHandler)

export default app
