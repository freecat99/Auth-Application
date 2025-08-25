import userModel from "../models/userModel.js";

export const getUserData = async(req, res) =>{
    try {
        const {userId} = req.body;
        const user = await userModel.findById(userId);

        if(!user){
            return res.json({
                success:false,
                message:'user not found'
            })
        }

        res.json({
            success:true,
            userData:{
                name: user.name,
                verified: user.isVerified
            }
        }); 
        
    } catch (err) {
        return res.json({
            success:false,
            message:err.message
        });
        
    }
}