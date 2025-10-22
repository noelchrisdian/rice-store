import {
    createInventory,
    getInventories,
    updateInventory
} from "../../services/inventories.js";
import { StatusCodes } from "http-status-codes";
import { success } from "../../utils/response.js";

const index = async (req, res, next) => {
    try {
        const inventories = await getInventories(req);
        success(res, inventories, `Inventories fetched successfully`);
    } catch (error) {
        next(error);   
    }
}

const create = async (req, res, next) => {
    try {
        const inventory = await createInventory(req);
        success(res, inventory, 'New inventory has been created', StatusCodes.CREATED);
    } catch (error) {
        next(error);
    }
}

const update = async (req, res, next) => {
    try {
        const inventory = await updateInventory(req);
        success(res, inventory, 'Inventory has been updated');
    } catch (error) {
        next(error);
    }
}

export {
    create,
    index,
    update
}