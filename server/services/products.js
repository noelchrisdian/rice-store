import mongoose from "mongoose";
import { BadRequest } from "../errors/badRequest.js";
import { inventoryModel as Inventories } from "../api/inventories/model.js";
import { NotFound } from "../errors/notFound.js";
import { ParseError } from "../errors/parseError.js";
import { productModel as Products } from "../api/products/model.js";
import { productSchema } from "../utils/zod.js";
import { StatusCodes } from "http-status-codes";
import { v2 as cloudinary } from "cloudinary";

const getProducts = async () => {
    return await Products.find().populate({
        path: 'inventories',
        select: 'product quantity remaining receivedAt expiredAt'
    })
}

const getProduct = async (req) => {
    const { id } = req.params;
    const product = await Products.findOne({ _id: id }).populate({
        path: 'inventories',
        select: 'product quantity remaining receivedAt expiredAt'
    })

    if (!product) {
        throw new NotFound('Product not found');
    }

    return product;
}

const createProduct = async (req) => {
    if (!req.file) {
        throw new BadRequest('Image is required');
    }

    const imageURL = req.file?.path;
    const imagePublicID = req.file?.filename;

    const parse = await productSchema.safeParseAsync(req.body);
    if (!parse.success) {
        if (imagePublicID) {
            await cloudinary.uploader.destroy(imagePublicID);
        }

        const errors = parse.error.issues.map((error) => error.message);
        throw new ParseError('Invalid data type', StatusCodes.BAD_REQUEST, errors)
    }

    const check = await Products.findOne({ name: parse.data.name });
    if (check) {
        if (imagePublicID) {
            await cloudinary.uploader.destroy(imagePublicID);
        }

        throw new BadRequest('Product existed');
    }

    return await Products.create({
        name: parse.data?.name,
        price: parse.data?.price,
        image: {
            imageURL,
            imagePublicID
        },
        description: parse.data?.description,
        unit: 'package',
        weightPerUnit: parse.data?.weightPerUnit, 
        inventories: []
    })
}

const updateProduct = async (req) => {
    const { id } = req.params;
    const product = await Products.findOne({ _id: id });
    if (!product) {
        throw new NotFound(`Product doesn't exist`);
    }

    const parse = await productSchema.safeParseAsync(req.body);
    if (!parse.success) {
        const errors = parse.error.issues.map((error) => error.message);
        throw new ParseError('Invalid data type', StatusCodes.BAD_REQUEST, errors)
    }

    const check = await Products.findOne({ name: parse.data.name, _id: { $ne: id } });
    if (check) {
        throw new BadRequest('Product existed');
    }

    const data = { ...parse.data };
    if (req.file) {
        const oldPublicID = product.image.imagePublicID;

        data.image = {
            imageURL: req.file?.path,
            imagePublicID: req.file?.filename
        }

        if (oldPublicID) {
            await cloudinary.uploader.destroy(oldPublicID);
        }
    }

    return await Products.findOneAndUpdate(
        { _id: id },
        data,
        { new: true }
    )
}

const deleteProduct = async (req) => {
    const { id } = req.params;
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const product = await Products.findOne({ _id: id }).session(session);
        if (!product) {
            throw new NotFound(`Product doesn't exist`);
        }

        const imagePublicID = product.image.imagePublicID;
        await cloudinary.uploader.destroy(imagePublicID);
        await Inventories.deleteMany({ product: product._id }).session(session);
        await product.deleteOne({ session });

        await session.commitTransaction();
        return product;
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
}

export {
    createProduct,
    deleteProduct,
    getProduct,
    getProducts,
    updateProduct
}