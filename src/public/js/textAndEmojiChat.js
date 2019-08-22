function textAndEmojiChat(divId) {
  $(".emojionearea").unbind("keyup").on("keyup", function(element) {
    let currentEmojioneArea = $(this);
    if (element.which ===13) {
      let targetId = $(`#write-chat-${divId}`).data("chat");
      let messageVal = $(`#write-chat-${divId}`).val();

      if (!targetId.length  || !messageVal.length ) {
        return false;
      };

      let dataTextEmojiForSend = {
        uid: targetId,
        messageVal: messageVal
      };

      if ($(`#write-chat-${divId}`).hasClass("chat-in-group")) {
        dataTextEmojiForSend.isChatGroup = true;
      };

      //call send message
      $.post("/message/add-new-text-emoji", dataTextEmojiForSend, function (data) {
        let dataToEmit = {
          message: data.message
        };
        // Step 1: handle mesage data before show 
        let messageOfMe = $(`<div class="bubble me"  data-mess-id="${data.message._id}"></div>`);
        messageOfMe.text(data.message.text);
        let convertEmojiMessage = emojione.toImage(messageOfMe.html());

        if (dataTextEmojiForSend.isChatGroup) {
          let senderAvatar = `<img src="/images/users/${data.message.sender.avatar}" class="avatar-small" title="${data.message.sender.name}" />`;
          messageOfMe.html(`${senderAvatar} ${convertEmojiMessage}`);

          increaseNumberMessageGroup(divId);
          dataToEmit.groupId = targetId;
        } else {
          messageOfMe.html(convertEmojiMessage);
          dataToEmit.contactId = targetId;
        }

        // Step 2: append message dato to screen
        $(`.right .chat[data-chat=${divId}]`).append(messageOfMe);
        nineScrollRight(divId);

        // Step 3: Remove all data text input
        $(`#write-chat-${divId}`).val("");
        currentEmojioneArea.find(".emojionearea-editor").text("");

        //Step 4:  Change data preview & time
        $(`.person[data-chat=${divId}]`).find("span.time").removeClass("message-time-realtime").html(moment(data.message.createdAt).locale("vi").startOf("seconds").fromNow());
        $(`.person[data-chat=${divId}]`).find("span.preview").html(emojione.toImage(data.message.text));

        // Step 5: Move conversation to top
        $(`.person[data-chat=${divId}]`).on("hoangmanhdev.moveConversationToTop", function() {
          let dataToMove = $(this).parent();
          $(this).closest("ul").prepend(dataToMove);
          $(this).off("hoangmanhdev.moveConversationToTop");
        });
        $(`.person[data-chat=${divId}]`).trigger("hoangmanhdev.moveConversationToTop");

        // Step 6: Emit realtime
        socket.emit("chat-text-emoji", dataToEmit);

        // Step 7: Emit remove typing realtime
        typingOff(divId);

        //Step 8: If this has typing, remove typing
        let checkTyping = $(`.chat[data-chat=${divId}]`).find("div.bubble-typing-gif");
        if (checkTyping.length) {
          checkTyping.remove();
        }

      }).fail(function (response) {
        alertify.notify(response.responseText, "error", 7);
      });
    }
  })
}

$(document).ready(function () {
  socket.on("response-chat-text-emoji", function(response) {
    let divId = "";
    // Step 1: handle mesage data before show 
    let messageOfYou = $(`<div class="bubble you"  data-mess-id="${response.message._id}"></div>`);
    messageOfYou.text(response.message.text);
    let convertEmojiMessage = emojione.toImage(messageOfYou.html());

    if (response.currentGroupId) {
      let senderAvatar = `<img src="/images/users/${response.message.sender.avatar}" class="avatar-small" title="${response.message.sender.name}" />`;
      messageOfYou.html(`${senderAvatar} ${convertEmojiMessage}`);

      divId = response.currentGroupId;
      if(response.currentUserId !== $("#dropdown-navbar-user").data("uid")){
        increaseNumberMessageGroup(divId);
      }
    } else {
      messageOfYou.html(convertEmojiMessage);
      divId = response.currentUserId;
    }

    // Step 2: append message dato to screen
    if(response.currentUserId !== $("#dropdown-navbar-user").data("uid")){
      $(`.right .chat[data-chat=${divId}]`).append(messageOfYou);
      nineScrollRight(divId);
      $(`.person[data-chat=${divId}]`).find("span.time").addClass("message-time-realtime");
    }
    // Step 3: Remove all data text input: nothing to code

    //Step 4:  Change data preview & time
    $(`.person[data-chat=${divId}]`).find("span.time").html(moment(response.message.createdAt).locale("vi").startOf("seconds").fromNow());
    $(`.person[data-chat=${divId}]`).find("span.preview").html(emojione.toImage(response.message.text));

    // Step 5: Move conversation to top
    $(`.person[data-chat=${divId}]`).on("hoangmanhdev.moveConversationToTop", function() {
      let dataToMove = $(this).parent();
      $(this).closest("ul").prepend(dataToMove);
      $(this).off("hoangmanhdev.moveConversationToTop");
    });
    $(`.person[data-chat=${divId}]`).trigger("hoangmanhdev.moveConversationToTop");

    // Step 6: nothing to code
    // Step 7: nothing to code
    // Step 8: nothing to code
  });
})