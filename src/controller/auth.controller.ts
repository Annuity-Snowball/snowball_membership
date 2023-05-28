import express, { Request, Response, NextFunction } from 'express'
import { LogInRequest } from '../model/auth.model.ts'
import { AuthService } from '../service/auth.service.ts'
import { ServerError } from '../exception/serverError.ts'

export class AuthController {
    private authService: AuthService

    constructor() {
        this.authService = new AuthService()
    }

    async logIn(req: Request, res: Response, next: NextFunction) {
        const loginRequest = new LogInRequest(req)

        const result = await this.authService.logIn(loginRequest)

        if(result instanceof ServerError) {
            next(result)
        } else {
            res.send(result)
        } 
    }

    async logOut(req: Request, res: Response, next: NextFunction) {
        
    }
}

const authController = new AuthController()
const router = express.Router()

router.post("/login", async (req: Request, res: Response, next: NextFunction) => {
    authController.logIn(req, res, next)
})

router.post("/logout", async (req: Request, res: Response, next: NextFunction) => {
    authController.logOut(req, res, next)
})

export default router