
function removeContact () {
  $(".user-remove-contact").unbind("click").on("click", function() {
    let  targetId = $(this).data("uid");
    let username = $(this).parent().find("div.user-name p").text();

    Swal.fire({
      title: `Bạn có chắc chắn muốn xóa ${username} khỏi danh bạ`,
      text: "Bạn không thể hoàn tác lại quá trình này!",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#2ECC71",
      cancelButtonColor: "#ff7675",
      confirmButtonText: "Xác nhận",
      cancelButtonText: "Hủy"
    }).then((result) => {
      if(!result.value) {
          return false;
      }
      $.ajax({
        url: "/contact/remove-contact", 
        type: "delete",
        data: {uid: targetId},
        success: function(data) {
          if (data.success) {
            $("#contacts").find(`ul li[data-uid =${targetId}]`).remove();
            decreseNumberNotiContact("count-contacts"); // js/caculateNotifContact.js
  
            socket.emit("remove-contact", {contactId: targetId});

            // All Step handle chat after remove contact
            //Step 0:Check active 
            let checkActive = $("#all-chat").find(`li[data-chat = ${targetId}]`).hasClass("active");

            // Step1 : remove leftside
            $("#all-chat").find(`ul a[href = "#uid_${targetId}"]`).remove();
            $("#user-chat").find(`ul a[href = "#uid_${targetId}"]`).remove();

            //Step 2: remove rightside.ejs
            $("#screen-chat").find(`div#to_${targetId}`).remove();

            //Step 3: remove image modal
            $("body").find(`div#imagesModal_${targetId}`).remove();

            //Step 4: remove attachment
            $("body").find(`div#attachmentsModal_${targetId}`).remove();

            //Step 5: Click first conversation
            if(checkActive) {
              //click vào phần tử đầu tiên của cuộc trò chuyện khi load trang web
              $("ul.people").find("a")[0].click();
            }
          }
        }
      });
      
    });
  });
};

socket.on("response-remove-contact", function(user) {
  $("#contacts").find(`ul li[data-uid =${user.id}]`).remove();
  decreseNumberNotiContact("count-contacts"); // js/caculateNotifContact.js

  // All Step handle chat after remove contact
  //Step 0:Check active 
  let checkActive = $("#all-chat").find(`li[data-chat = ${user.id}]`).hasClass("active");

  // Step1 : remove leftside
  $("#all-chat").find(`ul a[href = "#uid_${user.id}"]`).remove();
  $("#user-chat").find(`ul a[href = "#uid_${user.id}"]`).remove();

  //Step 2: remove rightside.ejs
  $("#screen-chat").find(`div#to_${user.id}`).remove();

  //Step 3: remove image modal
  $("body").find(`div#imagesModal_${user.id}`).remove();

  //Step 4: remove attachment
  $("body").find(`div#attachmentsModal_${user.id}`).remove();

  //Step 5: Click first conversation
  if(checkActive) {
    //click vào phần tử đầu tiên của cuộc trò chuyện khi load trang web
    $("ul.people").find("a")[0].click();
  }
});

$(document).ready(function() {
removeContact();
});