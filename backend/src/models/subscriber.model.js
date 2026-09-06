const mongoose = require("mongoose");

const subscriberSchema = new mongoose.Schema({
    creatorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    name: {
        type: String,
    },

    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },

    status: {
        type: String,
        enum: ["active", "unsubscribed", "bounced"],
        default: "active"
    }
})

const subscriberModel = mongoose.model("Subscriber", subscriberSchema);

module.exports = subscriberModel;