const express = require("express");
const router = express.Router();
const { getAllUsers, getAnalytics, getReports } = require("../controllers/adminController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

router.use(authMiddleware, adminMiddleware);

// GET all users
router.get("/users", getAllUsers);

// GET analytics
router.get("/analytics", getAnalytics);

// GET reports
router.get("/reports", getReports);

module.exports = router;
