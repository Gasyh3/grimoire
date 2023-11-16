const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Définir le schéma de l'utilisateur
const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true, // L'adresse e-mail doit être unique
    lowercase: true, // Convertir l'e-mail en minuscules
    trim: true, // Supprimer les espaces avant et après l'adresse e-mail
  },
  password: {
    type: String,
    required: true,
  },
});

// Créer et exporter le modèle utilisateur
const User = mongoose.model('User', userSchema);
module.exports = User;
