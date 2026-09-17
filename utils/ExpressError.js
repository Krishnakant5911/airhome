class ExpressErr extends Error{
    constructor(statusCode , message){
        super();
        this.statusCode = statusCode;
        this.status = statusCode;
        this.message = message;
    }
};


module.exports = ExpressErr;