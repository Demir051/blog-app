const nodeMailer = require('nodemailer');
const config = require('../config');

let transporter = nodeMailer.createTransport({
    host: 'smtp-mail.outlook.com',
    secureConnection: false,
    port: 587,
    tls:{
        ciphers:'SSLv3'
    },
    auth:{
        user: config.email.username,
        pass: config.email.password
    }
});

module.exports = transporter;