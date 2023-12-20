import {
  IsEmail,
  IsString,
  IsISO8601,
  IsNotEmpty,
  IsEnum,
  MinLength
} from 'class-validator'
import { NetworkPerformanceSpeed } from '../types'

export class UpdateUserDto {
  @IsString()
  @MinLength(1)
  username: string

  @IsNotEmpty()
  @IsEnum(NetworkPerformanceSpeed)
  speed: NetworkPerformanceSpeed
}
