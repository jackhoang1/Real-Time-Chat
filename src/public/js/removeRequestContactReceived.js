
function removeRequestContactReceived () {
    $(".user-remove-request-contact-received").unbind("click").on("click", function() {
      let  targetId = $(this).data("uid");
      $.ajax({
        url: "/contact/remove-request-contact-received",
        type: "delete",
        data: {uid: targetId},
        success: function(data) {
          if (data.success) {
            
           // $(".noti_content").find(`div[data-uid= ${user.id}]`).remove(); //popup notification
           // $("ul.list-notifications").find(`li>div[data-uid= ${user.id}]`).parent().remove(); //modal notification
           //decreseNumberNotification("noti_counter", 1);            //js/caculateNotification.js
           
            decreseNumberNotification("noti_contact_counter", 1); //js/caculateNotification.js

            decreseNumberNotiContact("count-request-contact-received"); //js/caculateNotifContact.js
  
            // Remove notification on event request to add contact
            $("#request-contact-received").find(`li[data-uid = ${targetId}]`).remove();
  
            socket.emit("remove-request-contact-received", {contactId: targetId});
          }
        }
      });
    });
  }
  
  socket.on("response-remove-request-contact-received", function(user) {
    $("#find-user").find(`div.user-remove-request-contact-sent[data-uid = ${user.id}]`).hide();
    $("#find-user").find(`div.user-add-new-contact[data-uid = ${user.id}]`).css("display", "inline-block");

    //remove notification at modal on "Đang chờ xác nhận" tab 
    $("#request-contact-sent").find(`[data-uid = ${user.id}]`).remove();
  
    decreseNumberNotiContact("count-request-contact-sent");
  
    decreseNumberNotification("noti_contact_counter", 1);    //js/caculateNotification.js
    
  });
  
  $(document).ready(function() {
    removeRequestContactReceived();
  });