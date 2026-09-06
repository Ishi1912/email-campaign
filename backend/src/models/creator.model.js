const mongoose = require("mongoose");

const creatorSchema =new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    email: {
        type:String,
        required: true,
        unique: true
    },

    subscribers: {
        type: Number,
        default: 0
    }
});

const creatorModel = mongoose.model("Creator", creatorSchema);

module.exports = creatorModel;