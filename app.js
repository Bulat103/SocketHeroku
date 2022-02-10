/* eslint-disable camelcase */
const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const WebSocket = require('ws');
// const postRouter = require('./routes/postRouter');
// const userRouter = require('./routes/userRouter');
const chatRouter = require('./routes/chatRouter')
// const { Post, User } = require('./db/models');
const { Message } = require('./db/models')


const app = express();
const PORT = 3000;

app.set('view engine', 'hbs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

const wss = new WebSocket.Server({ port: 9077 });

wss.on('connection', (client) => {
  client.on('message', async (data) => {
    let message = JSON.parse(data);
    await Message.create({ body: message.text })
    wss.clients.forEach((client) => {
      client.send(JSON.stringify(message));
    })
  });

  // client.send('something');
});


app.use(session({
  store: new FileStore(),
  secret: 'tweet',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false },
  name: 'authorisation',
}));

app.use((req, res, next) => {
  res.locals.username = req.session?.user;
  res.locals.userid = req.session?.userid;
  next();
});

app.get('/', async (req, res) => {
  res.redirect('/chat');
});

app.use('/chat', chatRouter);
// app.use('/user', userRouter);
// app.use('/post', postRouter);

app.listen(PORT);
