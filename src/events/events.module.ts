import { Module, forwardRef } from '@nestjs/common'
import { EventsGateway } from './events.gateway'
import { UserModule } from '@entities/user/user.module'
import { ChatModule } from '@entities/chats/chat.module'

@Module({
  imports: [forwardRef(() => ChatModule), UserModule],
  providers: [EventsGateway],
  exports: [EventsGateway]
})
export class EventsModule {}
