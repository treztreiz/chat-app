import http from 'http'
import { Server } from 'socket.io'

const server = http.createServer()
const io = new Server(server, {
  cors: {
    origin: 'http://127.0.0.1:5173'
  }
})

io.use((socket, next) => {
  const username = socket.handshake.auth.username
  if (!username) {
    return next(new Error('invalid username'))
  }
  socket.username = username
  next()
})

io.on('connection', (socket) => {
  // fetch existing users including connecting one
  const users = []
  for (const [id, socket] of io.of('/').sockets) {
    users.push({
      id,
      username: socket.username
    })
  }
  socket.emit('users', users)

  socket.broadcast.emit('user connected', {
    id: socket.id,
    username: socket.username
  })

  socket.on('private message', ({ content, to }) => {
    socket.to(to).emit('private message', {
      content,
      from: socket.id
    })
  })

  socket.on('disconnect', () => {
    socket.broadcast.emit('user disconnected', socket.id)
  })
})

const PORT = process.env.PORT || 3000

server.listen(PORT, () => {
  console.log(`server listening at http://localhost:${PORT}`)
})
