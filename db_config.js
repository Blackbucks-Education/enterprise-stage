const { faL } = require('@fortawesome/free-solid-svg-icons');
const dotenv = require('dotenv');

dotenv.config();

// db_config.js

module.exports = {
  user:  process.env.DB_USER,
    host:  process.env.DB_HOST,
    database:  process.env.DB_DATABASE,
    password:  process.env.DB_PASSWORD,
    port:  process.env.DB_PORT, // Change this port if necessary
    ssl: {
      rejectUnauthorized: false, // Only for dev/self-signed certs
    },
};
