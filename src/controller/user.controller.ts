import express, { Request, Response, NextFunction } from 'express'
import { UserService } from '../service/user.service.ts'
import { ServerError } from '../exception/serverError.ts'
import { SignUpRequest } from '../model/user.model.ts'
import { vertifyToken } from '../utils/authenticate.util.ts'

class UserController {
    private userService: UserService
    constructor() {
        this.userService = new UserService()
    }

    public async checkDuplicateEmail(req: Request, res: Response, next: NextFunction) {
        const email = req.params.email
        const result = await this.userService.checkEmailDuplication(email)

        if(result instanceof ServerError){
            next(result)
        } else {
            res.send("available email")
        }
    }

    public async checkDuplicateUsername(req: Request, res: Response, next: NextFunction) {
        const username = req.params.username
        const result = await this.userService.checkUsernameDuplication(username)

        if(result instanceof ServerError){
            next(result)
        } else {
            res.send("available username")
        }
    }

    // TODO: email 형식 검증, 비밀번호 규칙 검증 있어야함.
    public async signUp(req: Request, res: Response, next: NextFunction) {
        const signUpRequest = new SignUpRequest(req)

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

/**
 * @swagger
 * /user/checkDuplicate/email/{email}:
 *   get:
 *     tags: [User]
 *     summary: Check duplicate email
 *     parameters:
 *       - in: path
 *         name: email
 *         schema:
 *           type: string
 *         required: true
 *         description: Email to check for duplication
 *     responses:
 *       200:
 *         description: available email
 *       400:
 *         description: email already exists
 */
router.get('/checkDuplicate/email/:email', (req: Request, res: Response, next: NextFunction) => {
    userController.checkDuplicateEmail(req, res, next)
})

/**
 * @swagger
 * /user/checkDuplicate/username/{username}:
 *   get:
 *     tags: [User]
 *     summary: Check duplicate username
 *     parameters:
 *       - in: path
 *         name: username
 *         schema:
 *           type: string
 *         required: true
 *         description: Username to check for duplication
 *     responses:
 *       200:
 *         description: available username
 *       400:
 *         description: username already exists
 */
router.get('/checkDuplicate/username/:username', (req: Request, res: Response, next: NextFunction) => {
    userController.checkDuplicateUsername(req, res, next)
})

/**
 * @swagger
 * /user/signUp:
 *   post:
 *     tags: [User]
 *     summary: User signup
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful signup
 *       400:
 *         description: Signup failed
 */
router.post('/signUp', (req: Request, res: Response, next: NextFunction) => {
    userController.signUp(req, res, next)
})

// TODO: check auth
router.put('/password', vertifyToken, (req: Request, res: Response, next: NextFunction) => {
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