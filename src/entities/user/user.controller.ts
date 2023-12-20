import {
  Controller,
  Get,
  Post,
  Req,
  Res,
  Put,
  Patch,
  Delete,
  Param,
  ParseIntPipe,
  Body
} from '@nestjs/common'
import { Response, Request } from 'express'

import { UserService } from './user.service'
import { UpdateUserDto } from './dto/updateUser.dto'
import { UUID } from './types'

import {
  ApiTags,
  ApiResponse,
  ApiOperation,
  ApiProperty,
  ApiParam,
  ApiBody
} from '@nestjs/swagger'
import { SetUser, User } from './user.entity'

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /** получить всех пользователей */
  @ApiOperation({ summary: 'Получение всех пользователей' })
  @ApiResponse({
    status: 200,
    description: 'Список пользователей',
    type: User,
    isArray: true
  })
  @Get('/')
  async getAllUsers(@Res() res: Response) {
    const users = await this.userService.getAllUsers()
    return res.send({
      status: 'ok',
      data: users
    })
  }

  /** создать нового пользователя */
  @ApiOperation({ summary: 'Создать пользователя' })
  @ApiBody({ type: SetUser, description: 'Payload' })
  @ApiResponse({
    status: 200
  })
  @Post('/')
  async createUser(@Body() body: UpdateUserDto, @Res() res: Response) {
    await this.userService.createUser(body)
    return res.send({ status: 'ok' })
  }

  /** получить пользователя по id */
  @ApiParam({ name: 'id', description: 'uuid пользователя' })
  @ApiOperation({ summary: 'Получение пользователя по его uuid' })
  @ApiResponse({
    status: 200,
    description: 'Объект с данными пользователя',
    type: User
  })
  @Get('/:id')
  async getUser(@Param('id') id: UUID, @Res() res: Response) {
    const userData = await this.userService.getUserData(id)

    return res.send({
      status: 'ok',
      data: userData
    })
  }

  /** перезаписать данные пользователя по его id */
  @ApiParam({ name: 'id', description: 'uuid пользователя' })
  @ApiOperation({ summary: 'Перезаписать данные пользователя по его uuid' })
  @ApiBody({ type: SetUser, description: 'Payload' })
  @ApiResponse({
    status: 200
  })
  @Post('/update/:id')
  async updateUser(
    @Param('id') id: UUID,
    @Body() body: UpdateUserDto,
    @Res() res: Response
  ) {
    this.userService.updateUserData(id, body)
    return res.send({ status: 'ok' })
  }

  /** удалить пользователя по его id */
  @ApiOperation({ summary: 'Удалить пользователя по его id' })
  @ApiResponse({
    status: 200
  })
  @Get('/delete/:id')
  async deleteUser(@Param('id') id: UUID, @Res() res: Response) {
    this.userService.deleteUser(id)
    return res.send({ status: 'ok' })
  }
}
