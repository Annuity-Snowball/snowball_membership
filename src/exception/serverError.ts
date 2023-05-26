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