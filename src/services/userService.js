import UserModel from "../models/userModel";
import {transErrors} from "../../lang/vi";
import bcrypt from "bcrypt"; 

const saltRound = 7;

/**
 * 
 * @param {userId} id 
 * @param {data Update} item 
 */
let updateUser = (id, item) => {
    return UserModel.updateUser(id, item);
};

/**
 * Update password for user
 * @param {userId} id 
 * @param {data Update} dataUpdate 
 */
let updatePassword = (id, dataUpdate) => {
    return new Promise (async (resolve, reject) =>{
        let currentUser = await UserModel.findUserByIdToUpdatePassword(id);
        if (!currentUser) {
            return reject(transErrors.account_underfined);
        }

        let checkCurrentPassword = await currentUser.comparePassword(dataUpdate.currentPassword);
        if(!checkCurrentPassword) {
            return reject(transErrors.user_current_password_failed);
        }

        let salt = bcrypt.genSaltSync(saltRound);
        await UserModel.updatePassword(id, bcrypt.hashSync(dataUpdate.newPassword, salt));
        resolve(true);
    });
};

module.exports = {
    updateUser: updateUser,
    updatePassword:updatePassword
}