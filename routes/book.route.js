const express = require('express');
const router = express.Router();
const BookController = require('../controllers/book.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const upload = require('../middlewares/multer.middleware');


// Route pour récupérer tous les livres
router.get('/api/books', BookController.getAllBooks);
// Route pour récupérer un livre par son ID
router.get('/api/books/:id', BookController.getBookById);
// Route pour récupérer les 3 livres avec la meilleure note moyenne
router.get('/api/books/bestrating', BookController.getBestRatedBooks);
// Route pour créer un nouveau livre avec image
router.post('/api/books', authMiddleware, upload, BookController.createBook);
// Route pour mettre à jour un livre par son ID
router.put('/api/books/:id', authMiddleware, upload, BookController.updateBookById);
// Route pour supprimer un livre par son ID avec l'image associée
router.delete('/api/books/:id/', authMiddleware, BookController.deleteBookAndImageById);
// Route pour ajouter une note à un livre par son ID
router.post('/api/books/:id/rating', authMiddleware, BookController.addRatingToBookById);

module.exports = router;
