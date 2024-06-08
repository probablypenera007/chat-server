const crypto = require('crypto');
const { SECRET_KEY } = require("./config")

const algorithm = 'aes-256-cbc';
const secretKey = crypto.createHash('sha256').update(String(SECRET_KEY)).digest('base64').substr(0, 32); // Ensure it's 32 bytes
const ivLength = 16; // IV length for AES

const encrypt = (text) => {
  try {
    const iv = crypto.randomBytes(ivLength);
    const cipher = crypto.createCipheriv(algorithm, Buffer.from(secretKey), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return  `${iv.toString('hex')}:${encrypted.toString('hex')}`;
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Encryption failed');
  }
};

const decrypt = (text) => {
  try {
    const textParts = text.split(':');
    const iv = Buffer.from(textParts.shift(), 'hex');
    const encryptedText = Buffer.from(textParts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv(algorithm, Buffer.from(secretKey), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Decryption failed');
  }
};

module.exports = { encrypt, decrypt };
