import { Request, Response } from "express"
import User, { IUser } from "../models/user.model"
import { asyncHandler } from "../utils/asyncHandler"
import { ApiError } from "../utils/ApiError"
import { generateToken } from "../utils/token"

//Register
export const register = asyncHandler(async (req: Request, res: Response) => {
    const { name, email, password } = req.body as {
        name: string
        email: string
        password: string
    }

    if (!name || !email || !password) {
        throw new ApiError(400, "All fields are required")
    }
    const existingUser = await User.findOne({ email })
    if (existingUser) {
        throw new ApiError(409, "User already exists with this email")
    }
    const user = await User.create({ name, email, password })
    const token = generateToken(user._id.toString())

    res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token,
        },
    })
})

// Login
export const login = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body as {
        email: string
        password: string
    }

    if (!email || !password) {
        throw new ApiError(400, "Email and password are required")
    }

    const user = await User.findOne({ email }).select("+password")
    if (!user) {
        throw new ApiError(401, "Invalid email or password")
    }

    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
        throw new ApiError(401, "Invalid email or password")
    }

    const token = generateToken(user._id.toString())

    res.json({
        success: true,
        message: "Login successful",
        data: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token,
        },
    })
})