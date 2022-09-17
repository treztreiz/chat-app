import { io } from 'socket.io-client'

const URL = 'http://localhost:3000'
const socket = io(URL, { autoConnect: false })

socket.onAny((e, ...args) => {
  console.log(e, args)
})

export default socket
