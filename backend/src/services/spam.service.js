const {
    promotionalWords,
    urgencyWords,
    suspiciousPhrases
} = require("../utils/spamRules");


function calculateRiskLevel(score) {
    if (score < 30) {
        return "Low";
    }
    
    if (score < 60) {
        return "Medium";
    }
    
    if (score < 80) {
        return "High";
    }
    
    return "Critical";
}


function analyzeSpamRisk(subject, content) {
    
    const text = `${subject} ${content}`.toLowerCase();

    let score = 0;

    const issues = [];

    const suggestions = [];


// 1. Excessive capital letters

const letters = text.match(/[a-z]/g) || [];

const uppercaseLetters = `${subject} ${content}`.match(/[A-Z]/g) || [];

const uppercasePercentage =
    letters.length > 0
    ? (uppercaseLetters.length / letters.length) * 100
    : 0;


if (uppercasePercentage > 40) {
    
    score += 15;
    
    issues.push(
        "Excessive use of capital letters."
    );

    suggestions.push(
        "Use normal capitalization instead of writing large portions in uppercase."
    );
}

// 2. Excessive exclamation marks

const exclamationCount = (subject + content).match(/!/g) || [];

if (exclamationCount.length >= 3) {
    
    score += 10;
    
    issues.push(
        "Excessive use of exclamation marks."
    );

    suggestions.push(
        "Reduce repeated exclamation marks."
    );
}


// 3. Promotional words

const foundPromotionalWords =
    promotionalWords.filter(word =>
    text.includes(word)
);

if (foundPromotionalWords.length > 0) {
    
    score += Math.min(
        foundPromotionalWords.length * 5,
        20
    );
    
    issues.push(
        `Promotional language detected: ${foundPromotionalWords.join(", ")}`
    );
    
    suggestions.push(
        "Use more informative and natural language instead of excessive promotional wording."
    );
}


// 4. Urgency words

const foundUrgencyWords =
    urgencyWords.filter(word =>
        text.includes(word)
    );
    
    if (foundUrgencyWords.length > 0) {
        
        score += Math.min(
            foundUrgencyWords.length * 5,
            15
        );
        
        issues.push(
            `Urgency-related language detected: ${foundUrgencyWords.join(", ")}`
        );
        
        suggestions.push(
            "Avoid creating unnecessary urgency unless the deadline is genuine."
        );
    }


// 5. Suspicious phrases

const foundSuspiciousPhrases =
    suspiciousPhrases.filter(phrase =>
        text.includes(phrase)
    );
    
    if (foundSuspiciousPhrases.length > 0) {
        
        score += Math.min(
            foundSuspiciousPhrases.length * 10,
            25
        );
        
        issues.push(
            `Potentially suspicious phrases detected: ${foundSuspiciousPhrases.join(", ")}`
        );
        
        suggestions.push(
            "Remove or rewrite phrases that could appear misleading or suspicious."
        );
    }


// 6. Too many links

const links =
    text.match(/https?:\/\/[^\s]+/g) || [];
    
    if (links.length >= 3) {
        score += 10;
        
        issues.push(
            "Too many links detected in the email."
        );
        
        suggestions.push(
            "Reduce the number of links and keep only the most relevant ones."
        );
    }


// 7. Currency symbols

const currencySymbols =
    (subject + content).match(/[$€£₹]/g) || [];
    
    if (currencySymbols.length >= 3) {
        score += 5;
        
        issues.push(
            "Frequent currency symbols detected."
        );
        
        suggestions.push(
            "Avoid excessive use of monetary symbols."
        );
    }


// 8. Repeated characters

const repeatedCharacters =
    /(.)\1{3,}/g.test(subject + content);
    
    if (repeatedCharacters) {
        score += 5;
        
        issues.push(
            "Repeated characters detected."
        );
        
        suggestions.push(
            "Avoid excessive repeated characters such as !!!! or $$$$."
        );
    }


// Keep score between 0 and 100

score = Math.min(score, 100);


return {
    score,
    risk: calculateRiskLevel(score),
    issues,
    suggestions,
    breakdown: {
        uppercasePercentage:
        Number(uppercasePercentage.toFixed(2)),
        
        exclamationCount: exclamationCount.length,

        promotionalWords: foundPromotionalWords,

        urgencyWords: foundUrgencyWords,

        suspiciousPhrases: foundSuspiciousPhrases,

        linkCount: links.length,

        currencySymbolCount: currencySymbols.length,

        repeatedCharacters: repeatedCharacters
    }
};
}


module.exports = {
    analyzeSpamRisk
};