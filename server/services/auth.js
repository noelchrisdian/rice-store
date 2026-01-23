import fs from 'fs/promises';
import juice from 'juice';
import jwt from 'jsonwebtoken';
import Mustache from 'mustache';
import path from 'path';
import { BadRequest } from '../errors/badRequest.js';
import { createTransport } from 'nodemailer';
import { NotFound } from '../errors/notFound.js';
import { ParseError } from '../errors/parseError.js';
import {
    passwordSchema,
    emailSchema,
    userSchema
} from '../utils/zod.js';
import { resetPasswordModel as ResetPassword } from '../api/password/model.js';
import { StatusCodes } from 'http-status-codes';
import { Unauthorized } from "../errors/unauthorized.js";
import { userModel as Users } from "../api/users/model.js";
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
        role: user.role,
    }, process.env.JWT_SECRET, { expiresIn: '6h' })

    return {
        name: user.name,
        role: user.role,
        avatar: {
            imageURL: user.avatar.imageURL
        },
        token
    }
}

const signup = async (req) => {
    const imageURL = req.file?.path || process.env.DEFAULT_AVATAR_URL;
    const imagePublicID = req.file?.filename || process.env.DEFAULT_AVATAR_PUBLIC_ID;

    const parse = await userSchema.safeParseAsync(req.body);
    if (!parse.success) {
        if (imagePublicID) {
            await cloudinary.uploader.destroy(imagePublicID);
        }

        const errors = parse.error.issues.map((error) => error.message);
        throw new ParseError('Invalid data type', StatusCodes.BAD_REQUEST, errors);
    }

    const check = await Users.findOne({ phoneNumber: parse.data.phoneNumber });
    if (check) {
        if (imagePublicID) {
            await cloudinary.uploader.destroy(imagePublicID);
        }

        throw new BadRequest('Phone number existed');
    }

    if (parse.data.password !== parse.data.confirmPassword) {
        if (imagePublicID) {
            await cloudinary.uploader.destroy(imagePublicID);
        }

        throw new BadRequest(`Passwords don't match`);
    }

    return Users.create({
        name: parse.data.name,
        phoneNumber: parse.data.phoneNumber,
        email: parse.data.email,
        password: parse.data.password,
        role: 'customer',
        avatar: {
            imageURL,
            imagePublicID
        },
        address: parse.data.address,
    })
}

const resetPassword = async (req) => {
    const parse = await emailSchema.safeParseAsync(req.body);
    if (!parse.success) {
        const errors = parse.error.issues.map((error) => error.message);
        throw new ParseError('Invalid data type', StatusCodes.BAD_REQUEST, errors);
    }

    const user = await Users.findOne({ email: parse.data.email });
    if (!user) {
        throw new NotFound(`User doesn't exist`);
    }

    const token = jwt.sign(
        { email: parse.data.email },
        process.env.JWT_SECRET,
        { expiresIn: '15m' }
    )

    const duration = new Date(Date.now() + 15 * 60 * 1000);

    await ResetPassword.deleteMany({ user: user._id });
    await ResetPassword.create({
        user: user._id,
        token,
        expiresAt: duration
    })

    const link = `${process.env.RESET_PASSWORD_URL}?token=${token}`;

    const transporter = createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_ADMIN,
            pass: process.env.EMAIL_PASSWORD
        }
    })

    const template = await fs.readFile(path.join(process.cwd(), 'public', 'reset.html'), 'utf-8');
    let html = Mustache.render(template, { link });
    html = juice(html);

    await transporter.sendMail({
        from: process.env.EMAIL_ADMIN,
        to: user.email,
        subject: 'Reset Kata Sandi',
        html
    })

    return link;
}

const getResetToken = async (req) => {
    const { token } = req.query;
    return await ResetPassword.findOne({ token });
}

const changePassword = async (req) => {
    const { token } = req.query;

    const check = await ResetPassword.findOne({ token });
    if (!check) {
        throw new BadRequest('Invalid token');
    }

    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        await ResetPassword.deleteOne({ token });
        throw new BadRequest('Invalid / expired token');
    }

    const parse = await passwordSchema.safeParseAsync(req.body);
    if (!parse.success) {
        const errors = parse.error.issues.map((error) => error.message);
        throw new ParseError('Invalid data type', StatusCodes.BAD_REQUEST, errors);
    }

    if (parse.data.password !== parse.data.confirmPassword) {
        throw new BadRequest(`Passwords don't match`);
    }

    const user = await Users.findOne({ email: decoded.email });
    if (!user) {
        throw new NotFound('User not found');
    }

    user.password = parse.data.password;
    await user.save();
    await ResetPassword.deleteOne({ token });

    return user;
}

const updateUser = async (req) => {
    const imageURL = req.file?.path;
    const imagePublicID = req.file?.filename;

    const user = await Users.findOne({ _id: req.user.id });
    if (!user) {
        if (imagePublicID) {
            await cloudinary.uploader.destroy(imagePublicID);
        }

        throw new NotFound(`User doesn't exist`);
    }

    const parse = await userSchema.safeParseAsync(req.body);
    if (!parse.success) {
        if (imagePublicID) {
            await cloudinary.uploader.destroy(imagePublicID);
        }

        const errors = parse.error.issues.map((error) => error.message);
        throw new ParseError('Invalid data type', StatusCodes.BAD_REQUEST, errors);
    }

    if (parse.data.email && parse.data.email !== user.email) {
        const exist = await Users.findOne({ email: parse.data.email });
        if (exist) {
            throw new BadRequest(`Email already in use`);
        }
    }

    if (parse.data.phoneNumber && parse.data.phoneNumber !== user.phoneNumber) {
        const exist = await Users.findOne({ phoneNumber: parse.data.phoneNumber });
        if (exist) {
            throw new BadRequest(`Phone number already in use`);
        }
    }

    user.name = parse.data.name;
    user.phoneNumber = parse.data.phoneNumber;
    user.email = parse.data.email;
    user.address = parse.data.address;

    if (parse.data.password && parse.data.confirmPassword) {
        if (parse.data.password !== parse.data.confirmPassword) {
            if (imagePublicID) {
                await cloudinary.uploader.destroy(imagePublicID);
            }

            throw new BadRequest(`Passwords don't match`);
        }

        user.password = parse.data.password;
    }

    if (imageURL && imagePublicID) {
        if (user.avatar.imagePublicID && user.avatar.imagePublicID !== process.env.DEFAULT_AVATAR_PUBLIC_ID) {
            await cloudinary.uploader.destroy(user.avatar.imagePublicID)
        }

        user.avatar.imageURL = imageURL;
        user.avatar.imagePublicID = imagePublicID;
    }
    await user.save();

    return user;
}

export {
    changePassword,
    getResetToken,
    resetPassword,
    signin,
    signup,
    updateUser
}