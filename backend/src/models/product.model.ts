import mongoose, { Document, Model, Schema } from "mongoose"
import slugify from "slugify"

export interface IProduct extends Document {
  name: string
  slug: string
  description: string
  price: number
  stock: number
  category: mongoose.Types.ObjectId
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
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
      required: true,
      trim: true,
      maxlength: 1000,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
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


// 🔹 Auto-generate slug ONLY on create (immutable on update)
productSchema.pre<IProduct>("validate", function (next) {
  if (this.isNew && this.name) {
    this.slug = slugify(this.name, {
      lower: true,
      strict: true,
      trim: true,
    })
  }
  next()
})

const Product: Model<IProduct> = mongoose.model<IProduct>(
  "Product",
  productSchema
)

export default Product
