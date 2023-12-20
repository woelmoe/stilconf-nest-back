import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { genSalt, hash } from 'bcrypt'
import { v4 as uuidv4 } from 'uuid'

import { User } from './user.entity'
import { UpdateUserDto } from './dto/updateUser.dto'
import { NetworkPerformanceSpeed, UUID } from './types'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>
  ) {}

  createFields = ['username', 'speed']
  allFields = ['userId', 'username', 'speed', 'createdAt']

  /** фильтр входящих полей */
  private filterFields(body: { [k: string]: any }) {
    const filteredBody: { [k: string]: any } = {}

    Object.keys(body).filter((k) => {
      if (this.createFields.includes(k)) {
        filteredBody[k] = body[k]
      }
    })

    return filteredBody
  }

  /** фабрикует hash из строки */
  // private async fabricHashedData(data: string) {
  //   const salt = await genSalt(10)
  //   return await hash(data, salt)
  // }

  /** создать нового пользователя в бд */
  public async createUser(userData: UpdateUserDto) {
    const newUser = this.userRepository.create({
      ...userData,
      userId: uuidv4(),
      createdAt: new Date()
    })
    return await this.userRepository.save(newUser)
  }

  /** получить всех пользователей из бд */
  public async getAllUsers() {
    return await this.userRepository.find({
      select: this.allFields as any
    })
  }

  /** получить данные пользователя из БД */
  public async getUserData(userId: UUID) {
    return await this.userRepository.findOne({
      where: { userId },
      select: this.allFields as any
    })
  }

  /** Обновить данные пользователя в БД */
  public async updateUserData(userId: UUID, body: UpdateUserDto) {
    const filtered = this.filterFields(body)
    console.log(userId, body)
    return await this.userRepository.update({ userId }, filtered)
  }

  /** Удолил!!1 полбзователя */
  public async deleteUser(userId: UUID) {
    console.log(userId)
    return await this.userRepository.delete({ userId })
  }
}
