require('dotenv').config();
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
   try {
    // Récupérer le token d'authentification du header
    const token = req.headers.authorization.split(' ')[1];

    // Vérifier si le token est présent
    if (!token) {
      return res.status(401).json({ message: 'Accès non autorisé. Token manquant.' });
    }

  
    // Vérifier la validité du token
    const decoded = jwt.verify(token, process.env.RANDOM_TOKEN_SECRET);
    // Ajouter l'ID de l'utilisateur décodé à l'objet de requête
    req.user = {
      userId: decoded.userId,
    };

    // Passer à la prochaine étape du middleware
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: 'Accès non autorisé. Token invalide.' });
  }
};
