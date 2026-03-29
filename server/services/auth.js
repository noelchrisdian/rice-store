import jwt from 'jsonwebtoken';
import { BadRequest } from '../errors/badRequest.js';
import { cloudinaryUploader } from '../utils/multer.js';
import { NotFound } from '../errors/notFound.js';
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
    let uploadImage;

    try {
        const parse = await userSchema.safeParseAsync(req.body);
        if (!parse.success) {
            const errors = parse.error.issues.map((error) => error.message);
            throw new ParseError('Invalid data type', StatusCodes.BAD_REQUEST, errors);
        }

        const check = await Users.findOne({
            $or: [
                { phoneNumber: parse.data.phoneNumber },
                { email: parse.data.email }
            ]
        })
        if (check) {
            if (check.email === parse.data.email) {
                throw new BadRequest('Email existed');
            }

            if (check.phoneNumber === parse.data.phoneNumber) {
                throw new BadRequest('Phone number existed');
            }
        }

        if (parse.data.password !== parse.data.confirmPassword) throw new BadRequest(`Passwords don't match`);

        if (req.file) {
            uploadImage = await cloudinaryUploader(req.file.buffer, 'avatar');
        }

        return Users.create({
            name: parse.data.name,
            phoneNumber: parse.data.phoneNumber,
            email: parse.data.email,
            password: parse.data.password,
            role: 'customer',
            avatar: {
                imageURL: uploadImage?.secure_url || process.env.DEFAULT_AVATAR_URL,
                imagePublicID: uploadImage?.public_id || process.env.DEFAULT_AVATAR_PUBLIC_ID
            },
            address: parse.data.address
        })
    } catch (error) {
        if (uploadImage?.public_id) {
            await cloudinary.uploader.destroy(uploadImage.public_id);
        }
        throw error;
    }
}

const updateUser = async (req) => {
    let uploadImage;

    try {
        const user = await Users.findOne({ _id: req.user.id });
        if (!user) throw new NotFound(`User doesn't exist`);

        const parse = await userSchema.safeParseAsync(req.body);
        if (!parse.success) {
            const errors = parse.error.issues.map((error) => error.message);
            throw new ParseError('Invalid data type', StatusCodes.BAD_REQUEST, errors);
        }

        if (parse.data.email && parse.data.email !== user.email) {
            const exist = await Users.findOne({ email: parse.data.email, _id: { $ne: user._id } });
            if (exist) throw new BadRequest(`Email already in use`);
        }

        if (parse.data.phoneNumber && parse.data.phoneNumber !== user.phoneNumber) {
            const exist = await Users.findOne({ phoneNumber: parse.data.phoneNumber, _id: { $ne: user._id } });
            if (exist) throw new BadRequest(`Phone number already in use`);
        }

        if (parse.data.name) user.name = parse.data.name;
        if (parse.data.phoneNumber) user.phoneNumber = parse.data.phoneNumber;
        if (parse.data.email) user.email = parse.data.email;
        if (parse.data.address) user.address = parse.data.address;

        if (parse.data.password || parse.data.confirmPassword) {
            if (parse.data.password !== parse.data.confirmPassword) throw new BadRequest(`Passwords don't match`);

            user.password = parse.data.password;
        }

        const oldPublicID = user.avatar?.imagePublicID;
        if (req.file) {
            uploadImage = await cloudinaryUploader(req.file.buffer, 'avatar');
            user.avatar.imageURL = uploadImage.secure_url;
            user.avatar.imagePublicID = uploadImage.public_id;
        }

        await user.save();
        if (req.file && (oldPublicID && oldPublicID !== process.env.DEFAULT_AVATAR_PUBLIC_ID)) {
            await cloudinary.uploader.destroy(oldPublicID)
        }

        return user;
    } catch (error) {
        if (uploadImage?.public_id) {
            await cloudinary.uploader.destroy(uploadImage.public_id);
        }
        throw error;
    }
}

export {
    signin,
    signup,
    updateUser
}