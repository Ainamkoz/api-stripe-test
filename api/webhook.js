const crypto = require('crypto');

const apiKey = "t5spL8Mpi82G9CWfX2hbg2k33EA95Mhy2EE7qpLb";
const webhookSecretKey = "1f9ae895-3777-46d2-b9bf-485f6eacb927";

module.exports = async (req, res) => {
    const signature = req.headers['x-signature'];
    const apiKeyHeader = req.headers['x-api-key'];

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

    // Extracting amount, currency, and status from the request body
    const { amount, currency, status } = extractDataFromRequestBody(data);

    // Return the extracted data in the response
    const responsePayload = {
        status: "Webhook received successfully!",
        amount,
        currency,
        status
    };

    return res.status(200).json(responsePayload);
};

function verifySignature(data, signature, secretKey) {
    const stringifiedData = JSON.stringify(data);
    const hashed = crypto.createHmac('sha256', secretKey).update(stringifiedData, 'utf-8').digest('hex');
    return crypto.timingSafeEqual(Buffer.from(signature, 'hex'), Buffer.from(hashed, 'hex'));
}

function extractDataFromRequestBody(data) {
    // Assuming the data is a JSON object with amount, currency, and status
    const { amount, currency, status } = data;
    return { amount, currency, status };
}
