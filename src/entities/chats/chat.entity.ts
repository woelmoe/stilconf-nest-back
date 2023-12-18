import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('chats')
export class Chat {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: 'url', type: 'varchar' })
  url: string

  @Column({ name: 'created_at', type: 'varchar' })
  createdAt: string

  // @Column({ name: 'name_first', type: 'varchar' })
  // nameFirst: string

  // @Column({ name: 'name_last', type: 'varchar' })
  // nameLast: string

  // @Column({ name: 'birth_date', type: 'timestamp', nullable: true })
  // birthDate: Date

  // @Column({ name: 'gender', type: 'enum', enum: E_Gender, nullable: true })
  // gender: E_Gender | null
}
