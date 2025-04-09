const userModel = require('../models/user.model');
const bcrypt = require('bcryptjs');
const generateVerificationToken = require("../utils/generateVerificationToken")
const generateTokenAndSetCookie = require("../utils/generateTokenAndSetCookie")

const signup = async (req, res) => {
    const {email, password, name} = req.body

    try {
        if(!email || !password || !name){
            throw new Error("All Fields are required!");
        }

        const userAlreadyExists = await userModel.findOne({email})

        if(userAlreadyExists) {
            return res.status(400).json({message: "User already exists"})
        }
    } catch (error) {
        res.status(400).json({message: error.message})
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10 )

    const verificationToken = generateVerificationToken()

    const user = new userModel({
        email,
        password: hashedPassword,
        name,
        verificationToken: verificationToken,
        verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000 // 24 Hrs
    })

    await user.save()

    // JWT Authentication
    generateTokenAndSetCookie(res, user._id)

    res.status(200).json({
        success: true,
        message: "User created successfully",
        user: {
            ...user._doc,
            password: null
        }
    })
}

const login = async (req, res) => {
    res.send("Login Route")
}

const logout = async (req, res) => {
    res.send("Logout Route")
}

module.exports = {signup, login, logout}