
let socket = new WebSocket(`ws://bulatsfirstapp.herokuapp.com:8000`); //Fix: use window.location for adress


socket.onopen = () => {
  console.log('connected');
}


socket.onmessage = (message) => {
  const d = JSON.parse(message.data)
  document.querySelector('.list').innerHTML += `<div>${d.text}</div>`
  document.querySelector('.messages').value = ""
}

document.getElementById('btn').addEventListener('click', () => {
  const message = document.querySelector('.messages').value;
  socket.send(JSON.stringify({ text: message }))
})