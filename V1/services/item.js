const item = require('../../models/item')


class itemService {

    updateItem = (match, params) => item.findOneAndUpdate(match, { $set: params}, {new: true});
    getItems = async (params) => {
        const items = await item.find(params).sort('name');
        return items;
    }
    getItem = async (params) => {
        const items = await item.findOne(params);
        return items;
    }
    createItem = async (params) => {
        try {
            return await item.create(params);
            
        } catch (error) {
            console.log("error:", error)
        }
       
    }
    countItems = async ({ limit, skip, isDeleted }) => {
        return await item.count({isDeleted}).limit(limit).skip(skip)
    }
   
}

module.exports = new itemService();


//Notifications , money deduction and total amount left
//add category to 50
// jaggu entry amount remaining amount, user image
//Seearch filter, 1)Userlisting api , 2)price update , 3)product enable disable, 4)product update remove image update, pagination limit remove from item api