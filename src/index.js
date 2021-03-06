const express = require('express');
const fileUpload = require('express-fileupload');
const passport = require('passport');
const cors = require('cors');
const http = require('http');
const https = require('https');
const fs = require('fs');

require('./config/init');
require('./config/db');
require('./lib/user');
require('./config/passport');

const { errorHandler } = require('./middleware/errorHandler');
const { cookieSession } = require('./config/cookies');

const app = express();
app.use(fileUpload());
app.use(express.json());
app.use(cookieSession);
app.use(passport.initialize());
app.use(passport.session());
app.use(cors());

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
app.use('/api', [authRoutes, userRoutes]);

app.use(express.static(__dirname + '/public'));
app.get('*', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.use(errorHandler);

let httpServer = http.createServer(app);
let httpsServer = https.createServer(
    {
        key: fs.readFileSync('./src/key.pem'),
        cert: fs.readFileSync('./src/cert.pem'),
        passphrase: process.env.CERT_PASSWORD,
    },
    app
);

httpServer.listen(process.env.HTTP_PORT, () => {
    console.log(
        `Server started on port ${process.env.HTTP_PORT} (${process.env.NODE_ENV}).`
    );
});

httpsServer.listen(process.env.HTTPS_PORT, () => {
    console.log(
        `Secure server started on port ${process.env.HTTPS_PORT} (${process.env.NODE_ENV}).`
    );
});
