const subscriberModel = require("../models/subscriber.model");
const subscriberService = require("../services/subscriberService");
const mongoose = require("mongoose");


async function createSubscriber(req, res) {
    try{
        const{name, email} = req.body;
        const creatorId = req.user.id;

        const subs = await subscriberModel.findOne({
            creatorId,
            email
        });

        if(subs){
            return res.status(409).json({
                success: false,
                message: "subscriber already exists"
            })
        }

        const subscriber = await subscriberModel.create({
            creatorId,
            name,
            email
        });

        return res.status(201).json({
            success: true,
            data: subscriber,
            message: "Subscriber created successfully"
        })

    } catch(error){
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

async function getSubscribers(req, res){
    try{
        const subscribers = await subscriberModel.find({
            creatorId: req.user.id
        });

        return res.status(200).json({
            success: true,
            count: subscribers.length,
            data: subscribers
        })

    } catch(error){
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

async function getSubscriberById(req, res){
    try{
        const id = req.params.id;

        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({
            success: false,
            message: "Invalid Subscriber ID"
        });
    }

    const subscriber = await subscriberModel.findOne({
        _id: id,
        creatorId: req.user.id
    });

    if(!subscriber){
        return res.status(404).json({
            success: false,
            message: "subscriber not found"
        })
    }

    return res.status(200).json({
        success: true,
        data: subscriber
    })

    } catch(error){
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

async function updateSubscriber(req, res){
    try{
        const id = req.params.id;
        
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({
            success: false,
            message: "Invalid Subscriber ID"
        });
    }

    const subscriber = await subscriberModel.findOneAndUpdate({
        _id: id,
        creatorId: req.user.id
    },
    req.body,
    {
        returnDocument: "after",
        runValidators: true
    }
);

    if(!subscriber){
        return res.status(404).json({
            success: false,
            message: "Subscriber not found"
        })
    }

    return res.status(200).json({
        success: true,
        data: subscriber,
        message: "Subscriber updated successfully"
    })


    } catch(error){
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

async function deleteSubscriber(req, res){
    try{

        const id = req.params.id;

        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({
                success: false,
                message: "Invalid Subscriber ID"
            });
        }

        const subscriber = await subscriberModel.findOneAndDelete({
            _id: id,
            creatorId: req.user.id
        })

        if(!subscriber){
            return res.status(404).json({
                success: false,
                message: "Subscriber not found"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Subscriber deleted successfully"
        })

    } catch(error){
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

async function uploadSubscribers(req, res){
    try{

        if(!req.file){
            return res.status(400).json({
                success: false,
                message: "CSV file is required"
            });
        }

        const filePath = req.file.path;

        const result = await subscriberService.uploadSubscribers(
            filePath,
            req.user.id
        );

        return res.status(200).json({
            success: true,
            message: "Subscribers uploaded successfully",
            count: result.length,
            data: result
        });

    } catch(error){
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

module.exports = { createSubscriber, getSubscribers,  getSubscriberById, updateSubscriber, deleteSubscriber, uploadSubscribers}