const jwt = require('jsonwebtoken');

const protectRoute = (req, res, next) => {
  const token = req.headers.token?.split(' ')[1];
  console.log(token)
  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; 
    next();
  } catch (error) {
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

module.exports = protectRoute;
