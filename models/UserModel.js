import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
    },
    email: {
        type: String,
        required: [true, " Email is required"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        unique: true
    },
    refresh_token: {
        type: String,
        default: ""
    },
    isVerified: {
        type: Boolean,
        default: false
    },

    last_login_date: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ["Active", "Inactive", "Suspended"],
        default: "Active"
    },
    address_details: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Address"
        }
    ],
    shopping_cart: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Cart Product"
        }
    ],
    orderHistory: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Orders"
        }
    ],
    forgot_password_otp: {
        type: String,
        default: null
    },
    forgot_password_expiry: {
        type: Date,
        default: ""
    },
    role: {
        type: String,
        enum: ["User", "Admin"],
        default: "User"
    }


}, {
    timestamps: true
})

const User = mongoose.model("User", userSchema)

export default User
