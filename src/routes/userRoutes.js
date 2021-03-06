const express = require('express');
const router = express.Router();

const User = require('../config/db').mongoose.model('user');
const { mailer } = require('../services/mailer');
const { auth } = require('../middleware/authGuards');
const strings = require('../lib/strings');

const createUser = async (req, res, next) => {
    try {
        let user = await User.findOne({ email: req.body.email });
        if (user && user.googleId) next(new Error(strings.ERR_GOOGLE_USER));
        else if (user && user.facebookId)
            next(new Error(strings.ERR_FACEBOOK_USER));
        else if (user) next(new Error(strings.ERR_EXISTING_USER));
        else {
            user = new User({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                verified: false,
            });
            await user.save();
            const token = user.generateToken();
            await mailer.newUser({
                name: user.name,
                email: user.email,
                baseUrl: req.headers.host,
                id: user.id,
                token: token,
            });
            return res.json({
                status: 'success',
                data: { token },
                message: strings.INFO_ACTIVATION_LINK,
            });
        }
    } catch (e) {
        return next(e);
    }
};

const verifyUser = async (req, res, next) => {
    try {
        const user = await User.findOne({ _id: req.params.id });
        if (!user) next(new Error(strings.ERR_NO_USER));
        if (user.verifyToken(req.params.token)) {
            user.verified = true;
            await user.save();
            return res.json({
                status: 'success',
                data: { user },
                message: strings.INFO_USER_ACTIVATED,
            });
        } else {
            return res.status(400).send();
        }
    } catch (e) {
        return next(e);
    }
};

const sendPasswordResetToken = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) next(new Error(strings.ERR_NO_USER));
        else {
            const token = user.generateToken('1h', 'password');
            await mailer.resetPassword({
                email: user.email,
                baseUrl: req.headers.host,
                id: user.id,
                token: token,
            });
            return res.json({
                status: 'success',
                data: { token },
                message: strings.INFO_PASSWORD_RESET_LINK,
            });
        }
    } catch (e) {
        return next(e);
    }
};

const updatePassword = async (req, res, next) => {
    try {
        let user = await User.findOne({ _id: req.params.id });
        if (!user) next(new Error(strings.ERR_NO_USER));
        if (user.verifyToken(req.params.token, 'password')) {
            user.password = req.body.password;
            await user.save();
            res.json({
                status: 'success',
                data: { user },
                message: strings.INFO_PASSWORD_SAVED,
            });
        }
    } catch (e) {
        return next(e);
    }
};

const updateUser = async (req, res, next) => {
    try {
        let user = await User.findOne({ _id: req.params.id });
        if (!user) next(new Error(strings.ERR_NO_USER));
        if (user.id == req.user._id) {
            if (user.email != req.body.email) {
                let userEmail = await User.findOne({ email: req.body.email });
                if (userEmail) next(new Error(strings.ERR_EXISTING_USER));
                else user.email = req.body.email;
            }
            await user.updateOne(req.body);
            res.json({
                status: 'success',
                data: { user },
                message: strings.INFO_USER_SAVED,
            });
        } else next(new Error(strings.ERR_UNAUTHORIZED));
    } catch (e) {
        return next(e);
    }
};

const deleteUser = async (req, res, next) => {
    try {
        let user = await User.findOneAndDelete({ _id: req.params.id });
        if (!user) next(new Error(strings.ERR_NO_USER));
        res.json({
            status: 'success',
            data: { user },
            message: strings.INFO_USER_DELETED,
        });
    } catch (e) {
        return next(e);
    }
};

const getUserList = async (req, res, next) => {
    try {
        const users = await User.find();
        res.json({
            status: 'success',
            data: { users },
        });
    } catch (e) {
        return next(e);
    }
};

const getUser = async (req, res, next) => {
    try {
        let user = await User.findOne({ _id: req.params.id });
        if (!user) return next(new Error(strings.ERR_NO_USER));
        else
            res.json({
                status: 'success',
                data: { user },
            });
    } catch (e) {
        return next(e);
    }
};

const getActiveUser = async (req, res) => {
    res.json({ status: 'success', data: { user: req.user } });
};

router.post('/user/signup', createUser);
router.get('/user/profile', auth, getActiveUser);
router.get('/user/list', auth, getUserList);
router.post('/user/reset-password', sendPasswordResetToken);
router.get('/user/:id', auth, getUser);
router.get('/user/:id/verify/:token', verifyUser);
router.post('/user/:id/password/:token', updatePassword);
router.post('/user/:id/update', auth, updateUser);
router.get('/user/:id/delete', auth, deleteUser);

module.exports = router;
