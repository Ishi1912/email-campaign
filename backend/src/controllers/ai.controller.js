const aiService = require("../services/ai.service");
const spamService = require("../services/spam.service");

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

const checkSpamRisk = async (req, res) => {
    
    try {
        const { subject, content } = req.body;
        
        // Validate input
        if (!subject || !content) {
            return res.status(400).json({
                success: false,
                message: "Subject and content are required."
            });
        }
        
        // Run rule-based analysis

        const ruleAnalysis =
        spamService.analyzeSpamRisk(
            subject,
            content
        );
        
        let aiAnalysis = null;
        
        let aiAvailable = true;
        
        // Try AI analysis

        try {
            aiAnalysis =
            await aiService.analyzeSpamRiskWithAI(
                subject,
                content
            );
        
        } catch (error) {
            
            console.error(
                "AI spam analysis failed:",
                error.message
            );
            
            aiAvailable = false;
        }
        
        // Calculate final score
        
        let finalScore;
        
        if (aiAvailable && aiAnalysis) {
            
            finalScore =
            Math.round(
                (ruleAnalysis.score * 0.60) +
                (aiAnalysis.score * 0.40)
            );
        
        } else {
            finalScore = ruleAnalysis.score;
        }
        
        // Calculate final risk level
        
        let risk;
        
        if (finalScore < 30) {
            risk = "Low";
        } else if (finalScore < 60) {
            
            risk = "Medium";
        
        } else if (finalScore < 80) {
            risk = "High";
        } else {
            risk = "Critical";
        }


        // Combine issues and suggestions

        const issues = [
            ...ruleAnalysis.issues,
            ...(aiAnalysis?.issues || [])
        ];


        const suggestions = [
            ...ruleAnalysis.suggestions,
            ...(aiAnalysis?.suggestions || [])
        ];


        // Send response

        return res.status(200).json({
            success: true,
            
            data: {
                score: finalScore,
                risk,
                
                ruleScore: ruleAnalysis.score,
                
                aiScore: aiAnalysis?.score ?? null,
                aiAvailable,
                
                breakdown: ruleAnalysis.breakdown,
                issues,
                suggestions
            }
        });
    } catch (error) {
        
        console.error(
            "Spam risk analysis error:",
            error
        );
        
        return res.status(500).json({
            
            success: false,
            
            message: "Unable to analyze spam risk."
        });
    }
};


module.exports = { generateEmail, checkSpamRisk };