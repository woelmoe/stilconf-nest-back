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

import { ChatService } from './chat.service'
import { RegisterUserDto, UpdateChatDto } from './dto/updateChat.dto'
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { UUID } from '@entities/types'
import { IRegisterUserData } from './types'

@Controller('chats')
export class ChatController {
  constructor(private readonly ChatService: ChatService) {}

  /** создать новый чат */
  @ApiOperation({ summary: 'Создать чат с автогенерируемой ссылкой в ответе' })
  @ApiResponse({
    status: 200
  })
  @Get('/create')
  async createChat(@Res() res: Response) {
    const chatData = this.ChatService.createChat()
    return res.send({ status: 'ok', data: chatData })
  }

  /** Проверить наличие чата по id при переходе по уникальной ссылке чата */
  @ApiOperation({
    summary:
      'Проверить наличие чата в базе по его id при переходе по уникальной ссылке чата, чтобы не запрашивать весь контент для проверки'
  })
  @ApiResponse({
    status: 200
  })
  @Get('/check/:id')
  async checkChat(@Param('id') id: string, @Res() res: Response) {
    return res.send({
      status: 'ok',
      data: {
        chatRegistered: await this.ChatService.checkChat(id)
      }
    })
  }

  /** Получить данные чата по его id */
  @ApiOperation({ summary: 'Получить данные чата по его id' })
  @ApiResponse({
    status: 200
  })
  @Get('/:id')
  async getChat(@Param('id') id: string, @Res() res: Response) {
    return res.send({
      status: 'ok',
      data: {
        chatRegistered: await this.ChatService.getChatData(id)
      }
    })
  }

  /** Зарегистрировать пользователя в чате по UUID пользователя */
  @ApiOperation({
    summary: 'Зарегистрировать пользователя в чате по UUID пользователя'
  })
  @ApiResponse({
    status: 200
  })
  @Post('/register/:id')
  async registerUser(
    @Param('id') chatId: UUID,
    @Body() body: RegisterUserDto,
    @Res() res: Response
  ) {
    const userData: IRegisterUserData = {
      chatId,
      userId: body.userId,
      token: null
    }
    let data = {
      registered: false,
      token: ''
    }
    const registeredData = await this.ChatService.checkUserRegistered(userData)
    const { tokenInDb, alreadyRegistered } = registeredData
    if (tokenInDb) {
      data = {
        registered: true,
        token: tokenInDb
      }
    } else {
      const newToken = await this.ChatService.registerUser(
        userData,
        alreadyRegistered
      )
      data = {
        registered: false,
        token: newToken
      }
    }
    return res.send({
      status: 'ok',
      data
    })
  }
}
