import { Injectable } from '@nestjs/common'
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse
} from '@nestjs/websockets'
import { from, Observable } from 'rxjs'
import { map } from 'rxjs/operators'
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

  @SubscribeMessage('join')
  onEvent(client: any, data: any): WsResponse<any> {
    console.log(data)
    return {
      event: 'join',
      data: {
        dfdfd: 'prinyal'
      }
    }
  }
}
