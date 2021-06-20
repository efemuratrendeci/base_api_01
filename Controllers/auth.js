//
// ─── REQUIREMENTS ───────────────────────────────────────────────────────────────
//
const RestHelper = require('./Helpers/RestHelper');
const StringFormatter = require('../Core/Helpers/StringFormatter');
const FormattingType = require('../Core/Enums/FormattingType');
const UserLevel = require('../Core/Enums/UserLevel');
const EmailController = require('../Core/Helpers/EmailController');
const EmailType = require('../Core/Enums/EmailType');
const User = require('../Models/Schema/User');

const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
// ────────────────────────────────────────────────────────────────────────────────

//
// ─── METHODS ────────────────────────────────────────────────────────────────────
//
exports.signin = async (req, res, next) => {
    try {
        const client = new RestHelper();

        if (client.requestValidatior({
                res,
                keys: ['email', 'gsm', 'password'],
                object: req.body
            })) {
            return;
        }

        const signinWith = req.body.email || req.body.gsm;
        let user;

        if (signinWith.includes('@'))
            user = await User.findOne({
                email: signinWith,
                verified: true
            });
        else
            user = await User.findOne({
                gsm: new StringFormatter(signinWith, FormattingType.GSM).formattedString,
                verified: true
            });

        if (!user) {
            return client.response({
                res,
                status: 401
            })
        };

        let matched = await bcrypt.compare(req.body.password, user.password);

        if (matched) {
            user.fullname = `${user.firstname ?? ''} ${user.lastname ?? ''}`.trim();

            const token = jwt.sign({
                userId: user._id,
                fullname: user.fullname,
                userLevel: user.userLevel,
                date: new Date().toISOString()
            }, process.env.JWT_SECRET, {
                expiresIn: '1h'
            })

            return client.response({
                res,
                status: 200,
                content: {
                    user: {
                        userId: user._id,
                        fullname: user.fullname,
                        userLevel: user.userLevel
                    },
                    token
                }
            })
        } else {
            return client.response({
                res,
                status: 401
            })
        }
    } catch (error) {
        next(error)
    }
}

exports.signup = async (req, res, next) => {
    try {
        const client = new RestHelper();

        if (client.requestValidatior({
                res,
                keys: ['email', 'gsm', 'password', 'firstname', 'lastname'],
                object: req.body
            })) {
            return;
        }

        let userFoundByEmail = await User.findOne({
            email: req.body.email
        });
        let userFoundByGSM = await User.findOne({
            gsm: new StringFormatter(req.body.gsm, FormattingType.GSM).formattedString
        });

        if (userFoundByEmail || userFoundByGSM) {
            return client.response({
                res,
                status: 400,
                specialMessage: 'Verilen Bilgiler ile daha önce bir kullanıcı oluşturulmuş. Şifreyi sıfırlamayı veya giriş yapmayı deneyiniz.'
            });
        }

        let token;
        await crypto.randomBytes(32, (err, buffer) => {
            token = buffer.toString('hex');
        });

        let hashedPassword = await bcrypt.hash(req.body.password, 12)

        await new User({
            ...req.body,
            password: hashedPassword,
            userLevel: UserLevel.CompanyCustomer,
            emailToken: token,
            emailTokenExpiration: Date.now() + 86400000,
            createdBy: `${req.body.firstname} ${req.body.lastname}`,
            updatedBy: `${req.body.firstname} ${req.body.lastname}`
        }).save();

        await new EmailController({
            emailType: EmailType.FIRST_LOGIN,
            to: req.body.email,
            content: {
                emailToken: token,
                fullname: `${req.body.firstname} ${req.body.lastname}`
            }
        }).sendMail();

        return client.response({
            res,
            status: 201
        })

    } catch (error) {
        next(error)
    }
}

exports.getVerifyAccount = async (req, res, next) => {
    try {
        const client = new RestHelper();
        const token = req.params.token;
        let user = await User.findOne({
            emailToken: token,
            emailTokenExpiration: {
                $gt: Date.now()
            }
        });

        if (!user) {
            return client.response({
                res,
                status: 404,
                specialMessage: 'Bu url artık geçerli değil. Şifremi unuttum seçeneği ile tekrardan url oluşturabilirsiniz.'
            });
        }

        return client.response({
            res,
            status: 200,
            content: {
                token: token
            }
        });

    } catch (error) {
        next(error)
    }
}

exports.postVerifyAccount = async (req, res, next) => {
    try {
        const client = new RestHelper();
        const token = req.body.token;

        let user = await User.findOneAndUpdate({
            emailToken: token,
            emailTokenExpiration: {
                $gt: Date.now()
            }
        }, {
            verified: true
        });

        if (user) {
            return client.response({
                res,
                status: 201
            })
        } else {
            return client.response({
                res,
                status: 422
            })
        }

    } catch (error) {
        next(error)
    }
}

exports.verifyJWT = async (req, res, next) => {
    try {
        const authorization = req.get('authorization');

        if (!authorization) {
            return response({
                res,
                status: 403
            })
        }

        let token = authorization.includes('Bearer ') ? authorization.split(' ')[1] : authorization,
            decodedToken;

        decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        if (!decodedToken) {
            return response({
                res,
                status: 403
            })
        }

        return response({
            res,
            status: 200,
            content: {
                user: decodedToken
            }
        })


    } catch (error) {

        if (error.message.includes('jwt')) {
            return response({
                res,
                status: 403
            })
        }

        next(error)
    }
}
// ────────────────────────────────────────────────────────────────────────────────