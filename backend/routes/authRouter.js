import express from 'express';
import Router from 'express';
import {register, login, logout, sendVerifyOtp, verifyEmail} from '../controller/authController.js';
import userAuth from '../middleware/userAuth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/otp', userAuth, sendVerifyOtp);
router.post('/verify-account', userAuth, verifyEmail);

export default router;