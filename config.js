require('dotenv').config();

const config = {

    db: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE
    },
    
    email: {
        username: process.env.EMAIL_USERNAME,
        password: process.env.EMAIL_PASSWORD,
        from: process.env.EMAIL_FROM
    }
}

module.exports = config;