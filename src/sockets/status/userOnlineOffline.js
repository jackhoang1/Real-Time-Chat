import {pushSocketIdtoArray, emitNotifyToArray, removeSocketIdFromArray} from "./../../helpers/socketHelper";

/**
 * @param io from socket.io lib
 */

let userOnlineOffline = (io) => {
  let clients = {};
  io.on("connection", (socket) => {

    clients = pushSocketIdtoArray(clients, socket.request.user._id, socket.id);
    socket.request.user.chatGroupIds.forEach(group => {
      clients = pushSocketIdtoArray(clients, group._id, socket.id)
    });
    
    let listUsersOnline = Object.keys(clients);
    // Step 1: Emit to user after login or f5 webpage
    socket.emit("server-send-list-users-online", listUsersOnline);

    //Step 2: Emit to all another user when has new user online
    socket.broadcast.emit("server-send-when-new-user-online", socket.request.user._id);

    socket.on("disconnect", () => {
      clients = removeSocketIdFromArray(clients, socket.request.user._id, socket);
      socket.request.user.chatGroupIds.forEach(group => {
        clients = removeSocketIdFromArray(clients, group._id, socket);
      });
      // Step 3: Emit to all another user when has new user offline
      socket.broadcast.emit("server-send-when-new-user-offline", socket.request.user._id);
    });
    
  });
};

module.exports= userOnlineOffline;