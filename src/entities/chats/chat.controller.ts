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
import { UpdateChatDto } from './dto/updateChat.dto'

@Controller('chats')
export class ChatController {
  constructor(private readonly ChatService: ChatService) {}

  // @Get('/')
  // async getAllChats(
  //   @Res() res: Response,
  // ) {
  //   const users = await this.ChatService.getAllChats()

  //   return res.send({
  //     status: 'ok',
  //     data: users,
  //   })
  // }

  // @Get('/:id')
  // async getChat(
  //   @Param('id', ParseIntPipe) id: number,
  //   @Res() res: Response,
  // ) {
  //   const userData = await this.ChatService.getChatData(id)

  //   return res.send({
  //     status: 'ok',
  //     data: userData,
  //   })
  // }

  // @Post('/')
  // async createChat(
  //   @Req() req: Request,
  //   @Res() res: Response,
  // ) {
  //   await this.ChatService.createChat(req.body)
  //   return res.send({ status: 'ok' })
  // }

  // @Put('/:id')
  // async updateChat(
  //   @Param('id', ParseIntPipe) id: number,
  //   @Body() body: UpdateChatDto,
  //   @Res() res: Response,
  // ) {
  //   this.ChatService.updateChatData(id, body)
  //   return res.send({ status: 'ok' })
  // }

  // @Delete('/:id')
  // async deleteChat(
  //   @Param('id', ParseIntPipe) id: number,
  //   @Res() res: Response,
  // ) {
  //   this.ChatService.deleteChat(id)
  //   return res.send({ status: 'ok' })
  // }
}
