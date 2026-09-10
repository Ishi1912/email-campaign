const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
    model: "gemini-flash-latest"
});

async function generateEmail(prompt){
    try{
        const fullPrompt = `
        Generate a professional email.
        
        Requirements:
        - Attractive subject line
        - Professional tone
        - Keep it concise (150-200 words)
        - Use a greeting
        - End with a call-to-action
        - Do not use placeholders like [Your Name] or [Company Name]
        
        Generate a professional marketing email based on the user's request.
        
        Return ONLY valid JSON in the following format:
        
        {
        "subject": "...",
        "content": "..."
        }

        User Request:
        ${prompt}
        `;

        const result = await model.generateContent(fullPrompt);

        const response = result.response;

        const text = response.text();

        const email = JSON.parse(text);

        return email;

    } catch(error){
        throw error;
    }
}

async function analyzeSpamRiskWithAI(subject, content) {
    
const prompt = `
    
    You are an email content risk analysis assistant.

    Analyze the following email for spam-like characteristics.

    Subject:
    ${subject}

    Content:
    ${content}

    Evaluate the email based on:

    1. Aggressive or manipulative language
    2. Misleading or unrealistic claims
    3. Excessive promotional tone
    4. Suspicious context
    5. Artificial urgency
    6. Unnatural or deceptive wording

    Return ONLY valid JSON.

    The score must be between 0 and 100.

    0 means very low spam-like risk.
    100 means very high spam-like risk.

    Use this exact structure:

    {
    "score": 0,
    "issues": [],
    "suggestions": []
    }

    Do not claim that the email will definitely be delivered to spam.
    This is only a content-based risk assessment.
`;

const result = await model.generateContent(prompt);

const response = result.response.text();

const cleanedResponse =
    response
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

const analysis =
    JSON.parse(cleanedResponse);

return analysis;
}

module.exports = { generateEmail, analyzeSpamRiskWithAI };