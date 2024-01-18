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
  async onJoin(
    client: IWebSocketClient,
    data: any
  ): Promise<WsResponseCustom<any>> {
    try {
      const { userId, bitrate, roomId } = data
      this.addClient(client, userId)
      await this.ChatService.handleRegisterUser({
        userId,
        chatId: roomId,
        token: null
      })
      console.log(
        'this.ChatService.getOpennedChats',
        this.ChatService.getOpennedChats
      )
      this.broadcastAllExcludeClient(userId, {
        event: 'AddPeer',
        data: {
          peerId: userId,
          createOffer: false
        }
      })
      const opennedChats = this.ChatService.getOpennedChats[roomId]
      if (opennedChats)
        return {
          event: 'AddPeer',
          data: opennedChats.registeredData.alreadyRegistered.map((user) => ({
            peerId: user.userId,
            createOffer: true
          }))
        }
      else {
        return {
          event: 'Leave',
          data: {
            error: 'internal error'
          }
        }
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
  async onLeave(
    client: IWebSocketClient,
    data: any
  ): Promise<WsResponseCustom<any>> {
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
      console.log('this.server.clients', this.server.clients)
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
        return {
          event: 'RelaySDP',
          data: {
            result: 'ok'
          }
        }
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
        return {
          event: 'RelaySDP',
          data: {
            result: 'ok'
          }
        }
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

  async broadcastAllExcludeClient(
    senderId: string,
    data: WsResponseCustom<any>
  ) {
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
