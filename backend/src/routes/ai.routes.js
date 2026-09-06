const express = require("express");
const aiController = require("../controllers/ai.controller");
const auth = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/generate", auth, aiController.generateEmail);

module.exports = router;