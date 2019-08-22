function imageChat (divId) {
  $(`#image-chat-${divId}`).unbind("change").on("change", function() {
    let fileData = $(this).prop("files")[0];
    let math = ["image/png", "image/jpg", "image/jpeg"];
    let limit = 1048576; //byte=1MB
    
    if ($.inArray(fileData.type, math) === -1) {
        //hiển thị alert trong 7s
        alertify.notify("Kiểu file ko hợp lệ, chỉ chấp nhận jpg, jpeg hoặc png", "error", 7);
        $(this).val(null);
        return false;
    };
    if (fileData.size > limit) {
        //hiển thị alert trong 7s
        alertify.notify("Kích thước ảnh upload không lớn quá 1MB", "error", 7);
        $(this).val(null);
        return false;
    };
    
    let targetId = $(this).data("chat");

    let messageFormData = new FormData();
    messageFormData.append("my-image-chat", fileData);
    messageFormData.append("uid", targetId);
    
    if ($(this).hasClass("chat-in-group")) {
      messageFormData.append("isChatGroup", true);
    }

    $.ajax({
      url: "/massage/add-new-image",
      type: "post",
      cache: false,
      contentType: false,
      processData: false,
      data: messageFormData,
      success: function(data) {
        console.log(data)
      },
      error: function(error){
        alertify.notify(error.responseText, "error", 7);
      }
    });
  });
};