//
// ─── REQUIREMENTS ───────────────────────────────────────────────────────────────
//
const express = require('express');

const authController = require('../Controllers/auth');
// ────────────────────────────────────────────────────────────────────────────────

//
// ─── CONFIGURATION ──────────────────────────────────────────────────────────────
//
const router = express.Router();
// ────────────────────────────────────────────────────────────────────────────────

//
// ─── GET ────────────────────────────────────────────────────────────────────────
//
router.get('/verify_jwt', authController.verifyJWT);
router.get('/verify_account/:token', authController.getVerifyAccount);
// ────────────────────────────────────────────────────────────────────────────────

//
// ─── POST ───────────────────────────────────────────────────────────────────────
//
router.post('/signin', authController.signin);
router.post('/signup', authController.signup);
router.post('/verify_account', authController.postVerifyAccount);
// ────────────────────────────────────────────────────────────────────────────────


module.exports = router;