module.exports = {
    // Error messages
    ERR_INVALID_TOKEN: 'Invalid user token.',
    ERR_NOT_LOGGED: 'Not logged in.',
    ERR_UNAUTHORIZED: 'Unauthorized.',
    ERR_WRONG_CREDENTIALS: 'Wrong credentials.',
    ERR_UNVERIFIED_USER: 'Unverified user.',
    ERR_EXISTING_USER: 'User already exists.',
    ERR_GOOGLE_USER:
        'This email is already registered via a Google account. Please login with Google.',
    ERR_FACEBOOK_USER:
        'This email is already registered via a Facebook account. Please login with Facebook.',
    ERR_EMAIL_USER:
        'This email is already registered. Please login with your credentials.',
    ERR_NO_USER: 'User not found.',
    ERR_INVALID_PASSWORD: 'Password must be at least 6 characters.',
    ERR_INVALID_EMAIL: 'Email address is invalid.',
    ERR_INVALID_NAME: 'Name is needed.',
    ERR_DEFAULT: 'Something went wrong.',

    // Info messages
    INFO_ACTIVATION_LINK: 'An activation link was sent by email.',
    INFO_USER_ACTIVATED: 'User is now activated.',
    INFO_PASSWORD_RESET_LINK: 'A reset link was sent by email.',
    INFO_PASSWORD_SAVED: 'Password was saved.',
    INFO_USER_SAVED: 'User was saved.',
    INFO_USER_DELETED: 'User was deleted.',
};
