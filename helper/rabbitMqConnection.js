const amqp = require("amqplib");
// console.log("hello");
class Rabbitconnection {
  connection = async (req, res) => {
    const connection = await amqp.connect("amqp://localhost");
    console.log("connect rabbitMq");
    return connection;
  };
}

module.exports = new Rabbitconnection();
