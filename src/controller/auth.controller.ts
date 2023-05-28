import express, { Request, Response, NextFunction } from 'express'
import { LogInRequest } from '../model/auth.model.ts'
import { AuthService } from '../service/auth.service.ts'
import { ServerError } from '../exception/serverError.ts'
import { NoTokenError } from '../exception/serverError.ts'
import { verifyAccessToken } from '../utils/jwt.util.ts'
import { handleErrorInAccessToken, generateNewAccessToken } from '../utils/authenticate.util.ts'

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

    async verify(req: Request, res: Response, next: NextFunction) {
        const authHeader = req.headers.authorization
        const refreshKey = req.headers['x-refresh-token']

        if (!authHeader || !refreshKey) {
            next(new NoTokenError("there is no token in header"))
            return
        }

        const accessToken = authHeader.split(" ")[1]
        const accessVerifyResult = await verifyAccessToken(accessToken)

        if (accessVerifyResult instanceof ServerError) {
            await handleErrorInAccessToken(res, next, accessVerifyResult, refreshKey)
        } else {
            await generateNewAccessToken(res, accessVerifyResult)
        }
        res.send()
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

router.get("/verify", async (req: Request, res: Response, next: NextFunction) => {
    authController.verify(req, res, next)
})

export default router