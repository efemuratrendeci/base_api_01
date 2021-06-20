//
// ─── REQUIREMENTS ───────────────────────────────────────────────────────────────
//
const BaseResponse = require('../../Models/Api/BaseResponse');
const RestMessages = require('./RestMessages');
// ────────────────────────────────────────────────────────────────────────────────


class RestHelper {
    response = ({
        res,
        status,
        content,
        specialMessage
    }) => {
        return res.status(status).json(new BaseResponse({
            message: `${RestMessages[status]} ${specialMessage ? specialMessage : ''}`.trim(),
            content: content ? content : {}
        }));
    }

    requestValidatior = ({
        res,
        keys,
        object
    }) => {
        if (!Array.isArray(keys)) {
            throw Error('requestValidator expects array for keys parameter');
        }

        for (let index = 0; index < keys.length; index++) {
            if (!Object.keys(object).some(x => x === keys[index])) {
                this.response({
                    res,
                    status: 406,
                    specialMessage: `Eksik Alanlar : ${keys[index]}`
                })
                return true;
            }
        }

        return false;
    }
}

module.exports = RestHelper;