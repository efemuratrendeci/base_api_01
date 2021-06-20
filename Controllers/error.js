//
// ─── REQUIREMENTS ───────────────────────────────────────────────────────────────
//
const RestHelper = require('./Helpers/RestHelper');
// ────────────────────────────────────────────────────────────────────────────────


//
// ─── METHODS ────────────────────────────────────────────────────────────────────
//
exports.get404 = async (req, res, next) => {
    const client = new RestHelper();

    return client.response({
        res,
        status: 404
    })
}

exports.get500 = async (req, res, next, error) => {
    const client = new RestHelper();

    return client.response({
        res,
        status: error.message.includes('conflict') ? 409 : 500,
        content: {
            error: {
                error_message: error.message,
                stack: Buffer.from(error.stack).toString('base64')
            }
        },
        specialMessage: `Hata : ${error.message}`
    });
}
// ────────────────────────────────────────────────────────────────────────────────