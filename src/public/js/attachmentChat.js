function attachmentChat (divId) {
  $(`#attachment-chat-${divId}`).unbind("change").on("change", function() {
    let fileData = $(this).prop("files")[0];
    let limit = 1048576; //byte=1MB
    
    if (fileData.size > limit) {
        //hiển thị alert trong 7s
        alertify.notify("Kích thước file upload không lớn quá 1MB", "error", 7);
        $(this).val(null);
        return false;
    };

    let targetId = $(this).data("chat");
    let isChatGroup = false;

    let messageFormData = new FormData();
    messageFormData.append("my-attachment-chat", fileData);
    messageFormData.append("uid", targetId);
    
    if ($(this).hasClass("chat-in-group")) {
      messageFormData.append("isChatGroup", true);
      isChatGroup = true;
    }

    $.ajax({
      url: "/massage/add-new-attachment",
      type: "post",
      cache: false,
      contentType: false,
      processData: false,
      data: messageFormData,
      success: function(data) {
        let dataToEmit = {
          message: data.message
        };
        // Step 1: handle mesage data before show 
        let messageOfMe = $(`<div class="bubble me bubble-attachment-file"  data-mess-id="${data.message._id}"></div>`);
        let attachmentChat = `
          <a href="data:${data.message.file.contentType}; base64, ${bufferToBase64(data.message.file.data.data)}" download="${data.message.file.fileName}">
            ${data.message.file.fileName}
          </a>`;

        if (isChatGroup) {
          let senderAvatar = `<img src="/images/users/${data.message.sender.avatar}" class="avatar-small" title="${data.message.sender.name}" />`;
          messageOfMe.html(`${senderAvatar} ${attachmentChat}`);

          increaseNumberMessageGroup(divId);
          dataToEmit.groupId = targetId;
        } else {
          messageOfMe.html(attachmentChat);
          dataToEmit.contactId = targetId;
        }

        // Step 2: append message dato to screen
        $(`.right .chat[data-chat=${divId}]`).append(messageOfMe);
        nineScrollRight(divId);

        // Step 3: Remove all data text input : Nothing to code

        //Step 4:  Change data preview & time
        $(`.person[data-chat=${divId}]`).find("span.time").removeClass("message-time-realtime").html(moment(data.message.createdAt).locale("vi").startOf("seconds").fromNow());
        $(`.person[data-chat=${divId}]`).find("span.preview").html("Tệp đính kèm...");

        // Step 5: Move conversation to top
        $(`.person[data-chat=${divId}]`).on("hoangmanhdev.moveConversationToTop", function() {
          let dataToMove = $(this).parent();
          $(this).closest("ul").prepend(dataToMove);
          $(this).off("hoangmanhdev.moveConversationToTop");
        });
        $(`.person[data-chat=${divId}]`).trigger("hoangmanhdev.moveConversationToTop");

        // Step 6: Emit realtime
        socket.emit("chat-attachment", dataToEmit);

        // Step 7: Emit remove typing realtime : Nothing to code

        //Step 8: If this has typing, remove typing : Nothing to code

        // Step 9: Add to modal attachment
        let attachmentChatToAddModal = `
          <li>
          <a href="data:${data.message.file.contentType}; base64, ${bufferToBase64(data.message.file.data.data)}" download="${data.message.file.fileName}">
            ${data.message.file.fileName}
          </a>
          </li>`;
        $(`#attachmentsModal_${divId}`).find("ul.list-attachments").append(attachmentChatToAddModal);
      },
      error: function(error){
        alertify.notify(error.responseText, "error", 7);
      }
    });
  });
};

$(document).ready(function () {
  socket.on("response-chat-attachment", function(response) {
    let divId = "";

    // Step 1: handle mesage data before show 
    let messageOfYou = $(`<div class="bubble you bubble-attachment-file"  data-mess-id="${response.message._id}"></div>`);
    let attachmentChat = `
    <a href="data:${response.message.file.contentType}; base64, ${bufferToBase64(response.message.file.data.data)}" download="${response.message.file.fileName}">
      ${response.message.file.fileName}
    </a>`;

    if (response.currentGroupId) {
      let senderAvatar = `<img src="/images/users/${response.message.sender.avatar}" class="avatar-small" title="${response.message.sender.name}" />`;
      messageOfYou.html(`${senderAvatar} ${attachmentChat}`);

      divId = response.currentGroupId;
      if(response.currentUserId !== $("#dropdown-navbar-user").data("uid")){
        increaseNumberMessageGroup(divId);
      }
    } else {
      messageOfYou.html(attachmentChat);

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
    $(`.person[data-chat=${divId}]`).find("span.preview").html("Tệp đính kèm");

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

    // Step 9: Add to modal attachment
    if(response.currentUserId !== $("#dropdown-navbar-user").data("uid")){
      let attachmentChatToAddModal = `
      <li>
      <a href="data:${response.message.file.contentType}; base64, ${bufferToBase64(response.message.file.data.data)}" download="${response.message.file.fileName}">
        ${response.message.file.fileName}
      </a>
      </li>`;
      $(`#attachmentsModal_${divId}`).find("ul.list-attachments").append(attachmentChatToAddModal);
    }
  });
})