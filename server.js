require("dotenv").config();
const express = require('express');
const helmet = require("helmet");
const mongoose = require("mongoose");
const cors = require("cors");
const { errors } = require("celebrate");
const routes = require("./routes")
const { PORT = 3001 , MONGODB_URI} = require("./utils/config");
const { createChatUser, login } = require("./controllers/chatUserController");
const errorHandler = require("./middlewares/error-handler");
const { requestLogger, errorLogger } = require("./middlewares/logger");


const app = express();
app.use(helmet());

mongoose.set("strictQuery", false);
mongoose.connect(MONGODB_URI)
.then(
  () => {
    console.log(`DB is connected to "${MONGODB_URI}"`);
  },
  (e) => console.log("DB ERROR", e),
);

app.use(cors());
app.use(express.json());

app.use(requestLogger)

app.post("/signin", login)
app.post("/signup", createChatUser)

app.use(routes);

app.use(errorLogger)
app.use(errors());
app.use(errorHandler);

app.listen((PORT)
  , () => {
  console.log(`Server is running on port ${PORT}`);
})
