//
// ─── REQUIREMENTS ───────────────────────────────────────────────────────────────
//
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const UserLevel = require('../../Core/Enums/UserLevel')
// ────────────────────────────────────────────────────────────────────────────────


module.exports = mongoose.model(
    "user",
    new Schema({
        email: {
            required: true,
            type: String,
            index: {
                unique: true,
            },
        },
        gsm: {
            required: true,
            type: String,
            index: {
                unique: true,
            },
        },
        password: {
            required: true,
            type: String,
        },
        userNote: String,
        firstname: String,
        lastname: String,
        profilePictureBuffer: {
            data: Buffer,
            contentType: String,
        },
        profilePictureUrl: {
            type: String,
            default: "",
        },
        emailToken: String,
        emailTokenExpiration: Date,
        verified: {
            type: Boolean,
            default: false
        },
        userLevel: {
            type: Number,
            default: UserLevel.CompanyCustomer,
        },
        createdDate: {
            type: Date,
            default: Date.now,
        },
        createdBy: {
            required: true,
            type: String,
        },
        updatedDate: {
            type: Date,
            default: Date.now,
        },
        updatedBy: {
            required: true,
            type: String,
        },
    }),
    "User"
);