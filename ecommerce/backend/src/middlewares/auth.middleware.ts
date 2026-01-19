import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import User from "../models/user.model"
import { ApiError } from "../utils/ApiError"
import { asyncHandler } from "../utils/asyncHandler"

interface JwtPayload {
  id: string
}

export const protect = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new ApiError(401, "Not authorized, token missing")
  }

  const token = authHeader.split(" ")[1]

  const decoded = jwt.verify(
    token,
    process.env.JWT_SECRET as string
  ) as JwtPayload

  const user = await User.findById(decoded.id)

  if (!user) {
    throw new ApiError(401, "User no longer exists")
  }

  req.user = user
  next()
})
