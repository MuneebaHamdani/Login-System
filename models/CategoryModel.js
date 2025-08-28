import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    name : {
        type : String,
        required : "Name is required"
    },
    image : {
        type : String,
        default : ""
    }
},{
    timestamps : true
})

const Category = mongoose.model("Category" , categorySchema)

export default Category