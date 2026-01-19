import mongoose, { Document, Model, Schema } from "mongoose"
import slugify from "slugify"

export interface ICategory extends Document {
  name: string
  slug: string
  description?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

const categorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      minlength: 2,
      maxlength: 50,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 200,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
)


// 🔹 Auto-generate slug before save
categorySchema.pre<ICategory>("validate", function (next) {
  if (this.name) {
    this.slug = slugify(this.name, {
      lower: true,
      strict: true,
      trim: true,
    })
  }
  next()
})

const Category: Model<ICategory> = mongoose.model<ICategory>(
  "Category",
  categorySchema
)

export default Category
