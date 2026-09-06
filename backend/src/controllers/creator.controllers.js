const creatorModel = require("../models/creator.model")
const mongoose = require("mongoose");

async function getCreator(req, res) {
    try{
        const creators = await creatorModel.find();

        res.status(200).json({
        count: creators.length,
        data: creators
    });

    } catch(error){
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

async function createCreator(req, res) {
    try{
        const creator = await creatorModel.create(req.body);
        
        res.status(201).json({
            success: true,
            message: "Creator created successfully",
            data: creator
    })
    } catch(error){
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

async function getCreatorById(req, res) {
    try{
        const id = req.params.id;

        // Check if ID format is valid
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({
                success: false,
                message: "Invalid Creator ID"
            });
        }

        const creator = await creatorModel.findById(id);

        if(!creator){
            return res.status(404).json({
                success: false,
                message: "creator not found"
            });
        }

        res.status(200).json({
            success: true,
            data: creator
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

async function updateCreator(req, res) {

    try{
        const id = req.params.id;
        
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({
                success: false,
                message: "Invalid Creator ID"
            });
        }

        const creator = await creatorModel.findByIdAndUpdate(
            id, 
            req.body,
            {
                returnDocument: "after"
            }
        );

        if(!creator){
            return res.status(404).json({
                success: false,
                message: "creator not found"
            });
        }

        res.status(200).json({
            success: true,
            data: creator
        });
    } catch (error){
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

async function deleteCreator(req, res){
    try{
        const id = req.params.id;

        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({
                success: false,
                message: "Invalid creator id"
            });
        }

        const creator = await creatorModel.findByIdAndDelete(id);

        if(!creator){
            return res.status(404).json({
                success: false,
                message: "creator does not exist"
            });
        }

        res.status(200).json({
            success: true,
            message: "creator deleted successfully"
        });
    } catch (error){
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

module.exports ={ getCreator, createCreator, getCreatorById, updateCreator, deleteCreator};