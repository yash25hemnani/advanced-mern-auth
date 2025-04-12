const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.cookies.token
    if(!token) return res.status(401).json({success: false, message: "Unauthorized - No Token Provided"})

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        if(!decoded) return res.status(401).json({success: false, message: "Unauthorized - Invalid token"})

        req.userId =  decoded.userId
        next();

    } catch (error) {
        throw new Error("Error verifying token: ", error)
    }
}

module.exports = verifyToken;