import { JsonString } from '@entities/chats/types'

export interface WsResponseCustom<T = any> {
  event: string
  data: T
}

export interface IWebSocketClient {
  userId: string
  send: (data: JsonString) => void
}
