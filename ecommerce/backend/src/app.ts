import express from "express"
import cors from "cors"
import morgan from "morgan"
import authRoutes from "./routes/auth.routes"
import categoryRoutes from "./routes/category.routes"
import { errorHandler } from "./middlewares/error.middleware"

const app = express()

app.use(cors())
app.use(express.json())
app.use(morgan("dev"))

app.use("/api/auth", authRoutes)
app.use("/api/category", categoryRoutes)

app.use(errorHandler)

export default app
