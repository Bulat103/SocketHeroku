require('dotenv').config()
const express = require('express');
const { Server } = require('ws');
const chatRouter = require('./routes/chatRouter')
const { Message } = require('./db/models')

const PORT = process.env.PORT || 3000;
const INDEX = '/index.html';


const server = express()
  .use(express.urlencoded({ extended: true }))
  .use(express.json())
  .use(express.static('public'))
  .set('view engine', 'hbs')
  .use('/chat', chatRouter)
  // .use((req, res) => res.render('chat'))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));


const wss = new Server({ server });


wss.on('connection', (ws) => {
  console.log('Client connected');
  ws.on('message', async (data) => {
    console.log('client send message');
    const messageFromUser = JSON.parse(data);
    console.log(messageFromUser);
    await Message.create({ body: messageFromUser.text });
    wss.clients.forEach((client) => {
      client.send(JSON.stringify(messageFromUser));
    });
  });
  ws.on('close', () => console.log('Client disconnected'));
});

// setInterval(() => {
//   wss.clients.forEach((client) => {
//     client.send(new Date().toTimeString());
//   });
// }, 1000);

