import mongoose from "mongoose";
import { inventoryModel as Inventories } from "../api/inventories/model.js";
import { inventorySchema } from "../utils/zod.js";
import { NotFound } from "../errors/notFound.js";
import { ParseError } from "../errors/parseError.js";
import { productModel as Products } from "../api/products/model.js";
import { StatusCodes } from "http-status-codes";

const getInventories = async (req) => {
    const { productID } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const product = await Products.findOne({ _id: productID });
    if (!product) {
        throw new NotFound(`Product doesn't exist`);
    }

    const [inventories, total] = await Promise.all([
        Inventories.find({ product: productID })
            .sort({ receivedAt: 1 })
            .skip(skip)
            .limit(limit)
            .lean(),
        Inventories.countDocuments({ product: productID })
    ])

    const totalPages = Math.ceil(total / limit);
    return {
        inventories,
        meta: {
            total,
            page,
            limit,
            totalPages
        }
    }
}

const getInventory = async (req) => {
    const { inventoryID, productID } = req.params;
    const product = await Products.findById(productID);
    if (!product) {
        throw new NotFound(`Product doesn't exist`);
    }

    const inventory = await Inventories.findOne({
        _id: inventoryID,
        product: productID
    }).lean();
    if (!inventory) {
        throw new NotFound(`Inventory doesn't exist`);
    }

    return inventory;
}

const createInventory = async (req) => {
    const { productID } = req.params;
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const product = await Products.findOne({ _id: productID }).session(session);
        if (!product) {
            throw new NotFound(`Product doesn't exist`);
        }

        const parse = await inventorySchema.safeParseAsync(req.body);
        if (!parse.success) {
            const errors = parse.error.issues.map((error) => error.message);
            throw new ParseError('Invalid data type', StatusCodes.BAD_REQUEST, errors);
        }

        const [inventory] = await Inventories.create([{
            product: productID,
            quantity: parse.data.quantity,
            remaining: parse.data.quantity,
            receivedAt: parse.data.receivedAt,
            expiredAt: (() => {
                const date = new Date(parse.data.receivedAt);
                date.setFullYear(date.getFullYear() + 1);
                return date
            })()
        }], { session })

        product.inventories.push(inventory._id);
        await product.save({ session });
        await session.commitTransaction();

        return inventory;
    } catch (error) {
        session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
}

const updateInventory = async (req) => {
    const { inventoryID, productID } = req.params;
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const product = await Products.findOne({ _id: productID }).session(session);
        if (!product) {
            throw new NotFound(`Product doesn't exist`);
        }

        const existing = await Inventories.findOne({ _id: inventoryID }).session(session);
        if (!existing) {
            throw new NotFound(`Inventory doesn't exist`);
        }

        const parse = await inventorySchema.safeParseAsync(req.body);
        if (!parse.success) {
            const errors = parse.error.issues.map((error) => error.message);
            throw new ParseError('Invalid data type', StatusCodes.BAD_REQUEST, errors);
        }

        const consumed = existing.quantity - existing.remaining;
        const remaining = parse.data.quantity - consumed;
        if (remaining < 0) {
            throw new BadRequest(`Remaining stock couldn't be negative number`);
        }

        const inventory = await Inventories.findOneAndUpdate(
            { _id: inventoryID },
            {
                quantity: parse.data.quantity,
                remaining,
                receivedAt: parse.data.receivedAt,
                expiredAt: (() => {
                    const date = new Date(parse.data.receivedAt);
                    date.setFullYear(date.getFullYear() + 1);
                    return date
                })()
            },
            { new: true, runValidators: true, session }
        )

        await inventory.save({ session });
        await session.commitTransaction();

        return inventory;
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
}

export {
    createInventory,
    getInventory,
    getInventories,
    updateInventory
}