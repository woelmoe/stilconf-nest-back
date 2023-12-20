import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { genSalt, hash } from 'bcrypt'

import { Chat } from './chat.entity'
import { UpdateChatDto } from './dto/updateChat.dto'

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat) private readonly userRepository: Repository<Chat>
  ) {}

  availableFields = ['nameFirst', 'nameLast', 'email', 'gender', 'birthDate']

  // Filter body's fileds from available fields list
  private filterFields(body: { [k: string]: any }) {
    const filteredBody: { [k: string]: any } = {}

    Object.keys(body).filter((k) => {
      if (this.availableFields.includes(k)) {
        filteredBody[k] = body[k]
      }
    })

    return filteredBody
  }

  // Register new user
  public async createChat(userData: any) {
    const salt = await genSalt(10)

    const hashedPassword = await hash(userData.password, salt)

    const newChat = this.userRepository.create({
      ...userData,
      password: hashedPassword
    })

    return await this.userRepository.save(newChat)
  }

  // Get all users
  public async getAllChats() {
    return await this.userRepository.find({
      select: this.availableFields as any
    })
  }

  // Get user data by id
  public async getChatData(id: number) {
    return await this.userRepository.findOne({
      where: { id },
      select: this.availableFields as any
    })
  }

  // Update user data whole
  public async updateChatData(id: number, body: UpdateChatDto) {
    return await this.userRepository.update({ id }, this.filterFields(body))
  }

  // Delete user by id
  public async deleteChat(id: number) {
    return await this.userRepository.delete(id)
  }
}
