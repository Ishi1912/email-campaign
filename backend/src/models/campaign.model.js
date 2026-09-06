const mongoose= require("mongoose");

const campaignSchema = new mongoose.Schema({
    creatorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    subject: {
        type: String,
        required: true
    },

    content: {
        type: String,
        required: true
    },

    status: {
        type: String,
        enum: ["draft", "scheduled", "sending", "sent", "failed", "cancelled"],
        default: "draft"
    },

    scheduledAt: {
        type: Date,
        default: null
    },

    sentAt: {
        type: Date,
        default: null
    }
},

    {
        timestamps: true
    }
);

const campaignModel = mongoose.model("Campaign", campaignSchema);

module.exports = campaignModel;