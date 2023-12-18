import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { Chat } from './chat.entity'
import { UserController } from './chat.controller'
import { UserService } from './chat.service'

@Module({
  imports: [TypeOrmModule.forFeature([Chat])],
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule {}
