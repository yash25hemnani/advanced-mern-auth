const {client, sender} = require('./mailtrap.config');
const {VERIFICATION_EMAIL_TEMPLATE, PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE} = require("./emailTemplates")

const sendVerificationEmail = async (email, verificationToken) => {
    const recipient = [{email}]

    try {
        const response = await client.send({
            from: sender,
            to: recipient,
            subject: "Verify your email",
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
            category: "Email Verification"
        })

        console.log("Email sent successfully!", response);
    } catch (error) {
        console.log("Error sending Email: ", error.message);
    }
}

const sendWelcomeEmail = async (email, name) => {
    const recipient = [{email}]

    try {
        const response = await client
        .send({
          from: sender,
          to: recipient,
          template_uuid: "ceec1cd6-4925-4f29-a06c-4537aa8e4c84",
          template_variables: {
            "name": "Test_Name",
            "company_info_name": "Test_Company_info_name",
            "company_info_address": "Test_Company_info_address",
            "company_info_city": "Test_Company_info_city",
            "company_info_zip_code": "Test_Company_info_zip_code",
            "company_info_country": "Test_Company_info_country"
          }
        })
        .then(console.log, console.error);

        console.log("Email sent successfully!");
    } catch (error) {
        throw new Error("Error sending Email: ", error.message);
    }
}

const sendPasswordResetEmail = async (email, resetUrl) => {
    const recipient = [{email}]
    console.log(resetUrl);

    try {
        const response = await client.send({
            from: sender,
            to: recipient,
            subject: "Reset Your Password",
            html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetUrl),
            category: "Password Reset"
        })
    } catch (error) {
        throw new Error("Error sending password reset email: ", error)
    }
}

const sendResetSuccessEmail = async (email) => {
    const recipient = [{email}]

    try {
        const response = await client.send({
            from: sender,
            to: recipient,
            subject: "Password Reset Successful",
            html: PASSWORD_RESET_SUCCESS_TEMPLATE,
            category: "Password Reset Successful"
        })
    } catch (error) {
        throw new Error("Error sending password reset success email: ", error)
    }
}

module.exports = {sendVerificationEmail, sendWelcomeEmail, sendPasswordResetEmail, sendResetSuccessEmail}