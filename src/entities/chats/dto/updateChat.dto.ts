import { UUID } from '@entities/types'
import {
  IsEmail,
  IsString,
  IsISO8601,
  IsNotEmpty,
  IsEnum,
  MinLength,
  IsDate
} from 'class-validator'

// import { E_Gender } from '../types'

export class UpdateChatDto {
  // @IsEmail()
  // email: string
  // @IsString()
  // @MinLength(1)
  // nameFirst: string
  // @IsString()
  // @MinLength(1)
  // nameLast: string
  // @IsISO8601()
  // birthDate: Date
  // @IsNotEmpty()
  // @IsEnum(E_Gender)
  // gender: E_Gender
}

export class ChatMessageDto {
  @IsString()
  @IsNotEmpty()
  userId: UUID

  @IsString()
  @IsNotEmpty()
  nickname: string

  @IsString()
  @IsNotEmpty()
  content: string

  @IsDate()
  @IsNotEmpty()
  date: Date
}

export class RegisterUserDto {
  @IsString()
  @IsNotEmpty()
  userId: UUID
}
