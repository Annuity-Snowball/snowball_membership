import { Repository } from 'typeorm';
import { User } from '../entity/user.entity.ts'
import { EmailDuplicateError, UsernameDuplicateError, PasswordNotMatchError, ServerError, UserNotExistError } from '../exception/serverError.ts'
import { SignUpRequest } from '../model/user.model.ts'
import { generateSalt, hashPassword } from '../utils/crypto.utils.ts'
import { mySqlClient } from './../config/db.config.ts'
import { logger } from '../config/winston.config.ts';
export class UserService {
    private userRepository: Repository<User>
    constructor() {
        this.userRepository = mySqlClient.getRepository(User)
    }

    async checkEmailDuplication(email: string): Promise<number|ServerError> {
        const user = await this.userRepository.findOne({
            where:{
                email: email
            }
        })

        if(user){
            return new EmailDuplicateError(`email: ${email} already exists`)
        } else {
            return 1
        }
    }

    async checkUsernameDuplication(username: string): Promise<number|ServerError> {
        const user = await this.userRepository.findOne({
            where:{
                username: username
            }
        })

        if(user){
            return new UsernameDuplicateError(`username: ${username} already exists`)
        } else {
            return 1
        }
    }

    // TODO: email 인증을 추가할 것.
    async createUser(signUpRequest: SignUpRequest): Promise<number|ServerError> {
        const emailValidate = await this.checkEmailDuplication(signUpRequest.email)
        const usernameValidate = await this.checkUsernameDuplication(signUpRequest.username)

        if(emailValidate != 1) {
            return emailValidate
        } else if(usernameValidate != 1) {
            return usernameValidate
        }

        const user = new User()
        user.email = signUpRequest.email
        user.username = signUpRequest.username
        user.salt = await generateSalt()
        user.password = await hashPassword(signUpRequest.password, user.salt)

        logger.info(`${user.email} have signUp`)
        this.userRepository.save(user)
    }

    async updatePassword(email: string, password: string): Promise<string|ServerError> {
        const user = await this.userRepository.findOne({
            where: {
                email
            }
        })

        if(!user) {
            return new UserNotExistError(`${email} not exists`)
        } else {
            user.password = password
            await this.userRepository.save(user)
            return "password has changed successfully"
        }
    }

    async updateUsername(email: string, username: string): Promise<string|ServerError> {
        const duplicateCheck = await this.checkUsernameDuplication(username)
        if(duplicateCheck instanceof ServerError) {
            return duplicateCheck
        }

        const user = await this.userRepository.findOne({
            where: {
                email
            }
        })

        if(!user) {
            return new UserNotExistError(`${email} not exists`)
        } else {
            user.username = username
            await this.userRepository.save(user)
            return "username has changed successfully"
        }
    }

    async deleteUser(email: string) {

    }

    async checkPassword(username: string, password: string): Promise<number|ServerError> {
        const user = await this.userRepository.findOne({
            where: {
                username: username
            }
        })

        if(!user) {
            return new UserNotExistError(`${username} not exists`)
        }

        const inputPassword = await hashPassword(password, user.salt)

        if(inputPassword != user.password) {
            return new PasswordNotMatchError('wrong password')
        } else {
            return 1
        }
    }

}