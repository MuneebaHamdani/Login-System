import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
    address_line: {
        type: String,
        required: [true, "Address is required"]
    },
    city: {
        type: String,
        required: [true, "City is required"]
    },
    state : {
        type : String,
        required : [true , "State is required"]
    },
    pincode : {
        type : String,
        required : [true , "Pincode is required"]
    },
    mobile : {
        type : Number,
        required : [true , "Mobile No. is required"]
    },
    status : {
        type : Boolean,
        default : true
    }
} , {
    timestamps : true
})

const Address = mongoose.model("Address", addressSchema)

export default Address