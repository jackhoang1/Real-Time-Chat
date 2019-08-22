import mongoose from "mongoose";

let Schema = mongoose.Schema;

let ContactSchema = new Schema({
    userId: String,
    contactId: String,
    status: {type: Boolean, default: false},
    createdAt: {type: Number, default: Date.now},
    updatedAt: {type: Number, default: null},
    deletedAt: {type: Number, default: null}
});

ContactSchema.statics ={
  createNew(item) {
    return this.create(item);
  },
  
  /**
   * Find all items that related with user
   * @param {string} userId 
   */
  findAllByUser(userId) {
    return this.find({
      $or: [
        {"userId": userId},
        {"contactId": userId}
      ]
    }).exec();;
  },

  /**
   * Check exists of 2 user
   * @param {string} userId 
   * @param {string} contactId 
   */
  checkExists(userId, contactId) {
    return this.findOne({
      $or: [
        {$and: [
          {"userId": userId},
          {"contactId": contactId}
        ]},
        {$and: [
          {"userId": contactId},
          {"contactId": userId}
        ]}
      ]
    }).exec();
  },

  /**
   * Remove contact
   * @param {string} userId 
   * @param {string} contactId 
   */
  removeContact(userId, contactId) {
    return this.remove({
      $or: [
        {$and: [
          {"userId": userId},
          {"contactId": contactId},
          {"status": true}
        ]},
        {$and: [
          {"userId": contactId},
          {"contactId": userId},
          {"status": true}
        ]}
      ]
    }).exec();
  },


  /**
   * Remove req contact sent
   * @param {string} userId 
   * @param {string} contactId 
   */
  removeRequestContactSent(userId, contactId) {
    return this.remove({
      $and: [
        {"userId": userId},
        {"contactId": contactId},
        {"status": false}
      ]
    }).exec();
  },

  /**
   * Remove req contact received
   * @param {string} userId 
   * @param {string} contactId 
   */
  removeRequestContactReceived(userId, contactId) {
    return this.remove({
      $and: [
        {"contactId": userId},
        {"userId": contactId},
        {"status": false}
      ]
    }).exec();
  },

   /**
   * Approve contact
   * @param {string: of currentUser} userId 
   * @param {string} contactId 
   */
  approveRequestContactReceived(userId, contactId) {
    return this.update({
      $and: [
        {"contactId": userId},
        {"userId": contactId},
        {"status": false}
      ]
    }, {
      "status": true,
      "updatedAt": Date.now()
    }).exec();
  },


  /**
   * get contacts by userId and limit
   * @param {tring} userId 
   * @param {number} limit 
   */
  getContacts(userId, limit) {
    return this.find({
      $and: [
        {$or: [
          {"userId": userId},
          {"contactId": userId}
        ]},
        {"status": true}
      ]
    }).sort({"updatedAt": -1}).limit(limit).exec();
  },

  /**
   * get contacts sent by userId and limit
   * @param {tring} userId 
   * @param {number} limit 
   */
  getContactsSent(userId, limit) {
    return this.find({
      $and: [
        {"userId": userId},
        {"status": false}
      ]
    }).sort({"createdAt": -1}).limit(limit).exec();
  },

  /**
   * get contacts received by userId and limit
   * @param {tring} userId 
   * @param {number} limit 
   */
  getContactsReceived(userId, limit) {
    return this.find({
      $and: [
        {"contactId": userId},
        {"status": false}
      ]
    }).sort({"createdAt": -1}).limit(limit).exec();
  },

  /**
   * count all contacts by userId and limit
   * @param {tring} userId 
   */
  countAllContacts(userId) {
    return this.count({
      $and: [
        {$or: [
          {"userId": userId},
          {"contactId": userId}
        ]},
        {"status": true}
      ]
    }).exec();
  },

  /**
   * count all contacts sent by userId and limit
   * @param {tring} userId 
   */
  countAllContactsSent(userId) {
    return this.count({
      $and: [
        {"userId": userId},
        {"status": false}
      ]
    }).exec();
  },

  /**
   * count all contacts received by userId and limit
   * @param {tring} userId 
   */
  countAllContactsReceived(userId) {
    return this.count({
      $and: [
        {"contactId": userId},
        {"status": false}
      ]
    }).exec();
  },

  /**
   * Read more contact by userId, skip, limit
   * @param {string} userId 
   * @param {number} skip
   * @param {number} limit
   */
  readMoreContacts(userId, skip, limit) {
    return this.find({
      $and: [
        {$or: [
          {"userId": userId},
          {"contactId": userId}
        ]},
        {"status": true}
      ]
    }).sort({"updatedAt": -1}).skip(skip).limit(limit).exec();
  },

  /**
   * Read more contact sent by userId, skip, limit
   * @param {string} userId 
   * @param {number} skip
   * @param {number} limit
   */
  readMoreContactsSent(userId, skip, limit) {
    return this.find({
      $and: [
        {"userId": userId},
        {"status": false}
      ]
    }).sort({"createdAt": -1}).skip(skip).limit(limit).exec();
  },

  /**
   * Read more contact received by userId, skip, limit
   * @param {string} userId 
   * @param {number} skip
   * @param {number} limit
   */
  readMoreContactsReceived(userId, skip, limit) {
    return this.find({
      $and: [
        {"contactId": userId},
        {"status": false}
      ]
    }).sort({"createdAt": -1}).skip(skip).limit(limit).exec();
  },
  
  /**
   * update contact when has new message
   * @param {string} userId 
   * @param {string} contactId 
   */
  updateWhenHasNewMessage(userId, contactId){
    return this.update({
      $or: [
        {$and: [
          {"userId": userId},
          {"contactId": contactId}
        ]},
        {$and: [
          {"userId": contactId},
          {"contactId": userId}
        ]}
      ]
    }, {
      "updatedAt": Date.now()
    }).exec();
  }
}

module.exports = mongoose.model("contact", ContactSchema);