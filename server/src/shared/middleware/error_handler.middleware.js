import { StatusCodes } from "http-status-codes";

const errorHandler = (err, req, res, next) => {
    const customError = {
        statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
        message: err.message || 'Something went wrong, try again later',
        errors: err.errors || undefined
    }

    return res.status(customError.statusCode).json({
        data: null,
        status: 'failed',
        message: customError.message,
        ...(customError.errors && ({ errors: customError.errors }))
    })
}

export {
    errorHandler
}