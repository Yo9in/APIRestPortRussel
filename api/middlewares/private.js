const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY;

exports.checkJWT = async (req, res, next) => {
  const token = req.cookies.token; // ✅ On lit le token posé dans le cookie

  if (!token) {
    return res.status(401).send('token_required');
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded.user;
    next(); // ✅ Passe au contrôleur suivant (ex: dashboard)
  } catch (err) {
    return res.status(403).send('token_invalid');
  }
};
