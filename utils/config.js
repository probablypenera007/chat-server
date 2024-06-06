const { NODE_ENV, JWT_SECRET = 'dev-secret', MONGODB_URI = 'mongodb://127.0.0.1:27017/chat_db' } = process.env;

module.exports = { NODE_ENV, JWT_SECRET, MONGODB_URI };
