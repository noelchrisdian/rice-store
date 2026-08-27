import { StatusCodes } from "http-status-codes"

const SendSuccess = (res, data = {}, message, statusCode = StatusCodes.OK) => {
    return res.status(statusCode).json({
        data,
        status: 'success',
        message
    })
}

export {
    SendSuccess
}