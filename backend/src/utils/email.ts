import nodemailer from 'nodemailer';
import 'dotenv/config';
const transporter = nodemailer.createTransport({
    service: process.env.SERVICE, // or 'sendinblue' (old name)
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
    }, authMethod: 'PLAIN'
});

// Test the connection
transporter.verify((error, success) => {
    if (error) {
        console.log('SMTP connection error:', error);
    } else {
        console.log('SMTP connection successful ✅');
    }
});

export default transporter;