const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userModel = require('../models/user.model');
const generateVerificationToken = require("../utils/generateVerificationToken")
const generateTokenAndSetCookie = require("../utils/generateTokenAndSetCookie")
const { sendVerificationEmail, sendWelcomeEmail, sendPasswordResetEmail, sendResetSuccessEmail } = require("../mailtrap/email")

const signup = async (req, res) => {
    const { email, password, name } = req.body

    try {
        if (!email || !password || !name) {
            throw new Error("All Fields are required!");
        }

        const userAlreadyExists = await userModel.findOne({ email })

        if (userAlreadyExists) {
            return res.status(400).json({ message: "User already exists" })
        }
    } catch (error) {
        res.status(400).json({ message: error.message })
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10)

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

    await sendVerificationEmail(user.email, verificationToken);

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
    const { email, password } = req.body
    try {
        const user = await userModel.findOne({ email })

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid Credentials"
            })
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)

        if (!isPasswordValid) {
            return res.status(400).json({
                success: false,
                message: "Invalid Credentials"
            })
        }

        generateTokenAndSetCookie(res, user._id)

        user.lastLogin = new Date()
        await user.save()

        res.status(200).json({
            success: true,
            message: "Logged In Successfully",
            user: {
                ...user._doc,
                password: null
            }
        })

    } catch (error) {
        console.log("Login Failed with Error: ", error);

    }
}

const logout = async (req, res) => {
    res.clearCookie("token")
    res.status(200).json({
        success: true,
        message: "Logout successful. "
    })
}

const verifyEmail = async (req, res) => {
    const { code } = req.body
    try {
        const user = await userModel.findOne({
            verificationToken: code,
            verificationTokenExpiresAt: { $gt: Date.now() }
        })

        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid or Expired Verification Code" })
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;
        await user.save();

        await sendWelcomeEmail(user.email, user.name)

        return res.status(200).json({
            success: true,
            message: "User is verified",
            user: {
                ...user._doc,
                password: null
            }
        })

    } catch (error) {
        console.log("Error Verifying Email: ", error);

        return res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

const forgotPassword = async (req, res) => {
    const { email } = req.body

    try {
        const user = await userModel.findOne({ email })

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid Credentials"
            })
        }
        const resetToken = crypto.randomBytes(20).toString("hex")
        console.log(resetToken);
        const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000 // 1 Hour

        user.resetPasswordToken = resetToken
        user.resetPasswordExpiresAt = resetTokenExpiresAt;

        await user.save()

        // Send the Password Reset Email
        await sendPasswordResetEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`)

        return res.status(200).json({
            success: true,
            message: "Reset mail is sent",
        })

    } catch (error) {
        console.log("Error in sending Forget Password request: ", error);

        throw new Error("Error in sending Forget Password request: ", error);
    }
}

const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        const user = await userModel.findOne({
            resetPasswordToken: token,
            resetPasswordExpiresAt: { $gt: Date.now() }
        })

        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid or expired reset token" })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        user.password = hashedPassword
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiresAt = undefined;
        await user.save()

        await sendResetSuccessEmail(user.email);

        res.status(200).json({ success: true, message: "Password reset successful." })

    } catch (error) {
        console.log("Error resetting password: ", error);

        return res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

const checkAuth = async (req, res) => {
    try {
        const user = await userModel.findById(req.userId).select("-password") // Unselects Password from the retrevied data

        if (!user) {
            return res.status(400).json({
                success: true,
                message: "User not found"
            })
        }

        res.status(200).json({
            success: true,
            user
        })
    } catch (error) {
        console.log("Error in checkAuth: ", error);

        return res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

module.exports = { signup, login, logout, verifyEmail, forgotPassword, resetPassword, checkAuth }