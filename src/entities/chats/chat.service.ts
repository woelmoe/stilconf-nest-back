import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { FindOptionsSelect, Repository } from 'typeorm'

import { Chat } from './chat.entity'

import { v4 as uuidv4 } from 'uuid'
import { UUID } from '@entities/types'
import { IOpennedChat, IRegisterUserData, JsonString } from './types'
import { filterFields, generateRandomString } from '@entities/utils'

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat) private readonly chatRepository: Repository<Chat>
  ) {}

  openedChats: Record<string, IOpennedChat> = {}

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

  public async handleRegisterUser(
    userData: IRegisterUserData
  ): Promise<IOpennedChat> {
    let data: IOpennedChat
    const registeredData = await this.checkUserRegistered(userData)
    if (!registeredData) return null
    const { tokenInDb, alreadyRegistered } = registeredData
    if (tokenInDb) {
      data = {
        registeredData,
        registered: true,
        token: tokenInDb,
        content: []
      }
    } else {
      const newToken = await this.registerUser(userData, alreadyRegistered)
      data = {
        registeredData,
        registered: false,
        token: newToken,
        content: []
      }
    }
    this.cacheChatContent(data, userData.chatId)
    return data
  }

  private async cacheChatContent(chatData: IOpennedChat, chatId: string) {
    if (!this.openedChats[chatId]) this.openedChats[chatId] = chatData
    this.openedChats[chatId].content = await this.getChatContent(chatId)
    console.log('this.openedChats', this.openedChats)
  }

  private async checkUserRegistered(userData: IRegisterUserData): Promise<{
    tokenInDb: string
    alreadyRegistered: IRegisterUserData[]
  } | null> {
    const { chatId, userId } = userData
    let result = null
    try {
      const { registeredUsers } = await this.chatRepository.findOne({
        where: { chatId },
        select: ['registeredUsers']
      })
      const registeredParsed = JSON.parse(
        registeredUsers
      ) as IRegisterUserData[]
      result = {
        tokenInDb: registeredParsed.find((user) => user.userId === userId)
          ?.token,
        alreadyRegistered: registeredParsed
      }
    } catch (error) {
      result = null
    }
    return result
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

  public async getChatContent(chatId: string): Promise<JsonString[]> {
    const chatData = await this.chatRepository.findOne({
      where: { chatId },
      select: ['content']
    })
    return JSON.parse(chatData.content)
  }

  public async saveMessageToHistory(chatId: string, content: JsonString) {
    if (this.openedChats[chatId]) this.openedChats[chatId].content.push(content)
    this.chatRepository.update(
      { chatId },
      { content: JSON.stringify(this.openedChats[chatId].content) }
    )
  }

  public get getOpennedChats() {
    return this.openedChats
  }
}
