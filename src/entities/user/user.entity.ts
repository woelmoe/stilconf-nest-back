import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { NetworkPerformanceSpeed } from './types'

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: 'username', type: 'varchar' })
  username: string

  @Column({
    name: 'network_performance_speed',
    type: 'enum',
    enum: NetworkPerformanceSpeed
  })
  networkPerformanceSpeed: string

  @Column({ name: 'created_at', type: 'timestamp', nullable: true })
  createdAt: Date

  // @Column({ name: 'gender', type: 'enum', enum: E_Gender, nullable: true })
  // gender: E_Gender | null
}
