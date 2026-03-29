import mongoose from "mongoose";
import { BadRequest } from "../errors/badRequest.js";
import { cloudinaryUploader } from "../utils/multer.js";
import { inventoryModel as Inventories } from "../api/inventories/model.js";
import { NotFound } from "../errors/notFound.js";
import { ParseError } from "../errors/parseError.js";
import { productModel as Products } from "../api/products/model.js";
import { productSchema } from "../utils/zod.js";
import { StatusCodes } from "http-status-codes";
import { v2 as cloudinary } from "cloudinary";

const getProducts = async () => {
    return await Products.find().populate('inventories', 'remaining');
}

const getProduct = async (req) => {
    const { id } = req.params;
    const product = await Products.findById(id).populate({
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
    let uploadImage;

    try {
        const parse = await productSchema.safeParseAsync(req.body);
        if (!parse.success) {
            const errors = parse.error.issues.map((error) => error.message);
            throw new ParseError('Invalid data type', StatusCodes.BAD_REQUEST, errors)
        }
    
        const check = await Products.findOne({ name: parse.data.name });
        if (check) throw new BadRequest('Product existed');

        uploadImage = await cloudinaryUploader(req.file.buffer, 'products')
        
        return await Products.create({
            name: parse.data?.name,
            price: parse.data?.price,
            image: {
                imageURL: uploadImage.secure_url,
                imagePublicID: uploadImage.public_id
            },
            description: parse.data?.description,
            unit: 'package',
            weightPerUnit: parse.data?.weightPerUnit, 
            inventories: []
        })
    } catch (error) {
        if (uploadImage?.public_id) {
            await cloudinary.uploader.destroy(uploadImage.public_id);
        }
        throw error;
    }

}

const updateProduct = async (req) => {
    const { id } = req.params;
    const product = await Products.findOne({ _id: id });
    if (!product) throw new NotFound(`Product doesn't exist`);

    const parse = await productSchema.safeParseAsync(req.body);
    if (!parse.success) {
        const errors = parse.error.issues.map((error) => error.message);
        throw new ParseError('Invalid data type', StatusCodes.BAD_REQUEST, errors)
    }

    const check = await Products.findOne({ name: parse.data.name, _id: { $ne: id } });
    if (check) throw new BadRequest('Product existed');

    const data = { ...parse.data };
    let uploadImage;
    try {
        if (req.file) {
            uploadImage = await cloudinaryUploader(req.file.buffer, 'products');
            data.image = {
                imageURL: uploadImage.secure_url,
                imagePublicID: uploadImage.public_id
            }
        }

        const updated = await Products.findOneAndUpdate(
            { _id: id },
            data,
            { new: true }
        )

        if (req.file && product.image?.imagePublicID) {
            await cloudinary.uploader.destroy(product.image.imagePublicID);
        }

        return updated;
    } catch (error) {
        if (uploadImage?.public_id) {
            await cloudinary.uploader.destroy(uploadImage.public_id)
        }
        throw error;
    }
}

const deleteProduct = async (req) => {
    const { id } = req.params;
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const product = await Products.findOneAndDelete({ _id: id }).session(session);
        if (!product) throw new NotFound(`Product doesn't exist`);

        const imagePublicID = product.image.imagePublicID;
        await cloudinary.uploader.destroy(imagePublicID);
        await Inventories.deleteMany({ product: product._id }).session(session);

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