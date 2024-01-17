import { Chat } from '@entities/chats/chat.entity'
import { ChatService } from '@entities/chats/chat.service'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse
} from '@nestjs/websockets'
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
export class EventsGateway {
  @WebSocketServer()
  server: Server

  constructor(private readonly ChatService: ChatService) {}

  @SubscribeMessage('join')
  async onEvent(client: any, data: any): Promise<WsResponse<any>> {
    console.log(data)
    try {
      const { userId, bitrate, roomId } = data
      const registeredData = await this.ChatService.handleRegisterUser({
        userId,
        chatId: roomId,
        token: null
      })
      console.log(registeredData)
      console.log(
        this.ChatService.getOpennedChats.registeredData.registeredData
      )
      return {
        event: 'AddPeer',
        data: {
          dfdfd: 'prinyal'
        }
      }
    } catch (error) {
      return {
        event: 'join',
        data: {
          error: 'wrong data format'
        }
      }
    }
  }
}
