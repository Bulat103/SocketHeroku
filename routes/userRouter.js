/* eslint-disable arrow-body-style */
const express = require('express');
const sha256 = require('sha256');
const { User, Post } = require('../db/models');
const { checkAuth } = require('../middlewares/auth');

const router = express.Router();

router.get('/registration', (req, res) => {
  res.render('registration');
});

router.get('/login', (req, res) => {
  res.render('login');
});

router.get('/index', checkAuth, async (req, res) => {
  const post = await Post.findAll({ include: User, raw: true, order: [['updatedAt', 'DESC']] });
  res.render('index', { post });
});

// -----------------------------------------------------
// http://localhost:3000/user/registration
router.post('/registration', async (req, res) => {
  const {
    name, email, password, repeatPassword,
  } = req.body;
  if (password === repeatPassword) {
    const r = await User.findOne({ where: { email }, raw: true });
    if (r) {
      return res.render('registration', { text: 'Пользователь с такой почтой уже существет' });
    }
    await User.create({
      name, email, password: sha256(password),
    });
    return res.redirect('/user/login');
  }
  res.send('Пароли не совпадают');
});

//------------------------------------------------------
// http://localhost:3000/user/login/
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email }, raw: true });
  if (user) {
    if (user.password === sha256(password)) {
      req.session.user = user.name;
      req.session.userid = user.id;
      return res.redirect('/user/index');
    }
    return res.render('login', { text: 'Wrong password' });
  }
  return res.render('login', { text: 'there is no such user' });
});

//---------------------------------------------------------
// http://localhost:3000/user/profile/
router.get('/profile', checkAuth, async (req, res) => {
  const post = await Post.findAll({
    include: User, raw: true, order: [['updatedAt', 'DESC']], where: { user_id: req.session.userid },
  });
  console.log(post);
  req.session.profile = true;
  res.render('index', { post });
});

//---------------------------------------------------------
// http://localhost:3000/user/logout/
router.get('/logout', (req, res) => {
  // разрушается сессия
  req.session.destroy();
  res.clearCookie('authorisation');
  res.redirect('/');
});
module.exports = router;
