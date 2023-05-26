import { Request } from "express"

export class SignUpRequest {
    email: string
    username: string
    password: string

    constructor(req: Request) {
        this.email = req.body.email
        this.username = req.body.username
        this.password = req.body.password
    }
}

