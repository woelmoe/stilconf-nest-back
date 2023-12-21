import { UUID } from '@entities/types'

export enum NetworkPerformanceSpeed {
  low = '100kb',
  mid = '500kb',
  high = '2mb'
}

export interface IUser {
  id: UUID
  username: string
  network_performance_speed: string
  created_at: Date
}

export interface ISetUser {
  username: string
  network_performance_speed: string
}
