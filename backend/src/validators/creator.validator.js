const {body} = require("express-validator");

const validateCreator = [
    body("name")
    .notEmpty()
    .withMessage("Name is Required"),

    body("email")
    .isEmail()
    .withMessage("Please enter a valid Email"),

    body("subscribers")
    .isInt({min:0})
    .withMessage("Subscribers cannot be negative")

];

module.exports = validateCreator;