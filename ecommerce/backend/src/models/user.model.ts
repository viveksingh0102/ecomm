import mongoose, { Document, Model, Schema } from "mongoose"
import bcrypt from "bcryptjs"

export interface IUser extends Document {
    name: string
    email: string
    password: string
    role: "USER" | "ADMIN"
    isActive: boolean
    comparePassword(password: string): Promise<boolean>
}

const userSchema = new Schema<IUser>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            index: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
            select: false,
        },
        role: {
            type: String,
            enum: ["USER", "ADMIN"],
            default: "USER",
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
)

userSchema.pre<IUser>("save", async function (next) {
    if (!this.isModified("password")) return next()
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.comparePassword = function (password: string) {
    return bcrypt.compare(password, this.password)
}

const User: Model<IUser> = mongoose.model<IUser>("User", userSchema)
export default User
