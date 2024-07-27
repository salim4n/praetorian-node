import { NextApiRequest, NextApiResponse } from 'next'
import { Server as NetServer } from 'http'
import { Server as SocketIOServer } from 'socket.io'
import { Socket } from 'net'

interface NextApiResponseWithSocket extends NextApiResponse {
  socket: Socket & {
    server: NetServer & {
      io?: SocketIOServer
    }
  }
}

export default function handler(req: NextApiRequest, res: NextApiResponseWithSocket) {
  if (!res.socket.server.io) {
    console.log('Setting up socket.io')
    const io = new SocketIOServer(res.socket.server)
    res.socket.server.io = io

    io.on('connection', (socket) => {
      console.log('a user connected')

      socket.on('signal', (data) => {
        socket.broadcast.emit('signal', data)
      })

      socket.on('disconnect', () => {
        console.log('user disconnected')
      })
    })
  }
  res.end()
}
