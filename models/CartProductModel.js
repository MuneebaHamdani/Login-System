import mongoose from "mongoose";

const cartProductSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
    },
    quantity: {
        type: Number,
        default: 1,
    },
    price: {
        type: Number,
        default: 0,
    },
    totalAmount: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true,
});

const CartProduct = mongoose.model("CartProduct", cartProductSchema);
export default CartProduct;
