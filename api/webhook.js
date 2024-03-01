const express = require('express');
const app = express();

const crypto = require('crypto');

const apiKey = "t5spL8Mpi82G9CWfX2hbg2k33EA95Mhy2EE7qpLb";
const webhookSecretKey = "1f9ae895-3777-46d2-b9bf-485f6eacb927";

// Replace the following line with the Webhook.site URL
const webhookSiteUrl = "https://api-stripe-test-v65j.vercel.app/api/webhook";

app.use(express.json()); // Parse JSON payloads

app.post('/api/webhook', async (req, res) => {
    if (req.method === 'GET') {
        console.log('GET request received');
        return res.status(200).send("GET request received successfully");
    }

    // Perform the necessary changes to use the Webhook.site URL
    // Example: const webhookSiteUrl = "https://webhook.site/your-unique-id";
    // Use the 'webhookSiteUrl' variable in place of a hardcoded URL

    const signature = req.headers['x-signature'];
    const apiKeyHeader = req.headers['x-api-key'];

    // Additional logs
    console.log('Received Headers:', req.headers);
    console.log('Received API Key:', apiKeyHeader);
    console.log('Received Signature:', signature);

    if (!signature) {
        return res.status(400).send("Missing X-Signature header");
    }

    if (!apiKeyHeader || apiKeyHeader !== apiKey) {
        return res.status(401).send("Invalid API key");
    }

    const data = req.body;

    if (!verifySignature(data, signature, webhookSecretKey)) {
        return res.status(401).send("Invalid signature");
    }

    handleWebhookData(data);

    return res.status(200).send("Webhook received successfully");
});

function verifySignature(data, signature, secretKey) {
    const stringifiedData = JSON.stringify(data);
    const hashed = crypto.createHmac('sha256', secretKey).update(stringifiedData, 'utf-8').digest('hex');
    return crypto.timingSafeEqual(Buffer.from(signature, 'hex'), Buffer.from(hashed, 'hex'));
}

function handleWebhookData(data) {
    console.log('Webhook Data:', data);
}

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
