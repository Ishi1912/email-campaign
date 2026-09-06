const campaignModel = require("../models/campaign.model");
const subscriberModel = require("../models/subscriber.model")
const mongoose = require("mongoose");
const emailService = require("../services/email.service")

async function createCampaign(req, res) {
    try{

        const { subject, content } = req.body;

        const creatorId = req.user.id;

        const campaign = await campaignModel.create({
            creatorId,
            subject,
            content
        })

        return res.status(201).json({
            success: true,
            message: "Campaign created successfully",
            data: campaign
        })

    } catch(error){
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

async function getCampaigns(req, res) {
    try{
        const campaigns = await campaignModel.find({
            creatorId: req.user.id
        })

        return res.status(200).json({
            success: true,
            count: campaigns.length,
            data: campaigns
        })
    } catch (error){
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

async function getCampaignById(req, res){
    try{
        const id = req.params.id;

        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({
                success: false,
                message: "Invalid Campaign ID"
            })
        }

        const campaign = await campaignModel.findOne({
            _id: id,
            creatorId: req.user.id
        })

        if(!campaign){
            return res.status(404).json({
                success: false,
                message: "Campaign not found"
            })
        }

        return res.status(200).json({
            success: true,
            data: campaign
        })

    } catch(error){
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

async function updateCampaign(req, res){
    try{

        const id = req.params.id;

        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({
                success: false,
                message: "Invalid Campaign ID"
            })
        }

        const campaign = await campaignModel.findOneAndUpdate({
            _id: id,
            creatorId: req.user.id
        },
        req.body,
        {
            returnDocument: "after",
            runValidators: true
        })

        if(!campaign){
            return res.status(404).json({
                success: false,
                message: "Campaign not found"
            })
        }

        return res.status(200).json({
            success: true,
            data: campaign,
            message: "Campaign Updated Successfully"
        })
    }catch(error){
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

async function deleteCampaign(req, res){
    try{
        const id = req.params.id;

        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({
                success: false,
                message: "Invalid Campaign ID"
            })
        }

        const campaign = await campaignModel.findOneAndDelete({
            _id: id,
            creatorId: req.user.id
        })

        if(!campaign){
            return res.status(404).json({
                success: false,
                message: "Campaign not found"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Campaign Deleted Successfully"
        })
    } catch(error){
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

async function sendCampaign(req, res){
    try{
        const id = req.params.id;

        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({
                success: false,
                message: "Invalid Campaign ID"
            })
        }

        const campaign = await campaignModel.findOne({
            _id: id,
            creatorId: req.user.id
        })

        if(!campaign){
            return res.status(404).json({
                success: false,
                message: "campaign not found"
            })
        }

        if (campaign.status === "sent") {
            return res.status(400).json({
                success: false,
                message: "Campaign has already been sent"
            });
        }

        const subscribers = await subscriberModel.find({
            creatorId: req.user.id,
            status: "active"
        })

        
        if (subscribers.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No active subscribers found"
            });
        }

        for (const subscriber of subscribers){
            try{
                await emailService.sendEmail(
                    subscriber.email,
                    campaign.subject,
                    campaign.content
                )
            } catch(error) {
                console.error(
                    `failed to send email to ${subscriber.email}:`,
                    error.message
                )
            }
        }

        campaign.status = "sent";
        campaign.sentAt = new Date();

        await campaign.save();
        
        return res.status(200).json({
            success: true,
            message: "Campaign sent successfully"
        });

    
    } catch(error){
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

async function scheduleCampaign(req, res){
    try {
        const id = req.params.id;
        const { scheduledAt } = req.body;

        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({
                success: false,
                message: "Invalid Campaign ID"
            });
        }

        if(!scheduledAt) {
            return res.status(400).json({
                success: false,
                message: "Scheduled time is required"
            });
        }

        const scheduleTime = new Date(scheduledAt);

        if(isNaN(scheduleTime.getTime())) {
            return res.status(400).json({
                success: false,
                message: "Invalid scheduled time"
            });
        }

        if(scheduleTime <= new Date()){
            return res.status(400).json({
                success: false,
                message: "Scheduled time must be in the future"
            });
        }

        const campaign = await campaignModel.findOne({
            _id: id,
            creatorId: req.user.id
        });

        if(!campaign){
            return res.status(404).json({
                success: false,
                message: "Campaign not found"
            });
        }

        if(campaign.status === "sent") {
            return res.status(400).json({
                success: false,
                message: "Campaign has already been sent"
            });
        }

        campaign.status = "scheduled";
        campaign.scheduledAt = scheduleTime;

        await campaign.save();

        return res.status(200).json({
            success: true,
            message: "Campaign scheduled successfully",
            data: campaign
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

async function cancelCampaign(req, res) {
    try {
        const id = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Campaign ID"
            });
        }

        const campaign = await campaignModel.findOne({
            _id: id,
            creatorId: req.user.id
        });

        if (!campaign) {
            return res.status(404).json({
                success: false,
                message: "Campaign not found"
            });
        }

        if (campaign.status !== "scheduled") {
            return res.status(400).json({
                success: false,
                message: "Only scheduled campaigns can be cancelled"
            });
        }

        campaign.status = "cancelled";

        await campaign.save();

        return res.status(200).json({
            success: true,
            message: "Campaign cancelled successfully",
            data: campaign
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

async function rescheduleCampaign(req, res) {
    try {
        const id = req.params.id;
        const { scheduledAt } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Campaign ID"
            });
        }

        if (!scheduledAt) {
            return res.status(400).json({
                success: false,
                message: "Scheduled time is required"
            });
        }

        const scheduleTime = new Date(scheduledAt);

        if (isNaN(scheduleTime.getTime())) {
            return res.status(400).json({
                success: false,
                message: "Invalid scheduled time"
            });
        }

        if (scheduleTime <= new Date()) {
            return res.status(400).json({
                success: false,
                message: "Scheduled time must be in the future"
            });
        }

        const campaign = await campaignModel.findOne({
            _id: id,
            creatorId: req.user.id
        });

        if (!campaign) {
            return res.status(404).json({
                success: false,
                message: "Campaign not found"
            });
        }

        if (campaign.status !== "scheduled") {
            return res.status(400).json({
                success: false,
                message: "Only scheduled campaigns can be rescheduled"
            });
        }

        campaign.scheduledAt = scheduleTime;

        await campaign.save();

        return res.status(200).json({
            success: true,
            message: "Campaign rescheduled successfully",
            data: campaign
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

module.exports = {createCampaign, getCampaigns, getCampaignById, updateCampaign, deleteCampaign, sendCampaign, scheduleCampaign, cancelCampaign, rescheduleCampaign};