const aiService = require("../services/ai.service");

async function generateEmail(req, res){
    try{

        const { prompt } = req.body;

        if(!prompt){
            return res.status(400).json({
            success: false,
            message: "Prompt is required"
        });
    }

    const email = await aiService.generateEmail(prompt);

    return res.status(200).json({
        success: true,
        message: "Email generated successfully",
        data: email
    });

    } catch(error){
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

module.exports = { generateEmail };