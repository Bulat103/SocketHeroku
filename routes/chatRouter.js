
const express = require('express');
const router = express.Router();
const { Message } = require('../db/models')

router.get('/', async (req, res) => {
  console.log("router work on /");
  res.redirect('/chat')
})

router.get('/chat', async (req, res) => {
  const message = await Message.findAll();
  console.log("router work on /chat");
  res.render('chat', { message })
});

module.exports = router