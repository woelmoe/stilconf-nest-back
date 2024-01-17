import { Chat } from '@entities/chats/chat.entity'
import { ChatService } from '@entities/chats/chat.service'
import { IWebSocketClient, JsonString } from '@entities/chats/types'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse
} from '@nestjs/websockets'
import { Socket } from 'net'
import { from, Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { Repository } from 'typeorm'
import { Server } from 'ws'

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
    this.broadcastAllExcludeClient(client.userId, {
      event: 'RemovePeer',
      data: { peerId: client.userId }
    })
  }

  @SubscribeMessage('Join')
  async onJoin(client: IWebSocketClient, data: any): Promise<WsResponse<any>> {
    try {
      const { userId, bitrate, roomId } = data
      this.addClient(client, userId)
      await this.ChatService.handleRegisterUser({
        userId,
        chatId: roomId,
        token: null
      })
      this.broadcastAllExcludeClient(userId, {
        event: 'AddPeer',
        data: {
          peerId: userId,
          createOffer: false
        }
      })
      return {
        event: 'AddPeer',
        data: this.ChatService.getOpennedChats[
          roomId
        ].registeredData.alreadyRegistered.map((user) => ({
          peerId: user.userId,
          createOffer: true
        }))
      }
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

  @SubscribeMessage('Leave')
  async onLeave(client: IWebSocketClient, data: any): Promise<WsResponse<any>> {
    try {
      const { roomId } = data
      const leaveUserId = client.userId
      this.ChatService.removeUser(roomId, leaveUserId)
      this.broadcastAllExcludeClient(leaveUserId, {
        event: 'RemovePeer',
        data: { peerId: leaveUserId }
      })
      if (!this.ChatService.getOpennedChats[roomId])
        return {
          event: 'Leave',
          data: {
            error: 'Empty userlist'
          }
        }
      const newRegisteredList = this.ChatService.getOpennedChats[
        roomId
      ].registeredData.alreadyRegistered.map((user) => ({
        peerId: user.userId
      }))
      return {
        event: 'Leave',
        // data: 'newRegisteredList'
        data: newRegisteredList
      }
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

  async broadcastAllExcludeClient(senderId: string, data: WsResponse<any>) {
    // Рассылка сообщения всем клиентам, кроме отправителя
    console.log('senderId', senderId)
    this.server.clients.forEach((client: IWebSocketClient) => {
      if (senderId !== client.userId) client.send(JSON.stringify(data))
    })
  }

  addClient(client: IWebSocketClient, userId: string) {
    client.userId = userId
  }
}
