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
import {
  ChatMessageDto,
  RegisterUserDto,
  UpdateChatDto
} from './dto/updateChat.dto'
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { UUID } from '@entities/types'
import { IRegisterUserData } from './types'

@Controller('chats')
export class ChatController {
  constructor(private readonly ChatService: ChatService) {}

  openedChats: {}

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
    return res.send({
      status: 'ok',
      data: this.ChatService.handleRegisterUser(userData)
    })
  }

  /** Запрос на внесение записи в чат */
  @ApiOperation({
    summary: 'Запрос на внесение сообщения в историю чата'
  })
  @ApiResponse({
    status: 200
  })
  @Post('/:id')
  async PostMessage(
    @Param('id') chatId: UUID,
    @Body() body: ChatMessageDto,
    @Res() res: Response
  ) {
    if (!this.openedChats[chatId])
      this.openedChats[chatId] = this.ChatService.getChatContent(chatId)
    const newMessage: InstanceType<typeof ChatMessageDto> = {
      userId: body.userId,
      nickname: body.nickname,
      content: body.content,
      date: body.date
    }
    this.openedChats[chatId].push(newMessage)
    this.ChatService.saveMessageToHistory(chatId, this.openedChats[chatId])
    return res.send({
      status: 'ok'
    })
  }
}
