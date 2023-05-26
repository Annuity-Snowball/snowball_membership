import express, { Request, Response, NextFunction } from 'express'
import { UserService } from '../service/user.service.ts'
import { ServerError } from '../exception/serverError.ts'
import { SignUpRequest } from '../model/user.model.ts'

class UserController {
    private userService: UserService
    constructor() {
        this.userService = new UserService()
    }

    public async checkDuplicateEmail(req: Request, res: Response, next: NextFunction) {
        const email = req.body.email
        const result = await this.userService.checkEmailDuplication(email)

        if(result instanceof ServerError){
            next(result)
        } else {
            res.send("available email")
        }
    }

    public async checkDuplicateUsername(req: Request, res: Response, next: NextFunction) {
        const username = req.body.username
        const result = await this.userService.checkUsernameDuplication(username)

        if(result instanceof ServerError){
            next(result)
        } else {
            res.send("available username")
        }
    }

    // TODO: email 형식 검증, 비밀번호 규칙 검증 있어야함.
    public async signUp(req: Request, res: Response, next: NextFunction) {
        const signUpRequest: SignUpRequest = {
            email: req.body.email,
            username: req.body.username,
            password: req.body.password
        }
        const result = await this.userService.createUser(signUpRequest)

        if(result instanceof ServerError){
            next(result)
        } else {
            res.send(`${signUpRequest.username} has signUp successfully`)
        }
    }

    public async updatePassword(req: Request, res: Response, next: NextFunction) {

    }

    public async updateUsername(req: Request, res: Response, next: NextFunction) {

    }

    public async signDrop(req: Request, res: Response, next: NextFunction) {

    }

}

const userController = new UserController()
const router = express.Router()

router.get('/checkDuplicate/email', (req: Request, res: Response, next: NextFunction) => {
    userController.checkDuplicateEmail(req, res, next)
})

router.get('/checkDuplicate/username', (req: Request, res: Response, next: NextFunction) => {
    userController.checkDuplicateUsername(req, res, next)
})

router.post('/signUp', (req: Request, res: Response, next: NextFunction) => {
    userController.signUp(req, res, next)
})
// TODO: check auth
router.put('/password', (req: Request, res: Response, next: NextFunction) => {
    userController.updatePassword(req, res, next)
})
// TODO: check auth
router.put('/username', (req: Request, res: Response, next: NextFunction) => {
    userController.updateUsername(req, res, next)
})
// TODO: check auth
router.delete('/signDrop', (req: Request, res: Response, next: NextFunction) => {
    userController.signDrop(req, res, next)
})


export default router