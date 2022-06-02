const nodemailer = require('nodemailer')
const sgMail = require('@sendgrid/mail');
const constant = require('../constants/constants')
const handlebars = require('handlebars');
const headerfooter =  require('../utils/templates/headerfooter').headerfooter
const ticketEmail =  require('../utils/templates/ticketEmail').ticketEmail
// const {headerfooter, ticketEmail} =  require('../utils/templates/index')


let transporter = nodemailer.createTransport({
    host: process.env.SMTP_host,
    port: process.env.SMTP_port,
    secure: process.env.SMTP_ssl,
    secure: true,
    pool: true,
    auth: {
      user: process.env.SMTP_username,
      pass: process.env.SMTP_password
    }
  });

async function sendEmailNotification(option, data) {
    console.log("data:", data);
    if (option.isEmail) {
        let mailOptions 
        switch (option.type) {

            case constant.EMAIL_TYPE.TICKET_EMAIL: {
                let ticketEmailDetail = {
                    name: data.name,
                    senderName: data.senderName,
                    title: data.title,
                    description: data.description,
                    ticketStatus: data.ticketStatus
                }
                let compiledHtml = handlebars.compile(ticketEmail)(ticketEmailDetail)
                let html = handlebars.compile(headerfooter)({ html: compiledHtml })
                mailOptions = {
                    to: data.email,
                    subject: "ticket Email",
                    html: html
                }
                break;
            }

        }
        return await transporter.sendMail(mailOptions, function(err, response){
            console.log("transport:")
            if(err){
                console.log("err", err);
            }
            if(response){
                console.log("response:", response)
            }
        })
      

    }
}

  module.exports =  {
    sendEmailNotification
  }