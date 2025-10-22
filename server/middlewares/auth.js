import jwt from 'jsonwebtoken';
import { Forbidden } from '../errors/forbidden.js';
import { Unauthorized } from "../errors/unauthorized.js";

const authenticated = async (req, res, next) => {
    try {
        let token;
        const header = req.headers.authorization;
        if (header?.startsWith('Bearer')) {
            token = header.split(' ')[1];
        }
    
        if (!token) {
            throw new Unauthorized('Authentication failed, please sign in again');
        }
    
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.user = {
            id: payload.id,
            phoneNumber: payload.phoneNumber,
            email: payload.email,
            name: payload.name,
            role: payload.role,
            avatar: {
                imageURL: payload.avatar.imageURL,
                imagePublicID: payload.avatar.imagePublicID
            }
        }

        next();
    } catch (error) {
        next(error);
    }
}

const authorize = (role) => (req, res, next) => {
    if (req?.user?.role === role) {
        return next();
    }

    throw new Forbidden('Only administrators can access this resources');
} 


export {
    authenticated,
    authorize
}