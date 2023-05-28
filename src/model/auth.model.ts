import { Request } from "express"

export class LogInRequest {
    email: string
    password: string
    ip: string|string[]
    userAgent: string

    constructor(req: Request) {
        this.email = req.body.email
        this.password = req.body.password
        this.ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
        this.userAgent = req.headers['user-agent']
    }
}

export class LogInResponse {
    accessToken: string
    refreshKey: string

    constructor(token, key) {
        this.accessToken = token
        this.refreshKey = key
    }
}

export class AccessTokenModel {
    email: string
    username: string

    constructor(email: string, username: string) {
        this.email = email
        this.username = username
    }
}

export class RefreshTokenModel {
    ip: string|string[]
    userAgent: string

    constructor(ip: string|string[], userAgent: string) {
        this.ip = ip
        this.userAgent = userAgent
    }
}