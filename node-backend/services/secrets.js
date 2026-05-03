const { SecretManagerServiceClient } = require('@google-cloud/secret-manager');

const client = new SecretManagerServiceClient();

/**
 * Carga secretos desde Google Cloud Secret Manager.
 * Reemplaza la necesidad de archivos .env en producción.
 */
async function loadSecret(secretName) {
    try {
        const [version] = await client.accessSecretVersion({
            name: `projects/${process.env.GCP_PROJECT_NUMBER}/secrets/${secretName}/versions/latest`,
        });
        return version.payload.data.toString();
    } catch (error) {
        console.warn(`[Secrets] No se pudo cargar el secreto ${secretName}, usando fallback .env si existe.`);
        return process.env[secretName];
    }
}

module.exports = { loadSecret };
