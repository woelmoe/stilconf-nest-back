import { Module } from '@nestjs/common'

import { Chat } from './chat.entity'
import { ChatController } from './chat.controller'
import { ChatService } from './chat.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from '@entities/user/user.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Chat])],
  controllers: [ChatController],
  providers: [ChatService],
  exports: [ChatService]
})
export class ChatModule {}
