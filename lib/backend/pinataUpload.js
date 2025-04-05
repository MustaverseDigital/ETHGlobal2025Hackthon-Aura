const express = require('express');
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
const { getValueFromJson } = require('./readKeys');

const app = express();
const port = process.env.PORT || 3000;

// Use multer to handle file uploads; files will be temporarily stored in the "uploads" folder.
const upload = multer({ dest: 'uploads/' });

// Global variable for storing secrets
let globalPinataApiKey = null;

// Initialize secrets (read PINATA_API_SECRET from keys.json)
async function initializeKeys() {
    try {
        globalPinataApiKey = await getValueFromJson(path.join(__dirname, '../secrets/keys.json'), 'PINATA_API_SECRET');
        console.log(`Initialization complete. PINATA_API_SECRET: ${globalPinataApiKey}`);
    } catch (err) {
        console.error('Initialization failed:', err);
    }
}
initializeKeys();

// Fixed API Key (adjust as needed or also store it in JSON)
const PINATA_API_KEY = '2b17edd21596a8235f0d';
// Get PINATA_API_SECRET from global variable; ensure initializeKeys is complete.
function getPinataSecret() {
    if (!globalPinataApiKey) {
        throw new Error('Pinata API secret is not initialized');
    }
    return globalPinataApiKey;
}

/**
 * Uploads a file to Pinata (pinFileToIPFS).
 * @param {string} filePath - Local file path.
 * @param {string} [groupId] - Optional group ID for Pinata metadata.
 * @returns {Promise<string>} - Returns the IPFS hash after upload.
 */
async function uploadFileToPinata(filePath, groupId) {
    const url = 'https://api.pinata.cloud/pinning/pinFileToIPFS';
    const data = new FormData();
    data.append('file', fs.createReadStream(filePath));

    // Optional: Add metadata (e.g., file name and description)
    const metadataObj = {
        name: 'My Image',
        keyvalues: { customKey: 'customValue' }
    };
    if (groupId) {
        metadataObj.groupId = groupId;
    }
    data.append('pinataMetadata', JSON.stringify(metadataObj));

    try {
        const response = await axios.post(url, data, {
            maxContentLength: Infinity,
            headers: {
                'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
                pinata_api_key: PINATA_API_KEY,
                pinata_secret_api_key: getPinataSecret(),
            },
        });
        console.log('File uploaded successfully:', response.data);
        return response.data.IpfsHash;
    } catch (error) {
        console.error('File upload failed:', error.response ? error.response.data : error.message);
        throw error;
    }
}

/**
 * Uploads JSON data to Pinata (pinJSONToIPFS).
 * @param {object} jsonData - Metadata JSON object.
 * @param {string} [groupId] - Optional group ID for Pinata metadata.
 * @returns {Promise<string>} - Returns the IPFS hash after upload.
 */
async function uploadJSONToPinata(jsonData, groupId) {
    const url = 'https://api.pinata.cloud/pinning/pinJSONToIPFS';
    const payload = {
        pinataMetadata: {
            name: jsonData.name || 'My JSON',
            keyvalues: { customKey: 'customValue' }
        },
        pinataOptions: {
        },
        pinataContent: jsonData
    };
    if (groupId) {
        payload.pinataOptions.groupId = groupId;
    }
    try {
        const response = await axios.post(url, payload, {
            headers: {
                'Content-Type': 'application/json',
                pinata_api_key: PINATA_API_KEY,
                pinata_secret_api_key: getPinataSecret(),
            },
        });
        console.log('JSON uploaded successfully:', response.data);
        return response.data.IpfsHash;
    } catch (error) {
        console.error('JSON upload failed:', error.response ? error.response.data : error.message);
        throw error;
    }
}

// Parse JSON request bodies.
app.use(express.json());

/**
 * POST /uploadFile
 * Uploads a single file to Pinata.
 */
app.post('/uploadFile', upload.single('file'), async (req, res) => {
    try {
        const groupId = req.body.groupId; // Optional groupId from request body
        const ipfsHash = await uploadFileToPinata(req.file.path, groupId);
        res.json({ ipfsHash });
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
});

/**
 * POST /uploadJSON
 * Uploads JSON data to Pinata.
 */
app.post('/uploadJSON', async (req, res) => {
    try {
        const groupId = req.body.groupId; // Optional groupId from request body
        const ipfsHash = await uploadJSONToPinata(req.body, groupId);
        res.json({ ipfsHash });
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
});

/**
 * POST /uploadNFT
 * Uploads NFT metadata: first uploads file, then constructs metadata JSON using the file hash.
 * Expects multipart/form-data including file and JSON fields (e.g., name, description, attributes, groupId).
 */
app.post('/uploadNFT', upload.single('file'), async (req, res) => {
    try {
        let imageField = '';
        // If file is uploaded, use the returned IPFS hash for the image field.
        if (req.file) {
            const groupId = req.body.groupId; // Optional groupId
            const imageHash = await uploadFileToPinata(req.file.path, groupId);
            imageField = `ipfs://${imageHash}`;
        }
        // If the request body includes an image field, it overrides the file upload.
        if (req.body.image) {
            imageField = req.body.image;
        }
        console.log('Group ID:', req.body.groupId);
        const metadata = {
            name: req.body.name || 'My NFT',
            description: req.body.description || 'This is an example NFT metadata.',
            image: imageField,
            attributes: req.body.attributes ? JSON.parse(req.body.attributes) : [],
            animation_url: req.body.animation_url || ''
        };
        const groupId = req.body.groupId; // Optional groupId for JSON upload
        const metadataHash = await uploadJSONToPinata(metadata, groupId);
        res.json({ image: imageField, metadataHash });
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
});

// Start the server.
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// Export the server (if needed in other modules)
module.exports = app;
