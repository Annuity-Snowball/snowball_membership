import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import { AccessTokenExpiredError, RefreshTokenExpiredError, ServerError, TokenNotValidateError } from '../exception/serverError.ts'
import { AccessTokenModel, RefreshTokenModel } from '../model/auth.model.ts'

dotenv.config()

const SECRET_KEY = process.env.JWT_KEY

export const createAccessToken = (payloadInfo: AccessTokenModel): string => {
    const payload = {
        email: payloadInfo.email,
        username: payloadInfo.username
    }
    return jwt.sign(payload, SECRET_KEY, { expiresIn: '1m' });
}

export const createRefreshToken = (payloadInfo: RefreshTokenModel): string => {
    const payload = {
        ip: payloadInfo.ip,
        userAgent: payloadInfo.userAgent
    }
    return jwt.sign(payload, SECRET_KEY, { expiresIn: '7d' });
}

export const verifyAccessToken = async (token: string): Promise<object|ServerError> => {
    try {
        return jwt.verify(token, SECRET_KEY)
    } catch (error) {
        if(error instanceof jwt.TokenExpiredError) {
            return new AccessTokenExpiredError("access token expired")
        }
        else if(error instanceof jwt.JsonWebTokenError) {
            return new TokenNotValidateError("incorrect accessToken")
        }
        else {
            return new ServerError(500, "unconfigured error")
        }
    }
}

export const verifyRefreshToken = async (token: string|string[]): Promise<object|ServerError> => {
    try {
        return jwt.verify(token, SECRET_KEY)
    } catch (error) {
        if(error instanceof jwt.TokenExpiredError) {
            return new RefreshTokenExpiredError("refresh token expired")
        }
        else if(error instanceof jwt.JsonWebTokenError) {
            return new TokenNotValidateError("incorrect refreshToken")
        }
        else {
            return new ServerError(500, "unconfigured error")
        }
    }
}