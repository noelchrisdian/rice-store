import mongoose from "mongoose";
import { inventoryModel as Inventories } from "../api/inventories/model.js";
import { inventorySchema } from "../utils/zod.js";
import { NotFound } from "../errors/notFound.js";
import { ParseError } from "../errors/parseError.js";
import { productModel as Products } from "../api/products/model.js";
import { StatusCodes } from "http-status-codes";

const getInventories = async (req) => {
    const { productID } = req.params;
    const inventories = await Inventories.find({ product: productID })
        .populate({
            path: 'product',
            select: 'name price'
        })
        .sort({ receivedAt: 1 });

    if (!inventories) {
        throw new NotFound(`No inventories found for this product`);
    }

    return inventories;
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
    const { inventoryID } = req.params;
    const inventory = await Inventories.findOne({ _id: inventoryID });
    if (!inventory) {
        throw new NotFound(`Inventory doesn't exist`);
    }

    const parse = await inventorySchema.safeParseAsync(req.body);
    if (!parse.success) {
        const errors = parse.error.issues.map((error) => error.message);
        throw new ParseError('Invalid data type', StatusCodes.BAD_REQUEST, errors);
    }
    
    const consume = inventory.quantity - inventory.remaining;
    const remaining = parse.data.quantity - consume;
    if (remaining < 0) {
        throw new BadRequest(`Remaining stock couldn't be negative number`);
    }
    
    return await Inventories.findOneAndUpdate(
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
        { new: true }
    )
}

export {
    createInventory,
    getInventories,
    updateInventory
}