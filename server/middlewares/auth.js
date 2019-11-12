import jwt from 'jsonwebtoken';
import config from 'config';

const isAuthenticated = (req, res, next) => {
  const token = req.header('x-auth-token');

  if (!token) {
    return res.status(401).json({
      status: 401,
      msg: 'Access denied! provide the token'
    });
  }

  try {
    const decoded = jwt.verify(token, config.get('jwtSecret'));
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

export default isAuthenticated;
