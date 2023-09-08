import { Request, Response, NextFunction } from "express"
import { AccessTokenExpiredError, NoTokenError, ServerError } from "../exception/serverError.ts"
import { createAccessToken, createRefreshToken, verifyAccessToken, verifyRefreshToken } from "./jwt.util.ts"
import { redisClient } from "../config/db.config.ts"
import { RefreshToken, refreshTokenSchema } from "../entity/token.entity.ts"
import { AccessTokenModel, RefreshTokenModel } from "../model/auth.model.ts"
import { Repository } from 'redis-om';

export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization
    const refreshKey = req.headers['x-refresh-token']
    
    if (!authHeader || !refreshKey) {
        next(new NoTokenError("there is no token in header"))
        return
    }

    const accessToken = authHeader.split(" ")[1]
    const accessVerifyResult = await verifyAccessToken(accessToken)
    if("email" in accessVerifyResult) {
        req.email = accessVerifyResult.email
    }
    
    if (accessVerifyResult instanceof ServerError) {
        await handleErrorInAccessToken(res, next, accessVerifyResult, refreshKey)
    } else {
        await generateNewAccessToken(res, accessVerifyResult)
        next()
    }
}

export const handleErrorInAccessToken = async (
        res: Response,
        next: NextFunction,
        error: ServerError,
        refreshKey: string|string[]
    ) => {
    if (error.message === "access token expired") {
        await handleExpiredAccessToken(res, next, refreshKey)
    } else {
        next(error)
    }
}

const handleExpiredAccessToken = async (res: Response, next: NextFunction, refreshKey: string|string[]) => {
    const tokenRepository = await redisClient.fetchRepository(refreshTokenSchema)
    const refreshToken = await tokenRepository.fetch(`${refreshKey}`)
    const refreshVerifyResult = await verifyRefreshToken(refreshToken.refreshToken)

    if(refreshVerifyResult instanceof ServerError) {
        next(refreshVerifyResult)
    } else {
        const newRefreshKey = await createNewRefreshToken(tokenRepository, refreshKey, refreshVerifyResult)
        res.setHeader('x-new-refresh-token', newRefreshKey)

        await generateNewAccessToken(res, refreshVerifyResult)
        res.send()
    }
}

export const generateNewAccessToken = async (res: Response, accessVerifyResult: object) => {
    // @ts-ignore
    const accessPayload = new AccessTokenModel(accessVerifyResult.email, accessVerifyResult.username)
    const newAccessToken = createAccessToken(accessPayload)
    
    res.setHeader('x-new-access-token', newAccessToken)
}

const createNewRefreshToken = async (
        tokenRepository: Repository<RefreshToken>,
        refreshKey: string|string[],
        refreshToken: object
    ): Promise<string> => {
    await tokenRepository.remove(`${refreshKey}`)
    // @ts-ignore
    const refreshPayload = new RefreshTokenModel(refreshToken.ip, refreshToken.userAgent)
    const newRefreshToken = createRefreshToken(refreshPayload)

    const newCacheRefreshToken = await tokenRepository.createEntity()
    newCacheRefreshToken.refreshToken = newRefreshToken
    const newRefreshKey = await tokenRepository.save(newCacheRefreshToken)
    await redisClient.expire(`RefreshToken:${newRefreshKey}`, 60*60*24*7)

    return newRefreshKey
}
