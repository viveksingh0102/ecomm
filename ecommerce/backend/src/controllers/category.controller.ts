import { Request, Response } from "express"
import mongoose from "mongoose"
import Category from "../models/category.model"
import { ApiError } from "../utils/ApiError"
import { asyncHandler } from "../utils/asyncHandler"

export const createCategory = asyncHandler(async (req: Request, res: Response) => {
    const { name, description } = req.body as {
        name: string
        description?: string
    }

    if (!name) {
        throw new ApiError(400, "Category name is required")
    }
    const existingCategory = await Category.findOne({
        name: { $regex: `^${name}$`, $options: "i" },
    })

    if (existingCategory) {
        throw new ApiError(409, "category already exists, Please enter another Category")
    }
    const category = await Category.create({ name, description, })

    res.status(201).json({
        success: true,
        message: "Category created successfully",
        data: {
            id: category._id,
            name: category.name,
            slug: category.slug,
            description: category.description,
            isActive: category.isActive,
        },
    })
})

export const updateCategory = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, description, isActive } = req.body as {
        name?: string;
        description?: string;
        isActive?: boolean;
    };

    if (!id) {
        throw new ApiError(400, "Category id is required");
    }
    if (Array.isArray(id) || !mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid category id format");
    }

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (isActive !== undefined) updateData.isActive = isActive;

    if (Object.keys(updateData).length === 0) {
        throw new ApiError(400, "No update data provided");
    }

    // Check for duplicate name if name is being updated
    if (name) {
        const existingCategory = await Category.findOne({
            name: { $regex: `^${name}$`, $options: "i" },
            _id: { $ne: id },
        });
        if (existingCategory) {
            throw new ApiError(409, "Category name already exists, please enter another name");
        }
    }

    const updatedCategory = await Category.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true }
    );

    if (!updatedCategory) {
        throw new ApiError(404, "Category not found");
    }

    res.status(200).json({
        success: true,
        message: "Category updated successfully",
        data: updatedCategory,
    });
})

export const fetchCategory = asyncHandler(async (req: Request, res: Response) => {
    const categories = await Category.find({ isActive: true }).sort({ name: 1 })
    res.status(200).json({
        success: true,
        count: categories.length,
        data: categories,
    })
})

export const fetchCategoryById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params
    if (!id) {
        throw new ApiError(400, "Category id is required")
    }
    if (Array.isArray(id) || !mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid category id format")
    }
    const category = await Category.findById(id)
    if (!category) {
        throw new ApiError(404, "Category not found")
    }
    res.status(200).json({
        success: true,
        data: category,
    })
})