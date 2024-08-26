import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  }
})
// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: 'phetaibtc@gmail.com', // Your email address
//     pass: 'mcjniswfwfybhfyo', // Your email password or app-specific password
//   },
// });

export default transporter