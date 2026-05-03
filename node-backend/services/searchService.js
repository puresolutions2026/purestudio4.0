const { SearchServiceClient } = require('@google-cloud/discoveryengine');
require('dotenv').config();

// Servamos en modo singleton para evitar reconexiones
let client;
try {
    client = new SearchServiceClient();
} catch (e) {
    console.error("[SearchService] Error inicializando cliente de búsqueda:", e.message);
}

/**
 * Recupera contexto en Modo Fail-Safe.
 */
async function getContext(query) {
    try {
        if (!client) return "";

        const projectId = process.env.PROJECT_ID;
        const location = process.env.LOCATION || 'global';
        const dataStoreId = process.env.DATA_STORE_ID;
        
        if (!dataStoreId || dataStoreId === 'purestudio-ds') {
            // Si el ID es el default o está vacío, evitamos el error
            return ""; 
        }

        const servingConfig = `projects/${projectId}/locations/${location}/collections/default_collection/dataStores/${dataStoreId}/servingConfigs/default_search`;

        const request = {
            servingConfig,
            query: query,
            pageSize: 3,
        };

        const [response] = await client.search(request);
        
        let contextText = "";
        for (const result of response.results) {
            const data = result.document.derivedStructData.fields;
            const snippet = data.snippets?.listValue?.values?.[0]?.structValue?.fields?.snippet?.stringValue || "";
            contextText += `${snippet}\n\n`;
        }

        return contextText.trim();
    } catch (error) {
        // FALLBACK DIRECTO: No lanzamos error para evitar el 500 en el backend.
        console.warn(`[Fail-Safe] Data Store inaccesible (${error.message}). Ignorando búsqueda.`);
        return ""; 
    }
}

module.exports = { getContext };
