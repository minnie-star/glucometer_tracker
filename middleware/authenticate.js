const isAuthenticated = (req, res, next) => {
  if (!req.session || !req.session.user) {
    return res.status(401).json({ message: "You do not have access to this resource" });
  }
  next();
};

module.exports = isAuthenticated;
