// Destructure environment variables from process.env and provide default values if they are not set
const { NODE_ENV, JWT_SECRET = 'dev-secret', MONGODB_URI = 'mongodb://127.0.0.1:27017/chat_db', SECRET_KEY } = process.env;

// Export the configuration values to be used in other parts of the application
module.exports = { NODE_ENV, JWT_SECRET, MONGODB_URI, SECRET_KEY };
