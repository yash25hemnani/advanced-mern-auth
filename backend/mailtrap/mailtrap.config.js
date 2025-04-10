const { MailtrapClient } = require("mailtrap");

const TOKEN = "2c6054d151eb76b425e3c28d14bf56aa";

const client = new MailtrapClient({
  token: TOKEN,
});

const sender = {
  email: "hello@demomailtrap.co",
  name: "Mailtrap Test",
};

module.exports = {client, sender}