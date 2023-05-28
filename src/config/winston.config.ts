import winston, { transports } from 'winston'
import DailyRotateFile from 'winston-daily-rotate-file';

class CustomRotateFile extends DailyRotateFile {
    constructor(level: string) {
        super({
            level: level,
            dirname: `./log/%DATE%/`,
            filename: `snowball-membership-${level}.log`,
            datePattern: 'YYYY-MM/DD',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d'
        });
    }
}

export const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
        winston.format.colorize()
    ),
    defaultMeta: {
        service: 'snowball-membership'
    },
    transports: [
        new winston.transports.Console(),
        new CustomRotateFile('error'),
        new CustomRotateFile('warn'),
        new CustomRotateFile('info'),
    ],
    exitOnError: false,
    exceptionHandlers: [
        new transports.File({filename: './log/exceptions.log'})
    ]
})