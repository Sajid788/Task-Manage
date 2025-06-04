
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Admin privileges required.' });
  }
};

const isOwnerOrAdmin = (req, res, next) => {
  if (
    req.user && (
      req.user.role === 'admin' || 
      req.user._id.toString() === req.params.userId
    )
  ) {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Not authorized to access this resource.' });
  }
};

module.exports = { isAdmin, isOwnerOrAdmin }; 