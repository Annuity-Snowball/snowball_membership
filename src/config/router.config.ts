import express from 'express'
import userRouter from '../controller/user.controller.ts'
import authRouter from '../controller/auth.controller.ts'

const routerConfig = express.Router()

routerConfig.use('/user', userRouter)
routerConfig.use('/auth', authRouter)

export default routerConfig