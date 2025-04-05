const axios = require('axios');
const FormData = require('form-data');

/**
 * Uploads NFT data to the /uploadNFT endpoint.
 * @param {object} params - NFT related parameters.
 * @param {string} params.name - NFT name.
 * @param {string} params.description - NFT description.
 * @param {string} params.image - Image URL to use if not uploading a file.
 * @param {Array} params.attributes - NFT attributes array (will be stringified to JSON).
 * @param {string} params.animation_url - Animation URL.
 * @param {string} [params.groupId] - Optional group ID for organizing uploads.
 * @param {string} [params.endpoint] - Endpoint URL, default is "http://localhost:3000/uploadNFT".
 * @returns {Promise<object>} - Returns an object containing the image (or IPFS hash) and metadataHash.
 */
async function uploadNFT({
  name,
  description,
  image,
  attributes,
  animation_url,
  groupId,
  endpoint = 'http://localhost:3000/uploadNFT'
}) {
  const form = new FormData();

  // Append NFT fields to form-data.
  form.append('name', name);
  form.append('description', description);
  form.append('image', image); // Use this if the server handles the image field.
  form.append('attributes', JSON.stringify(attributes));
  form.append('animation_url', animation_url);

  // If groupId is provided, append it to the form-data.
 
  if (groupId) {
    form.append('groupId', groupId);
  }

  try {
    const response = await axios.post(endpoint, form, {
      headers: {
        ...form.getHeaders()
      }
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
}

// Example usage:
uploadNFT({
  name: "AuraGem #001",
  description: "A unique Round Brilliant gemstone in Ruby #E0115F color, evaluated using GIA's 4C standard.",
  image: "https://i.imgur.com/yKYwm5Y.png",
  attributes: [
    { trait_type: "Cut", value: "Round Brilliant" },
    { trait_type: "Color", value: "Ruby" },
    { trait_type: "Clarity", value: "VS1" },
    { trait_type: "Carat", value: "1.25" },
    { trait_type: "Guarantor", value: "Kevin" },
    { trait_type: "CertificationAuthority", value: "GemRWA" }
  ],
  animation_url: "https://gemfi-three-js.vercel.app/?modelIndex=0&color=%23ff87b5",
  groupId: "08ab4e76-c8d3-44c7-b425-721c637be819"  // Optional group ID
})
  .then(result => {
    console.log("Upload result:", result);
  })
  .catch(error => {
    console.error("Upload error:", error);
  });
