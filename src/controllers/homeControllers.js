import {notification, contact, message} from "./../services/index";
import {bufferToBase64, lastItemOfArray, convertTimeStampToHumanTime} from "./../helpers/clientHelpers";

let getHome = async (req, res) => {
  //only 10 items one time
  let notifications = await notification.getNotifications(req.user._id);
  //get amount notification unread
  let countNotifUnread = await notification.countNotifUnread(req.user._id);

  //get contacts (10 item one time)
  let contacts= await contact.getContacts(req.user._id);
  //get contacts send (10 item one time)
  let contactsSent= await contact.getContactsSent(req.user._id);
  //get contacts received (10 item one time)
  let contactsReceived= await contact.getContactsReceived(req.user._id);

  //counnt contacts
  let countAllContacts= await contact.countAllContacts(req.user._id);
  let countAllContactsSent= await contact.countAllContactsSent(req.user._id);
  let countAllContactsReceived = await contact.countAllContactsReceived(req.user._id);

  let getAllConversationItems = await message.getAllConversationItems(req.user._id);
  //all message with conversation, max 30 item
  let allConversationWithMessages = getAllConversationItems.allConversationWithMessages

  
  return res.render("main/home/home", {
    errors: req.flash("errors"),
    success: req.flash("success"),
    user: req.user,
    notifications: notifications,
    countNotifUnread:countNotifUnread,
    contacts: contacts,
    contactsSent: contactsSent,
    contactsReceived: contactsReceived,
    countAllContacts: countAllContacts,
    countAllContactsSent: countAllContactsSent,
    countAllContactsReceived: countAllContactsReceived,
    allConversationWithMessages: allConversationWithMessages,
    bufferToBase64: bufferToBase64,
    lastItemOfArray: lastItemOfArray,
    convertTimeStampToHumanTime: convertTimeStampToHumanTime
  });
};

module.exports = {
    getHome: getHome
};