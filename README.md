# RESTful Node API

Boilerplate RESTful Node API offering Google/Facebook OAuth and local user login, backed with a MongoDB database.

Node, Express, Passport.JS, MongoDB/Mongoose.

### Setup

[`config/init.js`](server/config/init.js) parses `config/config.json` to populate environment variables. All the basic configuration (API codes, listening port, cookie secrets, etc.) goes there.

### Response structure

This API follows [JSend](https://github.com/omniti-labs/jsend) standard for the response structure. Output JSON is an object containing a 'status' string (can be 'success' or 'error'), a 'data' object if there is data to send, or an 'error' object in case of failure. The 'message' string contains an error or success message.

```json
{
    "status": "success/error",
    "data": {},
    "error": {},
    "message": ""
}
```

### Routes

-   **POST** `/api/login` : Creates session
-   **GET** `/api/logout` : Destroys session
-   **GET** `/api/login/google` : Initiate Google OAuth
-   **GET** `/api/login/facebook` : Initiate Facebook OAuth
-   **GET** `/api/google/callback` : Callback for Google OAuth
-   **GET** `/api/facebook/callback` : Callback for Facebook OAuth
-   **POST** `/api/user/signup` : Saves and returns created user
-   **GET** `/api/user/profile` : Returns user if authenticated
-   **POST** `/api/user/:id/update` : Update user with \_id = :id
-   **GET** `/api/user/list` : Returns a list of all users
-   **POST** `/api/user/:id` : Returns profile for user with \_id = :id
-   **GET** `/api/user/:id/verify/:token` : Sets user as verified, returns user
-   **POST** `/api/user/reset-password` : Emails a reset link, returns reset token
-   **POST** `/api/user/:id/password/:token` : Updates user password
