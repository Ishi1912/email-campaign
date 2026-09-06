const userModel = require("../models/user.model")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")

async function register(req, res) {
    try{
        const {name, email, password} = req.body;

        const user = await userModel.findOne({
            email
        });

        if(user){
            return res.status(409).json({
                success: false,
                message: "email already exists"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await userModel.create({
            name,
            email,
            password : hashedPassword
        });

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email
            }
        });

    } catch(error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

async function login(req, res) {
    try{
        const {email, password } = req.body;

        const user = await userModel.findOne({ email });

        if(!user){
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            })
        }
        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch){
            return res.status(401).json({
                success: false,
                message:"Invalid email or password"
            })
        }
        
        const token = jwt.sign(
            {
            id: user._id,
            email: user.email
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "1d"
        }
    );

    return res.status(200).json({
        success: true,
        message: "Login successful",
        token
    });
    } catch(error){
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

module.exports = { register, login }