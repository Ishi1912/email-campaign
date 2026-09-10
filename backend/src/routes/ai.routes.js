const express = require("express");
const aiController = require("../controllers/ai.controller");
const auth = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/generate", auth, aiController.generateEmail);
router.post("/spam-check", auth, aiController.checkSpamRisk);

module.exports = router;