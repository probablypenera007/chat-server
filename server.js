require("dotenv").config();
const express = require('express');
const mongoose = require("mongoose");
const { PORT = 3001 , MONGODB_URI} = require("./utils/config");


const app = express();

mongoose.set("strictQuery", false);
mongoose.connect(MONGODB_URI)
.then(
  () => {
    console.log(`DB is connected to "${MONGODB_URI}"`);
  },
  (e) => console.log("DB ERROR", e),
);


app.listen((PORT)
  , () => {
  console.log(`Server is running on port ${PORT}`);
})
