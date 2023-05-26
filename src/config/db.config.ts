import { createClient } from "redis"
import { Client } from "redis-om"
import { DataSource } from "typeorm" 
import dotenv from 'dotenv'

dotenv.config()

export const mySqlClient = new DataSource({
    type: "mysql",
    host: process.env.MYSQL_ADDRESS,
    port: +process.env.MYSQL_PORT,
    username: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB,
    synchronize: true,
    logging: true,
    entities: ["src/entity/*.ts"],
    migrations: [
        "src/migration/**/*.ts"
    ],
    subscribers: [
        "src/subscriber/**/*.ts"
    ]
})



export const databaseInitialize = async () => {
    await mySqlClient.initialize()
        .then(() => {
            console.log("Mysql Data Source has been initialized!")
        })
        .catch((err) => {
            console.error("Error during Mysql Data Source initialization", err)
        })
    
    
}
