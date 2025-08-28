import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    orderId: {
        type: String,
        required: [true, "Order id is required"],
        unique: true
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    },
    productDetails: {
        _id: {
            type: String
        },
        name: {
            type: String
        },
        image: {
            type: Array
        }
    },
    paymentId : {
        type : String,
        required : [true , "Payment id is required"],
    },
    deliveryAddress : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Address"
    },
    subTotalAmount : {
        type : Number,
        default : 0
    },
    totalAmount  : {
        type : Number,
        default: 0
    },
    invoice : {
        type : String,
        default : ""
    }
},{
    timestamps : true
});

const Order = mongoose.model("Order", orderSchema);
export default Order;
