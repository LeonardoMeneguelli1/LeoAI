const express = require("express");
const router = express.Router();
const db = require("../mockDB");
const authMiddleware = require("../middlewares/authMiddleware");

router.get("/", authMiddleware, (req, res) => {
  const email = req.user.email;
  const userHistory = db.history.filter(h => h.email === email);
  res.json(userHistory);
});

module.exports = router;
