import mongoose from "mongoose";
import { addProductSchema, updateProductSchema } from "../utils/zod.js";
import { BadRequest } from "../errors/badRequest.js";
import { inventoryModel as Inventories } from "../api/inventories/model.js";
import { NotFound } from "../errors/notFound.js";
import { ParseError } from "../errors/parseError.js";
import { productModel as Products } from "../api/products/model.js";
import { StatusCodes } from "http-status-codes";
import { v2 as cloudinary } from "cloudinary";

const getProducts = async () => {
    return await Products.find().populate({
        path: 'inventories',
        select: 'product quantity remaining receivedAt'
    })
}

const getProduct = async (req) => {
    const { id } = req.params;
    const product = await Products.findOne({ _id: id }).populate({
        path: 'inventories',
        select: 'product quantity remaining receivedAt'
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

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const {
            name,
            price,
            description,
            unit,
            quantity,
            receivedAt
        } = req.body

        const imageURL = req.file?.path;
        const imagePublicID = req.file?.filename;
    
        const check = await Products.findOne({ name });
        if (check) {
            if (imagePublicID) {
                await cloudinary.uploader.destroy(imagePublicID);
            }

            throw new BadRequest('Product existed');
        }
    
        const parse = await addProductSchema.safeParseAsync({
            name,
            price,
            description,
            unit,
            quantity,
            receivedAt,
            image: {
                imageURL,
                imagePublicID
            }
        })

        if (!parse.success) {
            if (imagePublicID) {
                await cloudinary.uploader.destroy(imagePublicID);
            }

            const errors = parse.error.issues.map((error) => error.message);
            throw new ParseError('Invalid data type', StatusCodes.BAD_REQUEST, errors);
        }
    
        const [product] = await Products.create([{
            name: parse.data.name,
            price: parse.data.price,
            image: {
                imageURL: parse.data.image.imageURL,
                imagePublicID: parse.data.image.imagePublicID
            },
            description: parse.data.description,
            unit: parse.data.unit,
            inventories: []
        }], { session })
        
        const [inventory] = await Inventories.create([{
            product: product._id,
            quantity: parse.data.quantity,
            remaining: parse.data.quantity,
            receivedAt: parse.data.receivedAt,
            expiredAt: (() => {
                const date = new Date(parse.data.receivedAt);
                date.setFullYear(date.getFullYear() + 1);
                return date;
            })()
        }], { session })
        
        product.inventories.push(inventory._id);
        await product.save({ session });
        await session.commitTransaction();

        return { product, inventory };
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
}

const updateProduct = async (req) => {
    const { id } = req.params;
    const product = await Products.findOne({ _id: id });
    if (!product) {
        throw new NotFound(`Product doesn't exist`);
    }

    const {
        name,
        price,
        description,
        unit,
        receivedAt
    } = req.body;
    const check = await Products.findOne({ name, _id: { $ne: id } });
    if (check) {
        throw new BadRequest('Product existed');
    }

    const parse = await updateProductSchema.safeParseAsync({
        name,
        price,
        description,
        unit,
        receivedAt
    })
    if (!parse.success) {
        const errors = parse.error.issues.map((error) => error.message);
        throw new ParseError('Invalid data type', StatusCodes.BAD_REQUEST, errors)
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