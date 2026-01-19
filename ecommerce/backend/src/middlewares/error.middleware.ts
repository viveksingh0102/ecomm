import { Request, Response, NextFunction } from "express"


export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {

  // 🔥 Handle Mongo duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0]
    const value = err.keyValue[field]

    return res.status(409).json({
      success: false,
      message: `${field} "${value}" already exists`,
    })
  }

  const statusCode = err.statusCode || 500
  const message = err.message || "Internal Server Error"

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  })
}
