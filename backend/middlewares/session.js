//cheack that the session
export const sessionVerified = (req, res, next) => {
  if (req.session.userId) {
    req.usuario = {
      id: req.session.userId,
      username: req.session.username,
    };
    return next();
  } else {
    return res.status(401).json({
      loggedIn: false,
      message: "account not active",
    });
  }
};

//Check that the role is admin
export const rolAdmVerified = (req, res, next) => {
  if (req.session.rol !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied: requires administrator privileges",
    });
  }
  next();
};
