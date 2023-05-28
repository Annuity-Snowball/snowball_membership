import { jwt } from 'jsonwebtoken';
import { Request, Response, NextFunction } from "express"
import { AccessTokenExpiredError, NoTokenError, ServerError } from "../exception/serverError"
import { createAccessToken, createRefreshToken, verifyAccessToken, verifyRefreshToken } from "./jwt.util"
import { redisClient } from "../config/db.config"
import { RefreshToken, refreshTokenSchema } from "../entity/token.entity"
import { AccessTokenModel, RefreshTokenModel } from "../model/auth.model"
import { Repository } from 'redis-om';



export const vertifyToken = async (req: Request, res: Response, next: NextFunction) => {

    const authHeader = req.headers.authorization
    const refreshKey = req.headers['x-refresh-token']

    if(!authHeader && !refreshKey) {
        const error = new NoTokenError("there is no token in header")
    }

    const accessToken = authHeader.split(" ")[1]

    const accessVerifyResult = await verifyAccessToken(accessToken)

    if(accessVerifyResult instanceof ServerError) {

        if(accessVerifyResult instanceof AccessTokenExpiredError) {
            const tokenRepository = await redisClient.fetchRepository(refreshTokenSchema)
            const refreshToken = await tokenRepository.fetch(`RefreshToken:${refreshKey}`)
            
            const refreshVerifyResult = verifyRefreshToken(refreshToken.refreshToken)

            if(refreshVerifyResult instanceof ServerError) {
                next(refreshVerifyResult)
            }

            const newRefreshKey = await createNewRefreshToken(tokenRepository, refreshKey, refreshToken)
            // @ts-ignore
            res.body.newRefreshToken = newRefreshKey
        }
        else {
            next(accessVerifyResult)
        }
    }

    const accessDecode = jwt.decode(accessToken)
    const accessPayload = new AccessTokenModel(accessDecode.email, accessDecode.username)
    const newAccessToken = createAccessToken(accessPayload)

    // @ts-ignore
    res.body.newAccessToken = newAccessToken
    next()
}

const createNewRefreshToken = async (
        tokenRepository: Repository<RefreshToken>,
        refreshKey: string|string[],
        refreshToken: RefreshToken
    ): Promise<string> => {

    await tokenRepository.remove(`RefreshToken:${refreshKey}`)
    const refreshDecode = jwt.decode(refreshToken)
    const refreshPayload = new RefreshTokenModel(refreshDecode.ip, refreshDecode.userAgent)
    const newRefreshToken = createRefreshToken(refreshPayload)

    const newCacheRefreshToken = await tokenRepository.createEntity()
    newCacheRefreshToken.refreshToken = newRefreshToken
    const newRefreshKey = await tokenRepository.save(newCacheRefreshToken)
    await redisClient.expire(`RefreshToken:${newRefreshKey}`, 60*60*24*7)

    return newRefreshKey
}