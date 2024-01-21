import { Chat } from '@entities/chats/chat.entity'
import { ChatService } from '@entities/chats/chat.service'
import { JsonString } from '@entities/chats/types'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from '@nestjs/websockets'
import { Socket } from 'net'
import { from, Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { Repository } from 'typeorm'
import { Server } from 'ws'
import { IWebSocketClient, WsResponseCustom } from './types'
import { ChatMessageDto } from '@entities/chats/dto/updateChat.dto'

@WebSocketGateway({
  cors: {
    origin: true,
    credentials: true
  },
  allowEIO3: true
})
@Injectable()
export class EventsGateway implements OnGatewayDisconnect {
  @WebSocketServer()
  private server: Server

  constructor(private readonly ChatService: ChatService) {}

  handleDisconnect(client: IWebSocketClient) {
    this.broadcast(
      {
        event: 'RemovePeer',
        data: { peerId: client.userId }
      },
      {
        exceptSender: true,
        senderId: client.userId
      }
    )
    this.broadcastAllChats()
  }

  @SubscribeMessage('Join')
  async onJoin(
    client: IWebSocketClient,
    data: any
  ): Promise<WsResponseCustom<any>> {
    try {
      // console.log('join', data)
      const { userId, username, bitrate, roomId } = data
      this.addClient(client, userId)
      await this.ChatService.handleRegisterUser({
        username,
        userId,
        chatId: roomId,
        token: null
      })
      // console.log(
      //   'this.ChatService.getOpennedChats',
      //   this.ChatService.getOpennedChats
      // )
      this.broadcast(
        {
          event: 'AddPeer',
          data: {
            peerId: userId,
            createOffer: false
          }
        },
        {
          exceptSender: true,
          senderId: client.userId
        }
      )
      this.broadcastAllChats()
      const allChats = await this.ChatService.getAllChats()
      const currentRoom = allChats.find((chat) => chat.chatId === roomId)
      let roomUsers = {}
      currentRoom.registeredUsers.forEach((user) => {
        roomUsers[user.userId] = Symbol()
        client.send(
          JSON.stringify({
            event: 'AddPeer',
            data: {
              peerId: user.userId,
              createOffer: true
            }
          })
        )
      })
      this.server.clients.forEach((c) => {
        if (c.userId in roomUsers) {
          client.send(
            JSON.stringify({
              event: 'AddPeer',
              data: {
                peerId: client.userId,
                createOffer: false
              }
            })
          )
        }
      })
    } catch (error) {
      console.log(error)
      return {
        event: 'Join',
        data: {
          error: 'internal error'
        }
      }
    }
  }

  @SubscribeMessage('Leave')
  async onLeave(
    client: IWebSocketClient,
    data: any
  ): Promise<WsResponseCustom<any>> {
    try {
      const { roomId } = data
      const leaveUserId = client.userId
      this.ChatService.removeUser(roomId, leaveUserId)
      this.broadcast(
        {
          event: 'RemovePeer',
          data: { peerId: leaveUserId }
        },
        {
          exceptSender: true,
          senderId: client.userId
        }
      )
      this.broadcastAllChats()
      if (!this.ChatService.getOpennedChats[roomId])
        return {
          event: 'Leave',
          data: {
            error: 'Empty userlist'
          }
        }
      const allChats = await this.ChatService.getAllChats()
      const currentRoom = allChats.find((chat) => chat.chatId === roomId)
      let roomUsers = {}
      currentRoom.registeredUsers.forEach((user) => {
        roomUsers[user.userId] = Symbol()
        client.send(
          JSON.stringify({
            event: 'RemovePeer',
            data: {
              peerId: user.userId,
              createOffer: true
            }
          })
        )
      })
      this.server.clients.forEach((c) => {
        if (c.userId in roomUsers) {
          c.send(
            JSON.stringify({
              event: 'RemovePeer',
              data: {
                peerId: client.userId,
                createOffer: false
              }
            })
          )
        }
      })
    } catch (error) {
      console.log(error)
      return {
        event: 'Leave',
        data: {
          error: 'internal error'
        }
      }
    }
  }

  @SubscribeMessage('GetRooms')
  async onGetRooms() {
    const allChats = await this.ChatService.getAllChats()
    return {
      event: 'GetRooms',
      data: allChats
    }
  }

  @SubscribeMessage('RelaySDP')
  async onRelaySDP(client: IWebSocketClient, data: any) {
    try {
      const { peerId, sessionDescription } = data
      // console.log('this.server.clients', this.server.clients)
      let receiver
      this.server.clients.forEach((client: IWebSocketClient) => {
        if (client.userId === peerId) receiver = client
      })
      if (receiver) {
        receiver.send(
          JSON.stringify({
            event: 'SessionDescription',
            data: {
              peerId,
              sessionDescription
            }
          })
        )
      } else {
        return {
          event: 'RelaySDP',
          data: {
            error: 'Receiver is not found'
          }
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  @SubscribeMessage('RelayICE')
  async onRelayICE(client: IWebSocketClient, data: any) {
    try {
      const { peerId, iceCandidate } = data
      let receiver
      this.server.clients.forEach((client: IWebSocketClient) => {
        if (client.userId === peerId) receiver = client
      })
      if (receiver) {
        receiver.send(
          JSON.stringify({
            event: 'ICE_CANDIDATE',
            data: {
              peerId,
              iceCandidate
            }
          })
        )
      } else {
        return {
          event: 'RelaySDP',
          data: {
            error: 'Receiver is not found'
          }
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  @SubscribeMessage('BroadcastMessage')
  async onBroadcastMessage(client: IWebSocketClient, data: ChatMessageDto) {
    const newMessage: InstanceType<typeof ChatMessageDto> = {
      userId: data.userId,
      username: data.username,
      content: data.content,
      date: data.date,
      chatId: data.chatId
    }
    const content = JSON.stringify(newMessage)
    this.ChatService.saveMessageToHistory(data.chatId, content)
    this.broadcast({ event: 'OnMessage', data: newMessage })
  }

  async broadcast(
    data: WsResponseCustom<any>,
    options?: {
      exceptSender: boolean
      senderId: string
    }
  ) {
    // Рассылка сообщения всем клиентам, кроме отправителя
    this.server.clients.forEach((client: IWebSocketClient) => {
      console.log(client.userId, options?.senderId)
      const sendFlag = options?.exceptSender
        ? options?.senderId !== client.userId
        : true
      if (sendFlag) {
        client.send(JSON.stringify(data))
      }
    })
  }

  addClient(client: IWebSocketClient, userId: string) {
    client.userId = userId
  }

  async broadcastAllChats() {
    const allChats = await this.ChatService.getAllChats()
    this.broadcast({
      event: 'GetRooms',
      data: allChats
    })
  }
}
