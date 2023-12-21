import { UUID } from '@entities/types'
import { ApiProperty } from '@nestjs/swagger'
import {
  IsEmail,
  IsString,
  IsISO8601,
  IsNotEmpty,
  IsEnum,
  MinLength,
  IsDate,
  IsDateString
} from 'class-validator'

export class ChatMessageDto {
  @ApiProperty({
    example: 'dfacf21d-91cb-40cb-bf04-86e260a30d35',
    description: 'Токен входа пользователя в чат'
  })
  @IsString()
  @IsNotEmpty()
  userId: UUID

  @ApiProperty({
    example: 'Lina Inverse',
    description: 'Никнейм пользователя'
  })
  @IsString()
  @IsNotEmpty()
  username: string

  @ApiProperty({
    example: 'Hello world!',
    description: 'Контент сообщения'
  })
  @IsString()
  @IsNotEmpty()
  content: string

  @ApiProperty({
    example: '2023-12-21T21:51:05.079Z',
    description: 'Дата сообщения'
  })
  @IsDateString()
  @IsNotEmpty()
  date: Date
}

export class RegisterUserDto {
  @ApiProperty({
    example: 'jk4jfk5-4kfj-4fjr-48gj-fdkj5kh68fj45',
    description: 'UUID пользователя'
  })
  @IsString()
  @IsNotEmpty()
  userId: UUID
}
