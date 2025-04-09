const jwt = require('jsonwebtoken');

const generateTokenAndSetCookie = (res, userId) => {
    const token = jwt.sign({userId}, process.env.JWT_SECRET, {
        expiresIn: "7d"
    })

    res.cookie("token", token, {
        httpOnly: true, // Prevents XSS Attacks
        secure: process.env.NODE_ENV === "production", // for https
        sameSite: "strict", // Prevents CSRF Attacks
        maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    return token;
}

module.exports = generateTokenAndSetCookie;