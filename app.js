require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const path = require("path");
const cors = require("cors");
const helmet = require("helmet");
const bcrypt = require('bcrypt');

const app = express();

/**
 * * Connexion à la base de données
 */
mongoose.connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_LINK}?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );  

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

app.use("/images", express.static(path.join(__dirname, "images")));


module.exports = app;
