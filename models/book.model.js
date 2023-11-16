const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schéma pour le modèle Book
const bookSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  genre: {
    type: String,
    required: true,
  },
  ratings: [
    {
      userId: {
        type: String,
        required: true,
      },
      grade: {
        type: Number,
        required: true,
      },
    },
  ],
  averageRating: {
    type: Number,
    default: 0, // Note moyenne par défaut
  },
});

// Créer et exporter le modèle Book
const Book = mongoose.model('Book', bookSchema);
module.exports = Book;
