import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import userModel from '../models/userModel.js';
import transporter from '../config/nodeMailer.js';

export const register = async(req, res) =>{   

    const {name, email, password} = req.body;

    if(!name || !email || !password){
        return res.json({
            success:false,
            message:"all fields necessary"
        })
    }

    try{

        const isExistingUser = await userModel.findOne({email});

        if(isExistingUser){
            return res.json({
                success:false,
                message:"email already registered"
            })
        }

        const hashedPass = await bcrypt.hash(password, 10);

        const newUser = new userModel({name, email, password:hashedPass});
        await newUser.save();

        const token = jwt.sign({id:newUser._id}, process.env.JWT,
            {expiresIn:'7d'}
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production'?'none': 'strict',
            maxAge: 7*24*60*60*1000
        });

        //sending otp mail

        const mailOptions = {
            from: process.env.SMTP_MAIL,
            to:email,
            subject:'Welcome user',
            text:`Your account has been created with ${email}`
        } 

        await transporter.sendMail(mailOptions);
 

        return res.json({
                success:true,
                message:"successfully registered"
            })

    }catch(err){
        return res.json({
            success:false,
            message:err.message
        })
    }

}


export const login = async(req, res) =>{   
    const {email, password} = req.body;

    if(!email || !password){
        return res.json({
            success:false,
            message:"all fields necessary"
        })
    }

    try{

        const user = await userModel.findOne({email});

        if(!user){
            return res.json({
                success:false,
                message:"unregistered user"
            })
        }

        const passMatch = await bcrypt.compare(password, user.password);

        if(!passMatch){
            return res.json({
                success:false,
                message:"wrong password"
            })

        }
        const token = jwt.sign({id:user._id}, process.env.JWT,
            {expiresIn:'7d'}
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production'?'none': 'strict',
            maxAge: 7*24*60*60*1000
        });

        return res.json({
                success:true,
                message:"logged in"
            })


    }catch(err){
        return res.json({
            success:false,
            message:err.message
        })
    }
}

export const logout = async(req, res) =>{
    try{
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production'?'none': 'strict',
            maxAge: 7*24*60*60*1000
        });

        return res.json({
            success: true,
            message:"logged out"
        })
    }catch(err){
        return res.json({
            success:false,
            message:err.message
        })
    }
}

export const sendVerifyOtp = async(req, res)=>{
    try{
        const {userId} = req.body;
        const user = await userModel.findById(userId);

        if(user.isVerified){
            return res.json({
                success:false,
                message:'account already verified'
            })
        }
        const otp = String(Math.floor(100000+Math.random()*900000));
        user.verifyOtp = otp;
        user.otpExpiry = Date.now() + 60*1000;

        await user.save();

        const mailOptions = {
            from: process.env.SMTP_MAIL,
            to:user.email,
            subject:'Verification OTP',
            text:`Your account otp is ${otp}. This otp will expire in 1 minute!`
        } 

        await transporter.sendMail(mailOptions);

        res.json({
            success:true,
            message:'verification otp sent on email'
        })

    }catch(err){
        return res.json({
            success:false,
            message:err.message
        })
    }
}

export const verifyEmail = async(req, res)=>{
    const {userId, otp} = req.body;
    
    if(!userId || !otp){
        return res.json({
            success:false,
            message:'all fields necessary'
        })
    }

    try{

        const user = await userModel.findById(userId);

        if(!user){
            return res.json({
                success:false,
                message:'user not found'
            })
        }

        if(user.verifyOtp === '' || user.verifyOtp!==otp){
            return res.json({
                success:false,
                message:'invalid otp'
            })
        }

        if(user.otpExpiry < Date.now()){
            return res.json({
                success:false,
                message:'otp expired'
            })
        }
        user.isVerified = true;
        user.verifyOtp = '';
        user.otpExpiry = 0;

        await user.save();
        return res.json({
                success:true,
                message:'email verified'
        })

    }catch(err){
        return res.json({
            success:false,
            message:err.message
        })
    }
}

export const isAuthenticated = async(req, res)=>{
    try {

        return res.json({
            success:true
        });
        
    } catch (err) {
        return res.json({
            success:false,
            message:err.message
        })
    }
}

export const sendResetOtp = async(req, res)=>{
    const {email} = req.body;

    if(!email){
        return res.json({
            success:false,
            message:'provide email'
        })
    }

    try {
        const user = await userModel.findOne({email})
        if(!user){
            return res.json({
                success:false,
                message:'user not found'
            })
        }   

        const otp = String(Math.floor(100000+Math.random()*900000));
        user.resetOtp = otp;
        user.resetOtpExpiry = Date.now() + 60*1000;
        await user.save();

        const mailOptions = {
            from: process.env.SMTP_MAIL,
            to:user.email,
            subject:'Reset OTP',
            text:`Your password reset otp is ${otp}. This otp will expire in 1 minute!`
        } 
        await transporter.sendMail(mailOptions);

        return res.json({
            success:true,
            message:'otp sent to email'
        });

        
    } catch (err) {
        return res.json({
            success:false,
            message:err.message
        })
    }

}

export const resetPassword = async(req, res)=>{
    const {email, otp, newPassword} = req.body;
    
    if(!email || !newPassword || !otp){
        return res.json({
            success:false,
            message:'all fields necessary'
        })
    }

    try{

        const user = await userModel.findOne({email});

        if(!user){
            return res.json({
                success:false,
                message:'user not found'
            })
        }

        if(user.resetOtp === '' || user.resetOtp!==otp){
            return res.json({
                success:false,
                message:'invalid otp'
            })
        }

        if(user.resetOtpExpiry < Date.now()){
            return res.json({
                success:false,
                message:'otp expired'
            })
        }
        user.password = await bcrypt.hash(newPassword, 10);
        user.resetOtp = '';
        user.resetOtpExpiry = 0;

        await user.save();
        return res.json({
                success:true,
                message:'password done reset'
        })

    }catch(err){
        return res.json({
            success:false,
            message:err.message
        })
    }
}
