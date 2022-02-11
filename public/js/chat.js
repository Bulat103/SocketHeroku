let HOST = location.origin.replace(/^http/, 'ws')
let ws = new WebSocket(HOST);

ws.onopen = () => { // обработчик события "соединение установлено"
  console.log('connected!');
}

const btn = document.querySelector('#sendMessage');
const text = document.querySelector('#message');
const list = document.querySelector('.list');

btn.addEventListener('click', () => {

  const myMessage = text.value;
  console.log(myMessage);
  text.value = ""
  ws.send(JSON.stringify({ text: myMessage }));
})

ws.onmessage = (event) => {
  const soob = JSON.parse(event.data);
  let newDiv = document.createElement("div");
  newDiv.innerHTML = `<div>${soob.text}</div>`;
  list.prepend(newDiv)
};