import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import userModel from '../models/userModel.js';

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

        const passMatch = bcrypt.compare(password, user.password);

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