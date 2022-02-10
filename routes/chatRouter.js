
const express = require('express');
const router = express.Router();
const { Message } = require('../db/models')

router.get('/', async (req, res) => {
  const message = await Message.findAll();
  res.render('chat', { message });
});

module.exports = router