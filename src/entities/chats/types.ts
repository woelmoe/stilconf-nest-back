import { UUID } from '@entities/types'

export type JsonString = ReturnType<typeof JSON.stringify>

export interface IRegisterUserData {
  userId: UUID
  chatId: string
  token: string | null
}

export interface IRegisteredUsersData {
  tokenInDb: string
  alreadyRegistered: IRegisterUserData[]
}
export interface IOpennedChatData {
  registeredData: IRegisteredUsersData
  registered: boolean
  token: string
  content: string[]
}

export type IOpennedChat = Record<string, IOpennedChatData>

export interface IWebSocketClient {
  userId: string
  send: (data: JsonString) => void
}
