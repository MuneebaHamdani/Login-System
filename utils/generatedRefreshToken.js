import userModel from "../models/UserModel.js";
import jwt from "jsonwebtoken"; // ✅ correct import

const generatedRefreshToken = async (userId) => {
    const token = await jwt.sign(
        { id: userId },
        process.env.SECRET_KEY_REFRESH_TOKEN,
        { expiresIn: "7d" }
    );

    await userModel.updateOne(
        { _id: userId },
        { refresh_token: token }
    );

    return token;
};

export default generatedRefreshToken;
