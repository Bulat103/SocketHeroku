
const express = require('express');
const router = express.Router();
const { Message } = require('../db/models')

router.get('/', async (req, res) => {
  const message = await Message.findAll();
  console.log(message);
  res.render('chat', { message });
});

module.exports = router