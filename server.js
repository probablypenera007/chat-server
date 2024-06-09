require("dotenv").config(); // Load environment variables from a .env file
const express = require('express'); // Express framework for building web applications
const helmet = require("helmet"); // Helmet helps secure Express apps by setting various HTTP headers
const mongoose = require("mongoose"); // Mongoose for MongoDB object modeling and data validation
const cors = require("cors"); // CORS middleware to allow cross-origin requests
const { errors } = require("celebrate");  // Celebrate for validation of incoming request bodies, headers, etc.
const socketIo = require('socket.io');  // Socket.io for real-time, bidirectional communication between clients and server
const http = require("http");  // Node.js HTTP module for creating the server
const path = require("path"); // Path module for working with file and directory paths
const cluster = require("cluster") // Cluster module for creating child processes (workers) that share the same server port
const os  = require("os") // OS module to provide operating system-related utility methods and properties
const routes = require("./routes") // Importing routes
const { PORT = 3001 , MONGODB_URI } = require("./utils/config"); // Importing configuration variables
const { createChatUser, login } = require("./controllers/chatUserController"); // Importing user-related controller functions
const errorHandler = require("./middlewares/error-handler");  // Custom error handling middleware
const {validateLogIn, validateUserBody} = require("./middlewares/validation")  // Request validation middleware
const { requestLogger, errorLogger } = require("./middlewares/logger"); // Logging middleware

const app = express(); // Initializing Epress Ap

/**
 * Helmet middleware for setting various HTTP headers for security.
 */
app.use(helmet()); 

/**
 * CORS middleware to enable Cross-Origin Resource Sharing for all requests.
 */
app.use(cors());

/**
 * Middleware to parse JSON bodies from incoming requests.
 */
app.use(express.json()); 

/**
 * Middleware for logging incoming requests.
 */
app.use(requestLogger)

/**
 * Setting Mongoose strictQuery to false to prevent deprecation warnings.
 */
mongoose.set("strictQuery", false);

/**
 * Serving static files from "public" folder.
 */
app.use(express.static(path.join(__dirname, 'public'))); 

/**
 * Setting up authentication routes with validation.
 */
app.post("/signin", validateLogIn ,login)
app.post("/signup", validateUserBody, createChatUser)

/**
 * Using the routes module and passing the socket.io instance to it.
 */
const server = http.createServer(app);
const io = socketIo(server);
// app.use(routes(socketIo));
app.use(routes(io));
/**
 * Adding error logging and handling middleware.
 */
app.use(errorLogger)
app.use(errors());// Celebrate error handler 
app.use(errorHandler);

/**
 * Clustering to utilize multiple CPU cores.
 * Master process forks worker processes equal to the number of CPU cores.
 * This setup improves the performance and scalability of the application 
 * by leveraging the full capacity of the server's CPU.
 */
if (cluster.isMaster) {
  const numCPUs = os.cpus().length;  // Get the number of CPU cores
  
  for (let i = 0; i < numCPUs; i += 1) {
    cluster.fork();  // Create a new worker process
  }
  // Listen for dying workers
  cluster.on("exit", (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died with code: ${code} and signal: ${signal}`);
    console.log("Starting a new worker");
    cluster.fork();  // Create a new worker process
  });
} else {
   /**
   * Creating the HTTP server and attaching the socket.io instance to it.
   * This setup allows the worker processes to handle incoming HTTP requests 
   * and real-time communications via Socket.io.
   * Each worker process runs its own instance of the server and handles 
   * a portion of the incoming connections.
   */
  // const server = http.createServer(app);
  // const io = socketIo(server);

   /**
   * Socket.io connection event.
   * Listens for new client connections.
   */
  io.on("connection", (socket) => {
    console.log("New client connected", socket.id);
   /**
   * Event listener for incoming messages.
   * Broadcasts the received message to all clients.
   */
    socket.on("sendMessage", (message) => {
      console.log("Message received from client:", message);
      io.emit("receiveMessage", message); // Broadcasting the message to all clients
    });
    /**
    * Event listener for client disconnection.
    */
    socket.on("disconnect", () => {
      console.log("Client disconnected", socket.id);
    });
  });
  // Connecting to MongoDB and starting the server
  mongoose.connect(MONGODB_URI)
    .then(() => {
      console.log(`DB is connected`);
      server.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
      });
    })
    .catch((e) => console.log("DB ERROR", e));
}

module.exports = app; // Exporting the Express app instance for testing purposes