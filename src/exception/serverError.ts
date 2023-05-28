export class ServerError extends Error {
    status: number
    message: string

    constructor(status: number, message: string) {
        super(message)
        this.status = status

        Object.setPrototypeOf(this, ServerError.prototype)
    }
}

export class EmailDuplicateError extends ServerError {
    constructor(message: string, status: number = 400) {
        super(status, message);
        this.name = 'EmailDuplicateError';
    }
}

export class UsernameDuplicateError extends ServerError {
    constructor(message: string, status: number = 400) {
        super(status, message);
        this.name = 'UsernameDuplicateError';
    }
}

export class UserNotExistError extends ServerError {
    constructor(message: string, status: number = 400) {
        super(status, message);
        this.name = 'UserNotExistError';
    }
}

export class PasswordNotMatchError extends ServerError {
    constructor(message: string, status: number = 400) {
        super(status, message);
        this.name = 'PasswordNotMatchError';
    }
}

export class NoTokenError extends ServerError {
    constructor(message: string, status: number = 400) {
        super(status, message);
        this.name = 'NoTokenError';
    }
}

export class AccessTokenExpiredError extends ServerError {
    constructor(message: string, status: number = 400) {
        super(status, message);
        this.name = 'AccessTokenExpiredError';
    }
}

export class RefreshTokenExpiredError extends ServerError {
    constructor(message: string, status: number = 400) {
        super(status, message);
        this.name = 'RefreshTokenExpiredError';
    }
}

export class TokenNotValidateError extends ServerError {
    constructor(message: string, status: number = 400) {
        super(status, message);
        this.name = 'TokenNotValidateError';
    }
}