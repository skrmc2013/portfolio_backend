import mongoose from "mongoose";
import bcrypt from "bcrypt";
// import { JsonWebTokenError } from "jsonwebtoken";
import jwt from "jsonwebtoken"; 
import crypto from "crypto";

const userSchema = new mongoose.Schema({
    fullName:{
        type : String,
        required: [true, "Name required"],
    },
    titles:{
        type: [String]
    },
    email:{
        type : String,
        required: [true, "Email is required"],
        unique: [true, "Email Exist"],
    },
    phone:{
        type : String,
        required: [true, "Phone is required"],
        unique: [true, "Phone Exist"],
    },
    aboutMe:{
        type : String,
        required: [true, "Bio is required"],
    },
    password:{
        type: String,
        required: [true, " Password is required"],
        minLength : [8, "Password must contain 8 characters"],
        select : false,
    },
    avatar:{
       public_id: {
        type: String,
        required : true,
       },
       url: {
        type: String,
        required : true,
       },

    },
   resume:{
       public_id: {
        type: String,
        required : true,
       },
       url: {
        type: String,
        required : true,
       },

    },
   portfolioUrl:{
        type: String,
        required : [true, "Portfolio url is required"]

    },

    githubURL: String,
    facebookURL:String,
    whatsappURL:String,
    linkedInURL:String,
    youtubeURL:String,
    experience:String,
    support:String,

    instagramURL:{
        type: String,
        default: '',
    },
    twitterURL:{
        type: String,
        default: '',
    },
    
    replitURL:{
        type: String,
        default: '',
    },
    telegramURL:{
        type: String,
        default: '',
    },
    
    stackoverflowURL:{
        type: String,
        default: '',
    },
    

    resetPasswordToken: String,
    resetPasswordExpire:Date,
});

// to make passsword hashed
userSchema.pre("save", async function(next){
    if(!this.isModified("password")){
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
})

// for compare hashed password

userSchema.methods.comparePassword= async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password);
}

// generete json web token
userSchema.methods.generateJsonWebToken = function(){
    return jwt.sign({id: this._id}, process.env.JWT_SECRET_KEY, {expiresIn:process.env.JWT_EXPIRE_Time});
  
};
userSchema.methods.getResetPasswordToken = function(){
    const resetToken = crypto.randomBytes(20).toString("hex");
    this.resetPasswordToken= crypto.createHash("sha512").update(resetToken).digest("hex");
    this.resetPasswordExpire = Date.now() + 15*60*1000;
    return resetToken;
}

export const User = mongoose.model("User", userSchema);