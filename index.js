import dotenv from 'dotenv'
dotenv.config();
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import connectDB from './config/connectionDB.js'
import userRoute from './route/userRoute.js';
import path from 'path'
import { fileURLToPath } from 'url'
import session from "express-session";


const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express();
const PORT = process.env.PORT || 5000

// Middlewares
app.use(cors({
    credentials: true,
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"]
}));


app.use(express.json())
app.use(express.urlencoded({ extended: true }))   // important for form data
app.use(cookieParser())

app.use(session({
  secret: process.env.SESSION_SECRET || "supersecretkey",
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));
// Flash message middleware
app.use((req, res, next) => {
  res.locals.message = req.session.message || null;
  if (req.session.message) {
    delete req.session.message; // ek hi baar show ho
  }
  next();
});

app.use(morgan('dev'))
app.use(helmet({
    crossOriginResourcePolicy: false
}))

// View Engine
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))

// Routes
app.get("/", (req, res) => res.render("register"))  // default go to register
app.use('/', userRoute)   // clean routes

// Start Server
connectDB().then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})
