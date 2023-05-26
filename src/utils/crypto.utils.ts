import * as crypto from 'crypto' 

export const generateSalt = async (): Promise<string> => {
    return crypto.randomBytes(16).toString('hex');
}

export const hashPassword = async (password: string, salt: string): Promise<string> => {
    return crypto
        .pbkdf2Sync(password, salt, 1000, 64, 'sha512')
        .toString('hex');
}