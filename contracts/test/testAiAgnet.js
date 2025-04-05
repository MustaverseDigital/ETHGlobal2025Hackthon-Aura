// client.js
const axios = require("axios");

async function main() {
  try {
    // 向您的 server 端點發送 POST 請求
    const response = await axios.post("http://localhost:3001/getDefiInfo", {
      // 此處如果需要傳入額外參數，可加入 JSON payload
      // 例如: input_text: "Some query" 但 server 端預設已寫好 payload
      input_text: "What is the biggest Asset Value diamond"
    });
    console.log("Response from server:", response.data);
  } catch (error) {
    console.error("Error calling server:", error.message);
  }
}

main();
