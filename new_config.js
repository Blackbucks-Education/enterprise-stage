const dotenv = require('dotenv');

dotenv.config();

// db_config.js

module.exports = {
  user:  process.env.RAGHU_DB_USER,
    host:  process.env.RAGHU_DB_HOST,
    database:  process.env.RAGHU_DB_DATABASE,
    password: 'um3QnDWOGPZQyCG',
    port:  process.env.RAGHU_DB_PORT, // Change this port if necessary
    ssl: {
      rejectUnauthorized: false, // Only for dev/self-signed certs
    },
};
