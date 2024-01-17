import { Chat } from '@entities/chats/chat.entity'
import { User } from '@entities/user/user.entity'
import { Module } from '@nestjs/common'
import { TypeOrmModule as NestTypeOrmModule } from '@nestjs/typeorm'

@Module({
  imports: [
    NestTypeOrmModule.forRoot({
      type: 'postgres',
      host: '127.0.0.1',
      port: 5432,
      username: 'nest_test',
      password: 'nest_test',
      database: 'nest_test',
      entities: [Chat, User],
      // entities: ['dist/entities/**/*.entity.js'],
      // logging: true,
      synchronize: true
      // migrations: [ 'dist/db/migrations/**/*.js' ],
      // cli: { migrationsDir: 'src/db/migrations' },
    })
  ]
})
export class TypeOrmModule {}
