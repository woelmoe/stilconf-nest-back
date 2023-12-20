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

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /** получить всех пользователей */
  @Get('/')
  async getAllUsers(@Res() res: Response) {
    const users = await this.userService.getAllUsers()

    return res.send({
      status: 'ok',
      data: users
    })
  }

  /** создать нового пользователя */
  @Post('/')
  async createUser(@Body() body: UpdateUserDto, @Res() res: Response) {
    await this.userService.createUser(body)
    return res.send({ status: 'ok' })
  }

  /** получить пользователя по id */
  @Get('/:id')
  async getUser(@Param('id') id: UUID, @Res() res: Response) {
    const userData = await this.userService.getUserData(id)

    return res.send({
      status: 'ok',
      data: userData
    })
  }

  /** перезаписать данные пользователя по его id */
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
  @Get('/delete/:id')
  async deleteUser(@Param('id') id: UUID, @Res() res: Response) {
    this.userService.deleteUser(id)
    return res.send({ status: 'ok' })
  }
}
