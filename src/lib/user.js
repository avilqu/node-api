const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const strings = require('./strings');

const UserSchema = new mongoose.Schema(
    {
        googleId: {
            type: String,
            index: {
                unique: true,
                partialFilterExpression: {
                    googleId: {
                        $type: 'string',
                    },
                },
            },
        },
        facebookId: {
            type: String,
            index: {
                unique: true,
                partialFilterExpression: {
                    facebookId: {
                        $type: 'string',
                    },
                },
            },
        },
        verified: {
            type: Boolean,
            required: true,
        },
        access: {
            type: Number,
            required: true,
            default: 0,
        },
        email: {
            type: String,
            required: true,
            index: true,
            trim: true,
            unique: true,
        },
        password: {
            type: String,
        },
        name: {
            type: String,
            required: true,
        },
        pic: {
            type: String,
        },
    },
    { timestamps: { createdAt: 'added', updatedAt: 'updated' } }
);

UserSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

UserSchema.methods.generateToken = function (duration, type) {
    const expiresIn = duration ? duration : '1d';
    let secret =
        type === 'password'
            ? this.password + this._id
            : process.env.JWT_SECRET + this._id;
    return jwt
        .sign(
            {
                id: this._id,
                type: type,
            },
            secret,
            { expiresIn }
        )
        .toString();
};

UserSchema.methods.verifyToken = function (token, type) {
    let secret =
        type === 'password'
            ? this.password + this._id
            : process.env.JWT_SECRET + this._id;
    try {
        const decoded = jwt.verify(token, secret);
        if (decoded.type === type) return decoded;
    } catch (e) {
        throw new Error(strings.ERR_INVALID_TOKEN);
    }
};

UserSchema.pre('save', function (next) {
    if (this.isModified('password')) {
        bcrypt.genSalt(12, (err, salt) => {
            if (err) return next(err);
            bcrypt.hash(this.password, salt, (err, hash) => {
                if (err) return next(err);
                this.password = hash;
                return next();
            });
        });
    } else return next();
});

mongoose.model('user', UserSchema);
