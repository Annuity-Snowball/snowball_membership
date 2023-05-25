import express from 'express'
import cors from 'cors'
import routerConfig from './config/router.config'

const app = express()
const PORT = 10000

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use('/', routerConfig)

app.listen(PORT, () => {
    console.log(`The Express server is listening at port: ${PORT}`)
})