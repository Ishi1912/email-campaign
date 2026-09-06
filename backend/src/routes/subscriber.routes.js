const express = require("express");
const subscriberController = require("../controllers/subscriber.controller");
const auth = require("../middlewares/auth.middleware");
const upload = require("../middlewares/upload.middleware");

const router = express.Router();

router.post("/", auth, subscriberController.createSubscriber);
router.get("/", auth, subscriberController.getSubscribers);

router.get("/:id", auth, subscriberController.getSubscriberById);
router.put("/:id", auth, subscriberController.updateSubscriber);
router.delete("/:id", auth, subscriberController.deleteSubscriber);

router.post("/upload", auth, upload.single("file"), subscriberController.uploadSubscribers);

module.exports = router;