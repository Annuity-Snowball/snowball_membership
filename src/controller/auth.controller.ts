import express, { Request, Response, NextFunction } from 'express'

export class AuthController {

}

const authController = new AuthController()
const router = express.Router()

router.post("/login", async (req: Request, res: Response, next: NextFunction) => {

})

router.post("/logout", async (req: Request, res: Response, next: NextFunction) => {

})

export default router