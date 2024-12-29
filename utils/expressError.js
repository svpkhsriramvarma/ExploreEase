class ExpressError extends Error {
    constructor(statusCode,message) {
        super(message),
        statusCode = this.statusCode;
        message = this.message;
    }
}  

module.exports = ExpressError;