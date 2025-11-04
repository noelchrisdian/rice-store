import {
    changePassword,
    resetPassword,
    signin,
    signup,
    updateUser
} from "../../services/auth.js";
import { StatusCodes } from "http-status-codes";
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

const reset = async (req, res, next) => {
    try {
        const link = await resetPassword(req);
        success(res, link, 'Link has been sent to registered email');
    } catch (error) {
        next(error);
    }
}

const change = async (req, res, next) => {
    try {
        const user = await changePassword(req);
        success(res, user, 'Password has been changed');
    } catch (error) {
        next(error);
    }
}

const update = async (req, res, next) => {
    try {
        const user = await updateUser(req);
        success(res, user, `User ${user.name} has been updated`);
    } catch (error) {
        next(error);
    }
}

export {
    change,
    login,
    register,
    reset,
    update
}