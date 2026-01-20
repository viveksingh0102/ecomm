import { Request, Response } from "express";
import mongoose from "mongoose";
import Category from "../models/category.model";
import Product from "../models/product.model";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";

export const createProduct = asyncHandler(async (req: Request, res: Response) => {
    const { name, description, price, stock, category } = req.body || {}
    if (!name || !description || price === undefined || price === null || !category) {
        throw new ApiError(400, "All required fields (name, description, price, category) must be provided")
    }
    if (!mongoose.Types.ObjectId.isValid(category)) {
        throw new ApiError(400, "Invalid category id format")
    }
    const categoryExists = await Category.findById(category)
    if (!categoryExists) {
        throw new ApiError(404, "Category not found")
    }
    const existingProduct = await Product.findOne({
        name: { $regex: `^${name}$`, $options: "i" },
    })
    if (existingProduct) {
        throw new ApiError(409, "Product already exists")
    }
    const product = await Product.create({
        name,
        description,
        price,
        stock,
        category,
    })
    res.status(201).json({
        success: true,
        message: "Product created successfully",
        data: {
            id: product._id,
            name: product.name,
            slug: product.slug,
            price: product.price,
            stock: product.stock,
            category: product.category,
            isActive: product.isActive,
        },
    })
})

export const getProduct = asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 10
    const skip = (page - 1) * limit
    const filter = { isActive: true }
    const totalProducts = await Product.countDocuments(filter)
    const products = await Product.find(filter).populate("category", "name slug").skip(skip).limit(limit).sort({ createdAt: -1 })
    const totalPages = Math.ceil(totalProducts / limit)
    res.status(200).json({
        success: true,
        page,
        limit,
        totalProducts,
        totalPages,
        count: products.length,
        data: {
            products,
        },
    })
})

export const deleteProduct = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params
    if (!id) {
        throw new ApiError(409, "Product not found by given Id")
    }
    const prdct = await Product.findByIdAndDelete(id)
    res.status(200).json({
        success: true,
        data: prdct,
        message: "Product deleted successfully"
    })
})

export const getProductByPrdctId = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) {
        throw new ApiError(409, "Product not found by given Id")
    }
    const prdct = await Product.findById(id).populate("category", "name slug")
    if (!prdct) {
        throw new ApiError(404, "Product not found")
    }
    res.status(200).json({
        success: true,
        data: prdct,
    })
})


export const getProductByCategoryId = asyncHandler(async (req: Request, res: Response) => {
    const { id }: any = req.params
    if (!id) {
        throw new ApiError(400, "Category id is required")
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid category id format")
    }
    const products = await Product.find({ category: id, isActive: true, }).populate("category", "name slug")
    res.status(200).json({
        success: true,
        count: products.length,
        data: {
            products,
        },
    })
})

