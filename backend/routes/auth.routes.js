const express = require('express');

const router = express.Router()

const {signup, login, logout, verifyEmail, forgotPassword} = require("../controllers/auth.controllers");

router.post("/signup", signup)
router.post("/login", login)
router.post("/logout", logout)
router.post("/verify-email", verifyEmail)
router.post("/forgot-password", forgotPassword)

module.exports = router