import nodemailer from 'nodemailer';
const transporter = nodemailer.createTransport({
    service: 'brevo', // or 'sendinblue' (old name)
    auth: {
        user: '95d034001@smtp-brevo.com', // hardcode temporarily for testing
        pass: 'I7xQ2V3bXkYwdtPD' // hardcode temporarily for testing
    }, authMethod: 'PLAIN' // Explicitly specify auth method
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