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
import { ChatMessageDto, RegisterUserDto } from './dto/updateChat.dto'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { IRegisterUserData } from './types'
import { Chat } from './chat.entity'

@ApiTags('Chats')
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
    const chatData = await this.ChatService.createChat()
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
    status: 200,
    description: 'Список пользователей',
    type: Chat
  })
  @Get('/:id')
  async getChat(@Param('id') id: string, @Res() res: Response) {
    return res.send({
      status: 'ok',
      data: {
        chatData: await this.ChatService.getChatData(id)
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
    @Param('id') chatId: string,
    @Body() body: RegisterUserDto,
    @Res() res: Response
  ) {
    console.log('register', chatId, body)
    const userData: IRegisterUserData = {
      chatId,
      userId: body.userId,
      token: null
    }
    const data = this.ChatService.handleRegisterUser(userData)
    if (!data)
      return res.send({
        status: 'not found'
      })
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
    @Param('id') chatId: string,
    @Body() body: ChatMessageDto,
    @Res() res: Response
  ) {
    const newMessage: InstanceType<typeof ChatMessageDto> = {
      userId: body.userId,
      username: body.username,
      content: body.content,
      date: body.date
    }
    const content = JSON.stringify(newMessage)
    this.ChatService.saveMessageToHistory(chatId, content)
    return res.send({
      status: 'ok'
    })
  }
}
