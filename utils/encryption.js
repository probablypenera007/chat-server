const crypto = require('crypto');
const { SECRET_KEY } = require("./config")

const algorithm = 'aes-256-cbc'; // Encryption algorithm
const secretKey = crypto.createHash('sha256').update(String(SECRET_KEY)).digest('base64').substr(0, 32);  // Generate a 32-byte key from SECRET_KEY
const ivLength = 16; // Initialization Vector (IV) length for AES


/**
 * Encrypts a text using AES-256-CBC algorithm.
 * Generates a random IV for each encryption 
 * and concatenates it with the encrypted text.
 */
const encrypt = (text) => {
  try {
    const iv = crypto.randomBytes(ivLength); // Generate a random IV
    const cipher = crypto.createCipheriv(algorithm, Buffer.from(secretKey), iv); // Create a Cipher instance
    let encrypted = cipher.update(text); // Encrypt the text
    encrypted = Buffer.concat([encrypted, cipher.final()]); // Concatenate the final encrypted data
    return  `${iv.toString('hex')}:${encrypted.toString('hex')}`; // Return the IV and encrypted text as a single string
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Encryption failed');
  }
};

/**
 * Decrypts an encrypted text using AES-256-CBC algorithm.
 * Extracts the IV from the input string and uses it to decrypt the text.
 */

const decrypt = (text) => {
  try {
    const textParts = text.split(':'); // Split the input text to extract IV and encrypted text
    const iv = Buffer.from(textParts.shift(), 'hex'); // Extract the IV
    const encryptedText = Buffer.from(textParts.join(':'), 'hex'); // Extract the encrypted text
    const decipher = crypto.createDecipheriv(algorithm, Buffer.from(secretKey), iv); // Create a Decipher instance
    let decrypted = decipher.update(encryptedText); // Decrypt the text
    decrypted = Buffer.concat([decrypted, decipher.final()]);  // Concatenate the final decrypted data
    return decrypted.toString(); // Return the decrypted text
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Decryption failed');
  }
};

module.exports = { encrypt, decrypt };
