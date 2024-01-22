import { Module, forwardRef } from '@nestjs/common'

import { Chat } from './chat.entity'
import { ChatController } from './chat.controller'
import { ChatService } from './chat.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from '@entities/user/user.entity'
import { EventsGateway } from 'src/events/events.gateway'
import { EventsModule } from 'src/events/events.module'

@Module({
  imports: [TypeOrmModule.forFeature([Chat]), forwardRef(() => EventsModule)],
  controllers: [ChatController],
  // providers: [ChatService, EventsGateway],
  providers: [ChatService],
  exports: [ChatService]
})
export class ChatModule {}
