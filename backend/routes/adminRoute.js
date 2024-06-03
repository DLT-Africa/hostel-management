const express = require("express");
const { register, login, getAdmin, deleteAdmin, getAdmins, updateAdmin, logoutAdmin } = require("../controllers/adminController");
const router = express.Router();
const {protect} = require("../middleware/authMiddleware")

router.post("/register", register);
router.post("/login", login);
router.get("/:adminId", protect, getAdmin);
router.delete("/:adminId", protect, deleteAdmin);
router.get("/", protect, getAdmins);
router.put("/:adminId", protect, updateAdmin);
router.post("/logout", logoutAdmin);

module.exports = router;