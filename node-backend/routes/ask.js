const express = require('express');
const router = express.Router();
const { getContext } = require('../services/searchService');
const { generateResponse } = require('../services/aiService');
const MemoryManager = require('../services/memoryManager');

async function intentRouter(query, userProfile, currentAgentId) {
    const q = query.toLowerCase();
    if (q.includes("dinero") || q.includes("interés") || q.includes("finanzas")) return "purefinance";
    if (q.includes("código") || q.includes("programar") || q.includes("física")) return "puretech";
    
    if (userProfile && userProfile.xp > 5000) {
        if (currentAgentId === 'explora' || currentAgentId === 'semilla') return "puretech-challenge";
    }
    return null;
}

router.post('/', async (req, res) => {
    const { query, image, agentId, rut } = req.body;
    if (!query) return res.status(400).json({ error: "Falta query" });

    try {
        const userProfile = rut ? await MemoryManager.getUserProfile(rut) : null;
        const suggestedAgent = await intentRouter(query, userProfile, agentId);

        const context = await getContext(query);
        const startTime = Date.now();
        
        // Llamada a IA con retorno de metatadatos de tokens
        const { text, gap, usage } = await generateResponse(query, context, image);
        const responseTime = ((Date.now() - startTime) / 1000).toFixed(1);

        // PERSISTENCIA Y AUDITORÍA (CEO VIEW)
        if (rut) {
            await MemoryManager.updateProgress(rut, 50);
            if (gap) await MemoryManager.recordGap(rut, gap, agentId);
            
            // Log de auditoría de costos
            await MemoryManager.recordAuditLog(rut, agentId, usage);
        }

        let finalAnswer = text;
        if (suggestedAgent === 'puretech-challenge') {
            finalAnswer += "\n\n--- ✨ DESAFÍO DE NIVEL ---\n¡Veo que has dominado los fundamentos! ¿Te gustaría probar un reto de ingeniería real con mi colega PureTech? Podría darte un bonus de 500 XP.";
        }

        res.json({
            query,
            answer: finalAnswer,
            responseTime: `${responseTime}s`,
            suggestedAgent: suggestedAgent === 'puretech-challenge' ? 'puretech' : suggestedAgent
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
