import express from 'express';
import Router from 'express';
import {register, login, logout, sendVerifyOtp, verifyEmail, isAuthenticated, sendResetOtp, resetPassword} from '../controller/authController.js';
import userAuth from '../middleware/userAuth.js';

const authRouter = express.Router();

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/logout', logout);
authRouter.post('/otp', userAuth, sendVerifyOtp);
authRouter.post('/verify-account', userAuth, verifyEmail);
authRouter.post('/authenticated', userAuth, isAuthenticated);
authRouter.post('/reset-otp', sendResetOtp);
authRouter.post('/reset-password', resetPassword);

export default authRouter;