import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { JsonString } from './types'
import { ApiProperty } from '@nestjs/swagger'

@Entity('chats')
export class Chat {
  @PrimaryGeneratedColumn()
  id: number

  @ApiProperty()
  @Column({ name: 'chat_id', type: 'varchar' })
  chatId: string

  @ApiProperty()
  @Column({ name: 'content', type: 'varchar' })
  content: JsonString

  @ApiProperty()
  @Column({ name: 'created_at', type: 'timestamp' })
  createdAt: Date

  @ApiProperty()
  @Column({ name: 'registered_users', type: 'varchar' })
  registeredUsers: JsonString
}

export class ChatResponse {
  @Column({ name: 'chat_id', type: 'varchar' })
  chatId: string

  @Column({ name: 'content', type: 'varchar' })
  content: JsonString
}
