const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY;

exports.checkJWT = async (req, res, next) => {
  // ✅ On tente d'extraire le token depuis le cookie ou le header Authorization
  const token =
    req.cookies.token || 
    (req.headers.authorization && req.headers.authorization.split(' ')[1]);

  if (!token) {
    return res.status(401).send('token_required');
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded.user;
    next(); // ✅ Passe au contrôleur suivant
  } catch (err) {
    return res.status(403).send('token_invalid');
  }
};
