const express = require('express');
const creatorController = require("../controllers/creator.controllers");
const loggerMiddleware = require("../middlewares/logger.middleware");
const validateCreator = require("../validators/creator.validator");
const validate = require("../middlewares/validation.middleware")
const auth = require("../middlewares/auth.middleware")

const router = express.Router();


router.get("/", loggerMiddleware.logger ,creatorController.getCreator)
router.get("/:id", creatorController.getCreatorById);

router.post("/", auth, validateCreator,validate, creatorController.createCreator);
router.put("/:id", auth, validateCreator,validate, creatorController.updateCreator);
router.delete("/:id", auth ,creatorController.deleteCreator);


module.exports = router;