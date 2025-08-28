import sendEmail from '../config/sendEmail.js';
import userModel from '../models/UserModel.js';
import bcryptjs from 'bcryptjs';
import verifyemailtemplate from '../utils/verifyEmailTemplate.js';
import generatedAccessToken from '../utils/generatedAccessToken.js';
import generatedRefreshToken from '../utils/generatedRefreshToken.js';
import uploadimageCloudinary from '../utils/uploadimageCloudinary.js';
import generateOTP from '../utils/generateOTP.js';
import forgotPasswordTemplate from '../utils/forgotPasswordTemplate.js';
import jwt from 'jsonwebtoken'

// ================== REGISTER ==================
export const userInfo = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            req.session.message = { type: "danger", text: "Provide name, email and password" };
            return res.redirect("/register");
        }

        //  Duplicate check
        const exist = await userModel.findOne({ email });
        if (exist) {
            req.session.message = { type: "danger", text: "Email already exists" };
            return res.redirect("/register");
        }

        //  Hash password
        const salt = await bcryptjs.genSalt(10);
        const hashPassword = await bcryptjs.hash(password, salt);

        //  Create user (initially not verified)
        const newUser = new userModel({
            name,
            email,
            password: hashPassword,
            isVerified: false
        });
        const save = await newUser.save();

        //  Verification link
        const verifyemailUrl = `${process.env.BACKEND_URL}/verify-email?code=${save._id}`;


        //  Send email
        await sendEmail({
            sendTo: email,
            subject: "Email Verification",
           html: verifyemailtemplate(name, verifyemailUrl)


        });

        //  Show instruction page
        req.session.message = { type: "success", text: "Registration successful! Please verify your email." };
        req.session.email = email;   
        return res.redirect("/verify-instruction");


    } catch (error) {
        req.session.message = { type: "danger", text: error.message };
        return res.redirect("/register");
    }
};

// ================== VERIFY EMAIL ==================
// userController.js
export const verifyEmail = async (req, res) => {
  try {
    const code = req.query.code; // URL se code uthao
    if (!code) {
      req.session.message = { type: "danger", text: "Invalid verification link!" };
      return res.redirect("/login");
    }

    const user = await userModel.findById(code); 
    if (!user) {
      req.session.message = { type: "danger", text: "User not found!" };
      return res.redirect("/login");
    }

    if (user.isVerified) {
      req.session.message = { type: "info", text: "Email already verified. Please login." };
      return res.redirect("/login");
    }

    //  Verify user
    user.isVerified = true;
    await user.save();

    req.session.message = { type: "success", text: "Email verified successfully! Please login." };
    return res.redirect("/login");

  } catch (error) {
    req.session.message = { type: "danger", text: error.message };
    return res.redirect("/login");
  }
};

// resend verification email
export const resendVerification = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await userModel.findOne({ email });
        if (!user) {
            req.session.message = { type: "danger", text: "User not found" };
            return res.redirect("/login");
        }

        if (user.isVerified) {
            req.session.message = { type: "info", text: "Email already verified. Please login." };
            return res.redirect("/login");
        }

        const verifyemailUrl = `${process.env.BACKEND_URL}/verify-email?code=${user._id}`;

        await sendEmail({
            sendTo: email,
            subject: "Resend Email Verification",
            html: verifyemailtemplate(user.name, verifyemailUrl)
        });

        req.session.message = { type: "success", text: "Verification email resent!" };
        return res.redirect("/verify-instruction");

    } catch (error) {
        req.session.message = { type: "danger", text: error.message };
        return res.redirect("/login");
    }
};

// ================== LOGIN ==================
export async function loginController(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            req.session.message = { type: "danger", text: "Enter email and password" };
            return res.redirect("/login");
        }

        const user = await userModel.findOne({ email });
        if (!user) {
            req.session.message = { type: "danger", text: "User not found" };
            return res.redirect("/login");
        }

        //  verify check
        if (!user.isVerified) {
            req.session.message = { type: "danger", text: "Please verify your email before login." };
            return res.redirect("/login");
        }

        //  active status check
        if (user.status !== "Active") {
            req.session.message = { type: "danger", text: "Account inactive. Contact Admin." };
            return res.redirect("/login");
        }

        const checkPassword = await bcryptjs.compare(password, user.password);
        if (!checkPassword) {
            req.session.message = { type: "danger", text: "Wrong password" };
            return res.redirect("/login");
        }

        const accessToken = await generatedAccessToken(user._id);
        const refreshToken = await generatedRefreshToken(user._id);

        res.cookie("accessToken", accessToken, { httpOnly: true, secure: true, sameSite: "None" });
        res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: true, sameSite: "None" });

        req.session.message = { type: "success", text: "Login successful!" };
        return res.redirect("/dashboard");

    } catch (error) {
        req.session.message = { type: "danger", text: error.message };
        return res.redirect("/login");
    }
}

