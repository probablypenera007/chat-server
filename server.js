require("dotenv").config();
const express = require('express');
const helmet = require("helmet");
const mongoose = require("mongoose");
const cors = require("cors");
const { errors } = require("celebrate");
const socketIo = require('socket.io');
const http = require("http");
const path = require("path");
const cluster = require("cluster")
const os  = require("os")
const routes = require("./routes")
const { PORT = 3001 , MONGODB_URI } = require("./utils/config");
const { createChatUser, login } = require("./controllers/chatUserController");
const errorHandler = require("./middlewares/error-handler");
const {validateLogIn, validateUserBody} = require("./middlewares/validation")
const { requestLogger, errorLogger } = require("./middlewares/logger");

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(requestLogger)

mongoose.set("strictQuery", false);
app.use(express.static(path.join(__dirname, 'public')));

app.post("/signin", validateLogIn ,login)
app.post("/signup", validateUserBody, createChatUser)

app.use(routes(socketIo));

app.use(errorLogger)
app.use(errors());
app.use(errorHandler);

if (cluster.isMaster) {
  const numCPUs = os.cpus().length;
  
  for (let i = 0; i < numCPUs; i += 1) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died with code: ${code} and signal: ${signal}`);
    console.log("Starting a new worker");
    cluster.fork();
  });
} else {
  const server = http.createServer(app);
  const io = socketIo(server);

  io.on("connection", (socket) => {
    console.log("New client connected", socket.id);

    socket.on("sendMessage", (message) => {
      console.log("Message received from client:", message);
      io.emit("receiveMessage", message); 
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected", socket.id);
    });
  });

  mongoose.connect(MONGODB_URI)
    .then(() => {
      console.log(`DB is connected`);
      server.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
      });
    })
    .catch((e) => console.log("DB ERROR", e));
}

module.exports = app;