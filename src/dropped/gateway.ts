import { ChatService } from '@entities/chats/chat.service'
import { Server } from 'socket.io'

export class Gateway {
  socketServer: Server
  private clients: Record<string, any>
  chatService: ChatService

  constructor() {
    this.clients = {}
    this.socketServer = new Server(8080, {
      cors: {
        origin: '*'
      }
    })

    this.socketServer.on('connection', (socket) => {
      console.log('socket connected')
      console.log(socket.id)
      this.clients[socket.id] = socket
      console.log(this.clients)
      socket.on('disconnect', () => {
        console.log('user disconnected')
      })
    })

    console.log('gateway inited')
  }

  public get getClients() {
    return this.clients
  }
}
