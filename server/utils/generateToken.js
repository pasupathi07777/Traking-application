const jwt =require('jsonwebtoken')
const generateToken=(userId,res)=>{
    const token=jwt.sign({userId},process.env.JWT_SECRET,{expiresIn:"15d"})
    console.log(token)
    res.cookie("jwt",token,{maxAge:15*24*60*60*1000,
        // httpOnly:true,
        // sameSite:"strict",
        // secure:process.env.NODE_ENV!=="development"
        httpOnly: true, // Ensures the cookie is accessible only by the server
        secure: false,  // Set to true if using HTTPS; false for development
        sameSite: "strict",
    })
   
}

module.exports=generateToken