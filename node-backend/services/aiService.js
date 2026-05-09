const { VertexAI } = require('@google-cloud/vertexai');
require('dotenv').config();

const vertexAI = new VertexAI({
    project: process.env.PROJECT_ID,
    location: process.env.LOCATION || 'us-central1'
});

async function generateResponse(query, context, imageData = null) {
    const modelId = process.env.MODEL_ID || 'gemini-2.0-flash-001';
    
    const generativeModel = vertexAI.getGenerativeModel({
        model: modelId,
        generationConfig: { maxOutputTokens: 2048, temperature: 0.15 },
    });

    const systemInstruction = `Eres un tutor experto de PureStudio. Explica paso a paso. DETECTA GAPS con [GAP: Concepto] al final.`;

    const parts = [{ text: systemInstruction + "\n\nCONTEXTO:\n" + (context || "N/A") + "\n\nPREGUNTA:\n" + query }];
    if (imageData) {
        parts.push({
            inlineData: {
                data: imageData.split(',')[1] || imageData,
                mimeType: "image/jpeg"
            }
        });
    }

    try {
        const result = await generativeModel.generateContent({
            contents: [{ role: 'user', parts: parts }],
        });

        const response = result.response;
        const text = response.candidates[0].content.parts[0].text;
        const usage = response.usageMetadata || {}; // METADATA de tokens para auditoría

        let detectedGap = null;
        const gapMatch = text.match(/\[GAP: (.*?)\]/);
        if (gapMatch) detectedGap = gapMatch[1];

        return { 
            text: text.replace(/\[GAP: .*?\]/, "").trim(), 
            gap: detectedGap,
            usage: usage
        };
    } catch (error) {
        console.error("[AIService] Error:", error);
        throw error;
    }
}

module.exports = { generateResponse };
