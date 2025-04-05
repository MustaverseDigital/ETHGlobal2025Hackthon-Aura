const fs = require('fs');

/**
 * Reads data from the specified JSON file and retrieves the value of the target key.
 * @param {string} filePath - The path to the JSON file.
 * @param {string} targetKey - The key to look up.
 * @returns {Promise<any>} - Returns a Promise that resolves to the corresponding value, or null if the key does not exist.
 */
exports.getValueFromJson = (filePath, targetKey) => {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                return reject(`Failed to read file: ${err}`);
            }
            try {
                const keysObj = JSON.parse(data);
                if (targetKey in keysObj) {
                    resolve(keysObj[targetKey]);
                } else {
                    resolve(null);
                }
            } catch (parseError) {
                reject(`JSON parsing error: ${parseError}`);
            }
        });
    });
};
