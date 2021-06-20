class BaseResponse {
    constructor({
        message,
        content
    }) {
        this.message = message;
        this.content = content;
    }
}

module.exports = BaseResponse;