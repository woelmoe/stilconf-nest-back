import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { FindOptionsSelect, Repository } from 'typeorm'

import { Chat } from './chat.entity'
import { ChatMessageDto, UpdateChatDto } from './dto/updateChat.dto'

import { v4 as uuidv4 } from 'uuid'
import { UUID } from '@entities/types'
import { IRegisterUserData, JsonString } from './types'
import { filterFields, generateRandomString } from '@entities/utils'

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat) private readonly chatRepository: Repository<Chat>
  ) {}

  openedChats = {}

  allFields = [
    'chatId',
    'createdAt',
    'content',
    'registeredUsers'
  ] as FindOptionsSelect<Chat>

  public async createChat() {
    const chatId = generateRandomString(8)
    const newChat = this.chatRepository.create({
      content: JSON.stringify([]),
      createdAt: new Date(),
      chatId,
      registeredUsers: JSON.stringify([])
    })
    await this.chatRepository.save(newChat)
    return { chatId }
  }

  public async checkChat(chatId: string): Promise<UUID | null> {
    const chat = await this.chatRepository.findOne({
      where: { chatId }
    })
    return !!chat
  }

  public async getChatData(chatId: string): Promise<UUID | null> {
    return await this.chatRepository.findOne({
      where: { chatId },
      select: this.allFields
    })
  }

  public async handleRegisterUser(userData: IRegisterUserData) {
    let data = {
      registered: false,
      token: ''
    }
    const registeredData = await this.checkUserRegistered(userData)
    const { tokenInDb, alreadyRegistered } = registeredData
    if (tokenInDb) {
      data = {
        registered: true,
        token: tokenInDb
      }
    } else {
      const newToken = await this.registerUser(userData, alreadyRegistered)
      data = {
        registered: false,
        token: newToken
      }
    }
    this.cacheChatContent(userData.chatId)
    return data
  }

  private async cacheChatContent(chatId: string) {
    if (!this.openedChats[chatId])
      this.openedChats[chatId] = await this.getChatContent(chatId)
    console.log('this.openedChats', this.openedChats)
  }

  private async checkUserRegistered(userData: IRegisterUserData) {
    const { chatId, userId } = userData
    const { registeredUsers } = await this.chatRepository.findOne({
      where: { chatId },
      select: ['registeredUsers']
    })
    const registeredParsed = JSON.parse(registeredUsers) as IRegisterUserData[]
    return {
      tokenInDb: registeredParsed.find((user) => user.userId === userId)?.token,
      alreadyRegistered: registeredParsed
    }
  }

  private async registerUser(
    userData: IRegisterUserData,
    registeredParsed: IRegisterUserData[]
  ) {
    const { chatId, userId } = userData
    const token = await this.getToken()
    const newUserData: IRegisterUserData = {
      chatId,
      token,
      userId
    }
    registeredParsed.push(newUserData)
    await this.chatRepository.update(
      { chatId },
      {
        registeredUsers: JSON.stringify(registeredParsed)
      }
    )
    return token
  }

  public getToken() {
    return uuidv4()
  }

  public async getChatContent(chatId: string) {
    const chatData = await this.chatRepository.findOne({
      where: { chatId },
      select: ['content']
    })
    return JSON.parse(chatData.content)
  }

  public async saveMessageToHistory(chatId: string, content: JsonString) {
    if (this.openedChats[chatId]) this.openedChats[chatId].push(content)
    this.chatRepository.update(
      { chatId },
      { content: JSON.stringify(this.openedChats[chatId]) }
    )
  }
}
