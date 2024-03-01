const crypto = require('crypto');

const webhookSecretKey = process.env.WEBHOOK_KEY;

module.exports = async (req, res) => {
    const signature = req.headers['x-signature'];

    if (!signature) {
        return res.status(400).send("Missing X-Signature header");
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
