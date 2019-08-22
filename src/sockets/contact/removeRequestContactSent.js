import {pushSocketIdtoArray, emitNotifyToArray, removeSocketIdFromArray} from "../../helpers/socketHelper";

/**
 * @param io from socket.io lib
 */

let removeRequestContactSent = (io) => {
    let clients = {};
    io.on("connection", (socket) => {
  
      clients = pushSocketIdtoArray(clients, socket.request.user._id, socket.id);
  
      socket.on("remove-request-contact-sent", (data) => {
        let currentUser = {
          id: socket.request.user._id
        };
        if (clients[data.contactId]) {
          emitNotifyToArray(clients, data.contactId, io, "response-remove-request-contact-sent", currentUser);
        };
        
      });
  
      socket.on("disconnect", () => {
        clients = removeSocketIdFromArray(clients, socket.request.user._id, socket);
      });
    });
  };
  
  module.exports= removeRequestContactSent;