import { StatusCodes } from "http-status-codes";
import { signin, signup } from "../../services/auth.js";
import { success } from "../../utils/response.js";

const login = async (req, res, next) => {
    try {
        const result = await signin(req);
        success(res, result, 'Sign in successful');
    } catch (error) {
        next(error);
    }
}

const register = async (req, res, next) => {
    try {
        const user = await signup(req);
        success(res, user, 'Sign up successful', StatusCodes.CREATED);
    } catch (error) {
        next(error);
    }
}

export {
    login,
    register
}