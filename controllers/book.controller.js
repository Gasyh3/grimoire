const Book = require('../models/book.model');
const fs = require('fs');
const upload = require('../middlewares/multer.middleware');

// Contrôleur pour récupérer tous les livres
const getAllBooks = async (req, res) => {
  try {
    // Récupérer tous les livres de la base de données
    const books = await Book.find();
    return res.status(200).json(books);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erreur serveur.' });
  }
};
// Contrôleur pour récupérer un livre par son ID
const getBookById = async (req, res) => {
    try {
      const bookId = req.params.id;
  
      // Vérifier si l'ID est valide
      if (!mongoose.Types.ObjectId.isValid(bookId)) {
        return res.status(400).json({ message: 'ID de livre invalide.' });
      }
  
      // Récupérer le livre par son ID
      const book = await Book.findById(bookId);
  
      // Vérifier si le livre existe
      if (!book) {
        return res.status(404).json({ message: 'Livre non trouvé.' });
      }
  
      return res.status(200).json(book);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erreur serveur.' });
    }
};
// Contrôleur pour récupérer les 3 livres avec la meilleure note moyenne
const getBestRatedBooks = async (req, res) => {
    try {
      // Récupérer les 3 livres avec la meilleure note moyenne
      const bestRatedBooks = await Book.find()
        .sort({ averageRating: -1 }) // Trier par note moyenne décroissante
        .limit(3); // Limiter à 3 livres
  
      return res.status(200).json(bestRatedBooks);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erreur serveur.' });
    }
};
// Contrôleur pour créer un nouveau livre avec image
const createBook = async (req, res) => {
        const bookObject = JSON.parse(req.body.book);
        delete bookObject._id;
        delete bookObject.userId;
      
        const book = new Book({
          ...bookObject,
          imageUrl: `${req.protocol}://${req.get('host')}/${req.imagePath}`, 
          userId: req.auth.userId,
        });
      
        book.save()
          .then(() => res.status(201).json({ message: 'Livre enregistré avec succès !' })) 
          .catch(error => res.status(400).json({ erreur: error }));
};
// Contrôleur pour mettre à jour un livre par son ID
const updateBookById = async (req, res) => {
    try {
      const bookId = req.params.id;
  
      // Vérifier si l'ID est valide
      if (!mongoose.Types.ObjectId.isValid(bookId)) {
        return res.status(400).json({ message: 'ID de livre invalide.' });
      }
  
      // Récupérer le livre par son ID
      const existingBook = await Book.findById(bookId);
  
      // Vérifier si le livre existe
      if (!existingBook) {
        return res.status(404).json({ message: 'Livre non trouvé.' });
      }
  
      // Si une image est téléchargée, mettre à jour l'ImageUrl
      if (req.file) {
        const image = req.file;
        existingBook.imageUrl = `/uploads/${image.filename}`;
      }
  
      // Si les informations du livre sont fournies dans le corps de la requête
      if (req.body.book) {
        const { book } = req.body;
        // Mettre à jour d'autres propriétés du livre en fonction de ce qui est inclus dans req.body.book
        existingBook.title = book.title || existingBook.title;
        existingBook.author = book.author || existingBook.author;
        existingBook.year = book.year || existingBook.year;
        existingBook.genre = book.genre || existingBook.genre;
        // Ajouter la logique pour mettre à jour d'autres propriétés du livre si nécessaire
      }
  
      // Enregistrer les modifications dans la base de données
      await existingBook.save();
  
      return res.status(200).json({ message: 'Livre mis à jour avec succès.' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erreur serveur.' });
    }
};
// Contrôleur pour supprimer un livre par son ID avec l'image associée
const deleteBookAndImageById = async (req, res) => {
    try {
      const bookId = req.params.id;
  
      // Vérifier si l'ID est valide
      if (!mongoose.Types.ObjectId.isValid(bookId)) {
        return res.status(400).json({ message: 'ID de livre invalide.' });
      }
  
      // Récupérer le livre par son ID
      const bookToDelete = await Book.findById(bookId);
  
      // Vérifier si le livre existe
      if (!bookToDelete) {
        return res.status(404).json({ message: 'Livre non trouvé.' });
      }
  
      // Supprimer l'image associée du système de fichiers
      if (bookToDelete.imageUrl) {
        const imagePath = path.join(__dirname, '..', 'public', bookToDelete.imageUrl);
        fs.unlinkSync(imagePath);
      }
  
      // Supprimer le livre de la base de données
      await Book.findByIdAndRemove(bookId);
  
      return res.status(200).json({ message: 'Livre supprimé avec succès.' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erreur serveur.' });
    }
  };
// Contrôleur pour ajouter une note à un livre par son ID
const addRatingToBookById = async (req, res) => {
    try {
      const bookId = req.params.id;
      const { userId, rating } = req.body;
  
      // Vérifier si l'ID du livre est valide
      if (!mongoose.Types.ObjectId.isValid(bookId)) {
        return res.status(400).json({ message: 'ID de livre invalide.' });
      }
  
      // Récupérer le livre par son ID
      const bookToUpdate = await Book.findById(bookId);
  
      // Vérifier si le livre existe
      if (!bookToUpdate) {
        return res.status(404).json({ message: 'Livre non trouvé.' });
      }
  
      // Vérifier si la note est valide (entre 0 et 5)
      if (rating < 0 || rating > 5) {
        return res.status(400).json({ message: 'La note doit être comprise entre 0 et 5.' });
      }
  
      // Vérifier si l'utilisateur a déjà noté ce livre
      const existingRating = bookToUpdate.ratings.find((r) => r.userId === userId);
  
      if (existingRating) {
        return res.status(400).json({ message: 'L\'utilisateur a déjà noté ce livre.' });
      }
  
      // Ajouter la nouvelle note à l'array "ratings" du livre
      bookToUpdate.ratings.push({ userId, grade: rating });
  
      // Mettre à jour la note moyenne "averageRating"
      const totalRatings = bookToUpdate.ratings.length;
      const totalGrade = bookToUpdate.ratings.reduce((sum, rating) => sum + rating.grade, 0);
      bookToUpdate.averageRating = totalRatings === 0 ? 0 : totalGrade / totalRatings;
  
      // Enregistrer les modifications dans la base de données
      await bookToUpdate.save();
  
      return res.status(200).json({ message: 'Note ajoutée avec succès.', book: bookToUpdate });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erreur serveur.' });
    }
  };  

module.exports = {
  getAllBooks,
  getBookById,
  getBestRatedBooks,
  createBook,
  updateBookById,
  deleteBookAndImageById,
  addRatingToBookById,
};
