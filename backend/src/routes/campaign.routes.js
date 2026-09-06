const express = require("express");
const campaignController = require("../controllers/campaign.controller");
const auth = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/", auth, campaignController.createCampaign)
router.get("/", auth, campaignController.getCampaigns)
router.get("/:id", auth, campaignController.getCampaignById)
router.put("/:id", auth, campaignController.updateCampaign)
router.delete("/:id", auth, campaignController.deleteCampaign)
router.post("/:id/send", auth, campaignController.sendCampaign)
router.post("/:id/schedule", auth, campaignController.scheduleCampaign)
router.post("/:id/cancel", auth, campaignController.cancelCampaign)
router.post("/:id/reschedule", auth, campaignController.rescheduleCampaign)

module.exports = router;