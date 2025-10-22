import jwt from 'jsonwebtoken';
import { BadRequest } from '../errors/badRequest.js';
import { ParseError } from '../errors/parseError.js';
import { StatusCodes } from 'http-status-codes';
import { Unauthorized } from "../errors/unauthorized.js";
import { userModel as Users } from "../api/users/model.js";
import { userSchema } from '../utils/zod.js';
import { v2 as cloudinary } from 'cloudinary';

const signin = async (req) => {
    const { phoneNumber, password } = req.body;
    if (!phoneNumber || !password) {
        throw new BadRequest('Please provide phone number and password');
    }

    const user = await Users.findOne({ phoneNumber });
    if (!user) {
        throw new Unauthorized(`Phone number is not registered`);
    }

    const comparePassword = await user.comparePassword(password);
    if (!comparePassword) {
        throw new Unauthorized('Incorrect password');
    }

    const token = jwt.sign({
        id: user._id,
        phoneNumber: user.phoneNumber,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: {
            imageURL: user.avatar.imageURL,
            imagePublicID: user.avatar.imagePublicID
        }
    }, process.env.JWT_SECRET, { expiresIn: '6h' })

    return {
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
        avatar: {
            imageURL: user.avatar.imageURL,
            imagePublicID: user.avatar.imagePublicID
        },
        token
    }
}

const signup = async (req) => {
    const {
        name,
        phoneNumber,
        email,
        password,
        confirmPassword,
        role,
        address
    } = req.body;

    const imageURL = req.file?.path;
    const imagePublicID = req.file?.filename;

    const check = await Users.findOne({ phoneNumber });
    if (check) {
        if (imagePublicID) {
            await cloudinary.uploader.destroy(imagePublicID);
        }

        throw new BadRequest('Phone number existed');
    }

    if (password !== confirmPassword) {
        if (imagePublicID) {
            await cloudinary.uploader.destroy(imagePublicID);
        }

        throw new BadRequest(`Passwords don't match`);
    }

    const parse = await userSchema.safeParseAsync({
        name,
        phoneNumber,
        email,
        password,
        role,
        address
    })
    if (!parse.success) {
        if (imagePublicID) {
            await cloudinary.uploader.destroy(imagePublicID);
        }

        const errors = parse.error.issues.map((error) => error.message);
        throw new ParseError('Invalid data type', StatusCodes.BAD_REQUEST, errors);
    }

    return Users.create({
        name: parse.data.name,
        phoneNumber: parse.data.phoneNumber,
        email: parse.data.email,
        password: parse.data.password,
        role: parse.data.role,
        avatar: {
            imageURL,
            imagePublicID
        },
        address: parse.data.address,
    })
}

export {
    signin,
    signup
}