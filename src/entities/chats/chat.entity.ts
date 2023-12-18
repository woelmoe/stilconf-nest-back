import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

// import { E_Gender } from './types'

@Entity('chats')
export class Chat {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: 'url', type: 'varchar' })
  email: string

  // @Column({ name: 'password', type: 'varchar' })
  // password: string

  // @Column({ name: 'name_first', type: 'varchar' })
  // nameFirst: string

  // @Column({ name: 'name_last', type: 'varchar' })
  // nameLast: string

  // @Column({ name: 'birth_date', type: 'timestamp', nullable: true })
  // birthDate: Date

  // @Column({ name: 'gender', type: 'enum', enum: E_Gender, nullable: true })
  // gender: E_Gender | null
}
