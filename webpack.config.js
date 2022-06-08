// Look in ./config folder for webpack.dev.js
switch (process.env.NODE_ENV) {
    case 'prod':
    case 'production':
        module.exports = require('./config/webpack.prod')({ env: 'production' });
        break;
    case 'live':
        module.exports = require('./config/webpack.live')({ env: 'live' });
        break;
    case 'demo':
        module.exports = require('./config/webpack.demo')({ env: 'demo' });
        break;
    case 'dev':
    case 'development':
    default:
        module.exports = require('./config/webpack.dev')({ env: 'development' });
}