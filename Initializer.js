//
// ─── REQUIREMENTS ───────────────────────────────────────────────────────────────
//
const User = require('./Models/Schema/User');
const bcrypt = require('bcryptjs');
const UserLevel = require('./Core/Enums/UserLevel')
// ────────────────────────────────────────────────────────────────────────────────


class Initializer {
    constructor() {
        CreateApplicationAdminIfNotExists();
    }
}

const CreateApplicationAdminIfNotExists = async () => {
    let user = await User.findOne({
        email: process.env.APPLICATION_ADMIN_EMAIL
    });

    if (user) return;

    let hashedPassword = await bcrypt.hash(process.env.APPLICATION_ADMIN_PASSWORD, 12);

    new User({
        email: process.env.APPLICATION_ADMIN_EMAIL,
        gsm: process.env.APPLICATION_ADMIN_GSM,
        firstname: 'Admin',
        lastname: 'Admin',
        password: hashedPassword,
        userLevel: UserLevel.ApplicationAdmin,
        verified: true,
        createdBy: 'Initializer',
        updatedBy: 'Initializer',
    }).save();
}

module.exports = Initializer;