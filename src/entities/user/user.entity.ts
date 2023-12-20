import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { NetworkPerformanceSpeed } from './types'
import { ApiProperty } from '@nestjs/swagger'

@Entity('users')
export class User {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number

  @ApiProperty()
  @Column({ name: 'user_id', type: 'varchar' })
  userId: string

  @ApiProperty()
  @Column({ name: 'username', type: 'varchar' })
  username: string

  @ApiProperty()
  @Column({
    name: 'speed',
    type: 'enum',
    enum: NetworkPerformanceSpeed
  })
  speed: NetworkPerformanceSpeed

  @ApiProperty()
  @Column({ name: 'created_at', type: 'timestamp', nullable: true })
  createdAt: Date
}

export class SetUser {
  @ApiProperty()
  @Column({ name: 'username', type: 'varchar' })
  username: string

  @ApiProperty()
  @Column({
    name: 'speed',
    type: 'enum',
    enum: NetworkPerformanceSpeed
  })
  speed: NetworkPerformanceSpeed
}
