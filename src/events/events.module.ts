import { Module } from '@nestjs/common'
import { EventsGateway } from './events.gateway'
import { UserModule } from '@entities/user/user.module'
import { ChatModule } from '@entities/chats/chat.module'

@Module({
  imports: [ChatModule, UserModule],
  providers: [EventsGateway],
  exports: [EventsGateway]
})
export class EventsModule {}
