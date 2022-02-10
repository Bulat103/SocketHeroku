const checkAuth = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    console.log('midle true');
    res.redirect('/user/login');
  }
};

module.exports = { checkAuth };
