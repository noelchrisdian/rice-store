import {
    signin,
    signup,
    updateUser
} from "../../services/auth.js";
import { StatusCodes } from "http-status-codes";
import { success } from "../../utils/response.js";

const login = async (req, res, next) => {
    try {
        const { token, user } = await signin(req);

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 6 * 60 * 60 * 1000
        })

        success(res, {
            name: user.name,
            role: user.role,
            avatar: {
                imageURL: user.avatar.imageURL
            }
        }, 'Sign in successful');
    } catch (error) {
        next(error);
    }
}

const logout = async (req, res) => {
    res.clearCookie('token', {
        httpOnly: true, 
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    })

    success(res, {}, 'Sign out successful');
}

const register = async (req, res, next) => {
    try {
        const user = await signup(req);
        success(res, user, 'Sign up successful', StatusCodes.CREATED);
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
    login,
    logout,
    register,
    update
}