import { UUID } from '@entities/types'

export type JsonString = ReturnType<typeof JSON.stringify>

export interface IRegisterUserData {
  userId: UUID
  chatId: string
  token: string | null
}

export interface IOpennedChat {
  registeredData: {
    tokenInDb: string
    alreadyRegistered: IRegisterUserData[]
  }
  registered: boolean
  token: string
  content: string[]
}
