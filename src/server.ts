import express from "express";
import server from "http";
import { Server } from "socket.io";

const app = express();

app.get('/', (req, res) => {
  res.send('<h1>Api v1</h1>')
})

const serverHttp = server.createServer(app);
const io = new Server(serverHttp, {
  cors: { origin: "http://localhost:3000" }
});

io.on('connection', socket => {
  console.log('Conectado', socket.id);

  socket.on('disconnect', reason => {
    console.log('Usuário desconectado', socket.id);
  })

  socket.on('set_username', username => {
    socket.data.username = username;
  })

  socket.on('message', text => {
    io.emit('received_message', {
      text,
      authorId: socket.id,
      author: socket.data.username || '',
      messageId: new Date().getTime(),
    });
  })
})

serverHttp.listen(3333, () => {
  console.log('Server listening on 3333');
})