// ================== LOGOUT ==================
export async function logoutController(req, res) {
    try {
        const userid = req.userId;
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");

        await userModel.findByIdAndUpdate(userid, { refresh_token: "" });

        req.session.message = { type: "success", text: "Logged out successfully!" };
        return res.redirect("/login");

    } catch (error) {
        req.session.message = { type: "danger", text: error.message };
        return res.redirect("/logout");
    }
}

// ================== UPLOAD AVATAR (API only) ==================
export async function uploadAvatar(req, res) {
    try {
        const image = req.file;
        const upload = await uploadimageCloudinary(image);

        return res.json({ message: "Image Uploaded" });
    } catch (error) {
        return res.status(500).json({ message: error.message, error: true });
    }
}

// ================== FORGOT PASSWORD ==================
export async function forgotPasswordController(req, res) {
    try {
        const { email } = req.body;
        const user = await userModel.findOne({ email });

        if (!user) {
            req.session.message = { type: "danger", text: "Invalid Email" };
            return res.redirect("/forgot-password");
        }

        const otp = generateOTP();
        const expiretime = Date.now() + 60 * 60 * 1000;

        await userModel.findByIdAndUpdate(user._id, {
            forgot_password_otp: otp,
            forgot_password_expiry: new Date(expiretime)
        });

        await sendEmail({
            sendTo: email,
            subject: "Recover Password",
            html: forgotPasswordTemplate({ name: user.name, otp })
        });

        req.session.message = { type: "success", text: "OTP sent to your email" };
        return res.redirect("/verify-otp");

    } catch (error) {
        req.session.message = { type: "danger", text: error.message };
        return res.redirect("/forgot-password");
    }
}

// ================== VERIFY OTP ==================
export async function verifyforgotPasswordOtp(req, res) {
    try {
        const { email, otp } = req.body;
        const user = await userModel.findOne({ email });

        if (!user) {
            req.session.message = { type: "danger", text: "Invalid Email" };
            return res.redirect("/verify-otp");
        }
        if (!user.forgot_password_otp) {
            req.session.message = { type: "danger", text: "No OTP found, request again" };
            return res.redirect("/verify-otp");
        }
        if (user.forgot_password_expiry < new Date()) {
            req.session.message = { type: "danger", text: "OTP expired" };
            return res.redirect("/verify-otp");
        }
        if (otp !== user.forgot_password_otp) {
            req.session.message = { type: "danger", text: "Invalid OTP" };
            return res.redirect("/verify-otp");
        }

        user.forgot_password_otp = null;
        user.forgot_password_expiry = null;
        await user.save();

        req.session.message = { type: "success", text: "OTP verified, reset password now." };
        return res.redirect("/reset-password");

    } catch (error) {
        req.session.message = { type: "danger", text: "Invalid OTP" };
        return res.redirect("/verify-otp");
    }
}

// ================== RESET PASSWORD ==================
export async function resetPassword(req, res) {
    try {
        const { email, newPassword, confirmPassword } = req.body;

        if (!email || !newPassword || !confirmPassword) {
            req.session.message = { type: "danger", text: "Provide all fields" };
            return res.redirect("/reset-password");
        }

        const user = await userModel.findOne({ email });
        if (!user) {
            req.session.message = { type: "danger", text: "Invalid Email" };
            return res.redirect("/reset-password");
        }
        if (newPassword !== confirmPassword) {
            req.session.message = { type: "danger", text: "Passwords do not match" };
            return res.redirect("/reset-password");
        }

        const salt = await bcryptjs.genSalt(10);
        const hashPassword = await bcryptjs.hash(newPassword, salt);

        await userModel.findByIdAndUpdate(user._id, { password: hashPassword });

        req.session.message = { type: "success", text: "Password updated successfully, please login." };
        return res.redirect("/login");

    } catch (error) {
        req.session.message = { type: "danger", text: error.message };
        return res.redirect("/reset-password");
    }
}
