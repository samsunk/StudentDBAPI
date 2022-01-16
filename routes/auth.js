const express = require("express");
const router = express.Router();

const { register, login, getMe, logout } = require("../controllers/auth");

const { protect } = require("../middleware/auth");

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);
//router.post("/forgotpassword", forgotPassword);
//router.put("/resetpassword/:resettoken", resetPassword);
router.get("/logout", logout);

module.exports = router;
