import {
    Entity,
    PrimaryGeneratedColumn,
    Column
} from 'typeorm'

@Entity('User')
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column({type: 'varchar', unique: true})
    email: string

    @Column({type: 'varchar', unique: true})
    username: string

    @Column({type: 'varchar'})
    password: string

    @Column({type: 'varchar'})
    salt: string
}

