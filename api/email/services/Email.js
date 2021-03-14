const nodemailer = require('nodemailer');

// Create reusable transporter object using SMTP transport.
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD
  },
});

// Uncomment below two lines to configure authorization using: partner-key
// var partnerKey = defaultClient.authentications['partner-key'];
// partnerKey.apiKey = 'YOUR API KEY';

module.exports = {
  send: (from, to, subject, text, html, cc) => {
    // Setup e-mail data.
    const options = {
      from,
      to,
      subject,
      text,
      html,
      cc
    };

    // Return a promise of the function that sends the email.
    return transporter.sendMail(options);
  },
};