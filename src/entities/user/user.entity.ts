import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { NetworkPerformanceSpeed, UUID } from './types'

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: 'user_id', type: 'varchar' })
  userId: UUID

  @Column({ name: 'username', type: 'varchar' })
  username: string

  @Column({
    name: 'speed',
    type: 'enum',
    enum: NetworkPerformanceSpeed
  })
  speed: string

  @Column({ name: 'created_at', type: 'timestamp', nullable: true })
  createdAt: Date
}
