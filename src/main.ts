import express from 'express'
import cors from 'cors'
import routerConfig from './config/router.config.ts'
import { databaseInitialize } from './config/db.config.ts'
import { errorHandler } from './exception/errorResponse.ts'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const PORT = process.env.PORT

await databaseInitialize()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use('/', routerConfig)
app.use(errorHandler)

app.listen(PORT, () => {
    console.log(`The Express server is listening at port: ${PORT}`)
})