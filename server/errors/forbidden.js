import { StatusCodes } from "http-status-codes";

class Forbidden extends Error {
    constructor(message) {
        super(message);
        this.statusCode = StatusCodes.FORBIDDEN;
    }
}

export {
    Forbidden
}