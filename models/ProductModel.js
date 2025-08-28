import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Product name is required"]
    },
    image: {
        type: Array,
        default: []
    },
    category: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "category"
        }
    ],
    subcategory: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "subcategory"
        }
    ],
    unit : {
        type : String,
        required : [true , "Unit is required"]
    },
    stock : {
        type : Number,
        default : null
    },
    price : {
        type : Number,
        default : null
    },
    description : {
        type : String,
        default : ""
    },
    publish : {
        type : Boolean,
        default : true
    }
},{
    timestamps : true
});

const Product = mongoose.model("Product" , productSchema)
export default Product