/* eslint-disable no-plusplus */
/* eslint-disable camelcase */
/* eslint-disable no-await-in-loop */
const express = require('express');
const { checkAuth } = require('../middlewares/auth');
const { Post } = require('../db/models');

const router = express.Router();

//---------------------------------------------------------
// http://localhost:3000/cost/
router.get('/cost/:id', checkAuth, (req, res) => {
  const postId = req.params.id;
  res.render('post', { postId });
});

//---------------------------------------------------------
// http://localhost:3000/post/new
router.post('/new', checkAuth, async (req, res) => {
  const { title } = req.body;
  const user_id = req.session.userid;
  try {
    await Post.create({ title, user_id });
    res.redirect('/user/index');
  } catch (error) {
    console.log(error);
  }
});

//---------------------------------------------------------
// http://localhost:3000/post/:id
router.delete('/:id', checkAuth, async (req, res) => {
  try {
    await Post.destroy({ where: { id: req.params.id } });
  } catch (error) {
    console.log(error);
    return res.json({ isDeleteSuccessful: false, errorMessage: 'Не удалось удалить запись из базы данных.' });
  }
  return res.status(200).json({ isDeleteSuccessful: true });
});

//---------------------------------------------------------
// http://localhost:3000/post
router.put('/', checkAuth, async (req, res) => {
  const { title } = req.body;
  try {
    await Post.update({ title }, {
      where: {
        id: req.body.postId,
      },
    });
  } catch (error) {
    console.log(error);
  }
  return res.sendStatus(200);
});

//---------------------------------------------------------
// http://localhost:3000/post/like
router.post('/like', async (req, res) => {
  const { postId } = req.body;
  const post = await Post.findOne({ where: { id: postId }, raw: true });
  const amount = post.likes + 1;
  try {
    await Post.update({ likes: amount }, {
      where: {
        id: postId,
      },
    });
  } catch (error) {
    console.log(error);
  }
  return res.status(200).json({ isDeleteSuccessful: true, amount });
});
module.exports = router;
