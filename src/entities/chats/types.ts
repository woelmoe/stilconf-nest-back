// export enum E_Gender {
//   Male = 'm',
//   Female = 'f',
// }

import { UUID } from '@entities/types'

export type JsonString = ReturnType<typeof JSON.stringify>

export interface IRegisterUserData {
  userId: UUID
  chatId: string
  token: string | null
}
