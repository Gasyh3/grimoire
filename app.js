require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const path = require("path");
const cors = require("cors");
const helmet = require("helmet");
const bodyParser = require("body-parser");

const userRoutes = require('./routes/user.route');
const bookRoutes = require('./routes/book.route');

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
  ).then(() => {
    console.log('Connexion à MongoDB réussie');
  })
  .catch((error) => console.error('Erreur de connexion à MongoDB:', error));
 
// Configurations for "body-parser"
app.use(
    bodyParser.urlencoded({
      extended: true,
    })
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

// Routes
app.use(userRoutes);
app.use(bookRoutes);

module.exports = app;
