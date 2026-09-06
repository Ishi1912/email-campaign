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

module.exports = { generateEmail };