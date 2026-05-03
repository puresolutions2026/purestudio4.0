const db = require('./db');
const { Firestore } = require('@google-cloud/firestore');

class MemoryManager {
    /**
     * Registra el consumo de tokens y costo estimado para auditoría CEO.
     */
    static async recordAuditLog(rut, agentId, usage) {
        try {
            const auditRef = db.collection('audit_logs').doc();
            await auditRef.set({
                rut,
                agentId,
                timestamp: new Date(),
                promptTokens: usage.promptTokenCount || 0,
                candidatesTokens: usage.candidatesTokenCount || 0,
                totalTokens: usage.totalTokenCount || 0,
                estimatedCost: (usage.totalTokenCount * 0.0000001).toFixed(8) // Ejemplo de costo estimado
            });
        } catch (error) {
            console.error("[AuditManager] Error guardando log:", error);
        }
    }

    static async recordGap(rut, concept, agentId) {
        try {
            const userRef = db.collection('users').doc(rut);
            const userDoc = await userRef.get();
            if (!userDoc.exists) {
                await userRef.set({ rut, xp: 0, gaps: [{ concept, sourceAgent: agentId, status: 'unresolved', detectedAt: new Date() }] });
            } else {
                await userRef.update({
                    gaps: Firestore.FieldValue.arrayUnion({ concept, sourceAgent: agentId, status: 'unresolved', detectedAt: new Date() })
                });
            }
        } catch (e) { console.error(e); }
    }

    static async updateProgress(rut, xpGain) {
        try {
            const userRef = db.collection('users').doc(rut);
            await userRef.set({ xp: Firestore.FieldValue.increment(xpGain), lastLogin: new Date() }, { merge: true });
        } catch (e) { console.error(e); }
    }

    static async getUserProfile(rut) {
        const userDoc = await db.collection('users').doc(rut).get();
        return userDoc.exists ? userDoc.data() : null;
    }
}

module.exports = MemoryManager;
