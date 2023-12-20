import {
  IsEmail,
  IsString,
  IsISO8601,
  IsNotEmpty,
  IsEnum,
  MinLength
} from 'class-validator'
import { NetworkPerformanceSpeed } from '../types'
import { ApiProperty } from '@nestjs/swagger'

export class UpdateUserDto {
  @ApiProperty({ example: 'Bristleback', description: 'Никнейм пользователя' })
  @IsString()
  @MinLength(1)
  username: string

  @ApiProperty({
    example: '2mb',
    description: 'Скорость соединения пользователя'
  })
  @IsNotEmpty()
  @IsEnum(NetworkPerformanceSpeed)
  speed: NetworkPerformanceSpeed
}
