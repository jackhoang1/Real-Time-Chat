export const transValidation = {
    email_incorrect: "Email phải có dạng example@gmail.com",
    gender_incorrect: "Đừng cố tình thay đổi giới tình của mình làm gì.",
    password_incorrect: "Mật khẩu phải chứa ít nhất 8 ký tự, bao gồm chữ in hoa, chữ thường, chữ số và ký tự.",
    password_confirmation_incorrect: "Mật khẩu nhập lại chưa trùng khớp.",
    update_username: "Username giới hạn trong khoảng 3-17 ký tự và không được phép chứa ký tự đặc biệt.",
    update_gender: "Dữ liệu giới tính có vấn đề, bạn là 3D chăng?",
    update_address: "Địa chỉ giới hạn trong khoảng 3-30 ký tự.",
    update_phone: "Số điện thoại Việt Nam sẽ bắt đầu bằng số 0, giới hạn trong khoảng 10-11 ký tự",
    keyword_find_user: "Lỗi từ khóa tìm kiếm, chỉ cho phép ký tự chữ cái và số, cho phép khoảng trống",
    message_text_emoji_incorrect: "Tin nhắn văn bản ko hợp lệ, đảm bảo tối thiểu 1 ký tự, tối đa 400 ký tự",
    add_new_group_users_incorrect: "Vui lòng chọn thêm bạn bè, một cuộc trò chuyện nhóm phải có 3 người",
    add_new_group_name_incorrect: "Vui lòng nhập tên cuộc trò chuyện, giới hạn 5-30 ký tự và không chứa các ký tự đặc biệt"
};
export const transErrors = {
     account_in_use: "Email này đã được sử dụng",
     account_not_active: "Email đã được đăng ký nhưng chưa được kích hoạt, xin vui lòng kiểm tra lại email của bạn để kích hoạt tài khoản",
     account_removed: "Tài khoản này đã bị gỡ khỏi hệ thống. Liên hệ lại với chúng tôi để lấy lại tài khoản",
     account_underfined: "Tài khoản này không tồn tại",
     token_underfined: "Token không tồn tại!",
     login_failed: "Sai tài khoản hoặc mật khẩu",
     sever_error: "Có lỗi ở phía sever, vui lòng liên hệ với bộ phận hỗ trợ của chúng tôi để khăc phục vấn đề này",
     avatar_type: "Kiểu file ko hợp lệ, chỉ chấp nhận jpg, jpeg hoặc png",
     avatar_size: "Kích thước ảnh upload không lớn quá 1MB",
     user_current_password_failed: "Mật khẩu hiện tại không chính xác",
     conversation_not_found: "Cuộc trò chuyện không tồn tại.",
     image_message_type: "Kiểu file ko hợp lệ, chỉ chấp nhận jpg, jpeg hoặc png",
     image_message_size: "Kích thước ảnh upload không lớn quá 1MB",
     attachment_message_size: "Kích thước file upload không lớn quá 1MB",
};
export const transSuccess = {
    userCreated: (userEmail) =>{
        return `Tài khoản <strong>${userEmail}</strong> đã được tạo, vui lòng kiểm tra email của bạn để kích hoạt trước khi đăng nhập tài khoản.`;
    },
    account_active: "Kích hoạt tài khoản thành công, bạn đã có thể đăng nhập vào ứng dụng",
    loginSuccess: (username) => {
        return `Xin chào ${username} chúc bạn một ngày mới tốt lành`;
    },
    logout_success: "Đăng xuất tài khoản thành công, hẹn gặp lại bạn lần sau.",
    user_info_updated: "Cập nhật thông tin người dùng thành công",
    user_password_updatated: "Cập nhập mật khẩu thành công"

    
};
export const transMail = {
    subject: "Realtime Chat: Xác nhận kích hoạt tài khoản",
    template: (linkVerify) => {
        return `
        <h2>Bạn nhận được emmail này vì đã đăng ký tài khoản trên ứng dụng RealTime Chat</h2>
        <h3>Vui lòng click vào liên kết bên dưới để xác nhận kích hoạt tài khoản</h3>
        <h3><a href="${linkVerify}" target="blank">${linkVerify}</a></h3>
        <h4>nếu tin rằng email này là nhầm lẫn, hãy bỏ qua nó</h4>
        `
    },
    sendFail: "Có lỗi trong quá trình gủi mail, vui lòng liên hệ lại với bộ phận của chúng tôi."
};
