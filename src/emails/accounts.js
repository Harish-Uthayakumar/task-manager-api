const sgMail = require('@sendgrid/mail')


sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {

    sgMail.send({
        to: email,
        from: 'lifehakpro@gmail.com',
        subject: 'Thanks for joining our exclusive community of learners and doers',
        text: `I hope this ${name} one actually gets to you`
    })


}

const cancelEmail = (email, name) => {

    sgMail.send({

        to: email,
        from: 'uharishkuma@gmail.com',
        subject: 'I\'m really sorry that you have to left us. Would be great if we could know the reason why you left'

    })
}

module.exports = {
    sendWelcomeEmail,
    cancelEmail
}



