import { Router } from "express";
import { 
    loginController, 
    userInfo, 
    verifyEmail,
    resendVerification,
    logoutController, 
    uploadAvatar,
    forgotPasswordController, 
    verifyforgotPasswordOtp, 
    resetPassword
} from "../controllers/userController.js"; 

import auth from "../middleware/auth.js";
import upload from "../middleware/multer.js";

const userRoute = Router()

// Frontend render routes
userRoute.get("/register", (req, res) => res.render("register"))
userRoute.get("/login", (req, res) => res.render("login"))
userRoute.get("/forgot-password", (req, res) => res.render("forgot-password"))
userRoute.get("/verify-email", verifyEmail);
userRoute.get("/verify-otp", (req, res) => res.render("verify-otp"))
userRoute.get("/reset-password", (req, res) => res.render("reset-password"))
userRoute.get("/verify-instruction", (req, res) => {
  const email = req.session.email || "";  
  res.render("verify-instruction", { message: req.session.message, email });
  req.session.message = null; 
});


// API routes
userRoute.post('/register', userInfo)
userRoute.post('/verify_email', verifyEmail)
userRoute.post("/resend-verification", resendVerification);
userRoute.post('/login', loginController)
userRoute.get('/logout' , auth , logoutController)
userRoute.put('/upload-avatar' , auth , upload.single('avatar') , uploadAvatar) 
userRoute.post("/forgot-password" , forgotPasswordController)
userRoute.post("/verify-forgot-password-otp" , verifyforgotPasswordOtp)
userRoute.post("/reset-password" , resetPassword)

export default userRoute
