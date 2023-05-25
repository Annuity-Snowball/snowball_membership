import express from 'express'
import cors from 'cors'

const app = express()
const PORT = 10000

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.listen(PORT, () => {
    console.log(`The Express server is listening at port: ${PORT}`)
})