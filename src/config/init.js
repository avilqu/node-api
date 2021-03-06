const env = process.env.NODE_ENV;
const config = require('./config.json');

if (env === 'dev' || env === 'test' || env === 'prod') {
    Object.keys(config[env]).forEach(
        (key) => (process.env[key] = config[env][key])
    );
}
