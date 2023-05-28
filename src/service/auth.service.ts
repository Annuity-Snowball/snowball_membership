import { Repository } from 'typeorm';
import { Repository as RedisRepository } from 'redis-om';
import { User } from '../entity/user.entity.ts'
import { mySqlClient, redisClient } from '../config/db.config.ts';
import { AccessTokenModel, LogInRequest, LogInResponse, RefreshTokenModel } from '../model/auth.model.ts';
import { PasswordNotMatchError, ServerError, UserNotExistError } from '../exception/serverError.ts'
import { hashPassword } from '../utils/crypto.utils.ts';
import { RefreshToken, refreshTokenSchema } from '../entity/token.entity.ts';
import { createAccessToken, createRefreshToken } from '../utils/jwt.util.ts';

// TODO: 로그인에 OTP 기능 추가할 것..?
export class AuthService {
    private userRepository: Repository<User>
    private tokenRepository: RedisRepository<RefreshToken>
    constructor() {
        this.userRepository = mySqlClient.getRepository(User)
        this.tokenRepository = redisClient.fetchRepository(refreshTokenSchema)
    }

    // TODO: 동일 계정 로그인 시 로직 추가
    async logIn(loginRequest: LogInRequest): Promise<LogInResponse|ServerError> {
        const user = await this.userRepository.findOne({
            where: {
                email: loginRequest.email
            }
        })

        const checkUserInfo = await this.checkUserInfo(user, loginRequest)
        if(checkUserInfo){
            return checkUserInfo
        }

        const accessTokenPayload = new AccessTokenModel(user.email, user.username)
        const refreshTokenPaload = new RefreshTokenModel(loginRequest.ip, loginRequest.userAgent)
        
        const logInResponse = await this.tokenProcess(accessTokenPayload, refreshTokenPaload)

        return logInResponse
    }

    async logOut(refreshKey: string) {
        
    }

    async checkUserInfo(user: User, loginRequest: LogInRequest): Promise<ServerError|null>{
        const checkEmail = await this.checkUserEmail(user, loginRequest.email)
        if(checkEmail){
            return checkEmail
        }

        const checkPassword = await this.checkPassword(user, loginRequest.password)
        if(checkPassword) {
            return checkPassword
        }

        return null
    }

    async checkUserEmail(user: User|null, email: string): Promise<ServerError|null> {
        if(!user){
            return new UserNotExistError(`${email} not exists`)
        } else {
            return null
        }
    }

    async checkPassword(user: User, password: string): Promise<ServerError|null> {
        const inputPassword = await hashPassword(password, user.salt)

        if(user.password != inputPassword) {
            return new PasswordNotMatchError("wrong password")
        } else {
            return null
        }
    }

    async tokenProcess(accessTokenPayload: AccessTokenModel, refreshTokenPayload: RefreshTokenModel): Promise<LogInResponse> {
        const accessToken = createAccessToken(accessTokenPayload)
        const refreshToken = createRefreshToken(refreshTokenPayload)

        const cache = await this.tokenRepository.createEntity()
        cache.refreshToken = refreshToken
        const refreshKey = await this.tokenRepository.save(cache)
        await redisClient.expire(`RefreshToken:${refreshKey}`, 60*60*24*7)

        return new LogInResponse(accessToken, refreshKey)
    }
}