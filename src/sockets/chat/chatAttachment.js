import {pushSocketIdtoArray, emitNotifyToArray, removeSocketIdFromArray} from "./../../helpers/socketHelper";

/**
 * @param io from socket.io lib
 */

let chatAttachment = (io) => {
  let clients = {};
  io.on("connection", (socket) => {

    clients = pushSocketIdtoArray(clients, socket.request.user._id, socket.id);
    socket.request.user.chatGroupIds.forEach(group => {
      clients = pushSocketIdtoArray(clients, group._id, socket.id)
    });
    
    //When has new group chat
    socket.on("new-group-created", (data) => {
      clients = pushSocketIdtoArray(clients, data.groupChat._id, socket.id);
    });

    socket.on("member-recived-group-chat", (data) => {
      clients = pushSocketIdtoArray(clients, data.groupChatid, socket.id);
    });

    socket.on("chat-attachment", (data) => {
      if(data.groupId) {
        let response = {
          currentGroupId: data.groupId,
          currentUserId: socket.request.user._id,
          message: data.message
        }
        if (clients[data.groupId]) {
          emitNotifyToArray(clients, data.groupId, io, "response-chat-attachment", response);
        };
      }
      if (data.contactId) {
        let response = {
          currentUserId: socket.request.user._id,
          message: data.message
        }
        if (clients[data.contactId]) {
          emitNotifyToArray(clients, data.contactId, io, "response-chat-attachment", response);
        };
      }
    });
    socket.on("disconnect", () => {
      clients = removeSocketIdFromArray(clients, socket.request.user._id, socket);
      socket.request.user.chatGroupIds.forEach(group => {
        clients = removeSocketIdFromArray(clients, group._id, socket);
      });
    });
    
  });
};

module.exports= chatAttachment;