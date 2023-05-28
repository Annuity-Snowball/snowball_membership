import { Entity, Schema } from 'redis-om'

export class RefreshToken extends Entity {
    refreshToken: string
}

export const refreshTokenSchema = new Schema(RefreshToken, {
    refreshToken: { type: 'string' }
})