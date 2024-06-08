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
const { PORT = 3001 , MONGODB_URI, NODE_ENV} = require("./utils/config");
const { createChatUser, login } = require("./controllers/chatUserController");
const errorHandler = require("./middlewares/error-handler");
const {validateLogIn, validateUserBody} = require("./middlewares/validation")
const { requestLogger, errorLogger } = require("./middlewares/logger");


const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(requestLogger)

mongoose.set("strictQuery", false);
mongoose.connect(MONGODB_URI)
// .then(
//   () => {
//     console.log(`DB is connected to "${MONGODB_URI}"`);
//   },
//   (e) => console.log("DB ERROR", e),
// );
app.use(express.static(path.join(__dirname, 'public')));

app.post("/signin", validateLogIn ,login)
app.post("/signup", validateUserBody, createChatUser)

app.use(routes(io));

app.use(errorLogger)
app.use(errors());
app.use(errorHandler);

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

// app.listen(PORT)
//   , () => {
//   console.log(`Server is running on port ${PORT}`);
// })

const serverPort = NODE_ENV === "test" ? 3002 : PORT;

server.listen(serverPort, () => {
  if (NODE_ENV !== "test") {
    console.log(`Server is running on port ${serverPort}`);
  }
}).on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`Port ${serverPort} is already in use.`);
  }
});

module.exports = { app, server };
