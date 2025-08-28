import mongoose from "mongoose";

const subcategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"]
    },
    image: {
        type: Array,
        default: ""
    },
    category: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category"  
        }
    ]
}, {
    timestamps: true
});

const Subcategory = mongoose.model("Subcategory", subcategorySchema);
export default Subcategory;
