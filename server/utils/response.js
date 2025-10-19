import { StatusCodes } from "http-status-codes"

const success = (res, data, message, statusCode = StatusCodes.OK) => {
    return res.status(statusCode).json({
        data,
        status: 'success',
        message
    })
}

export {
    success
}