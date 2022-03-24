var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

var nodemailer = require("nodemailer");
const amqp = require("amqplib/callback_api");

class mailservice {
  service = async (globalstorage, emailId) => {
    try {
      // console.log(globalstorage)
      console.log(emailId);

      // const connection = await connectObject.connection();

      amqp.connect("amqp://localhost", function (error0, connection) {
        if (error0) {
          throw error0;
        }
        connection.createChannel(function (error1, channel) {
          if (error1) {
            throw error1;
          }
          var queue = "email";

          channel.assertQueue(queue, {
            durable: true,
          });

          channel.sendToQueue(queue, Buffer.from(`${emailId}`));
          console.log(" [x] Sent %s");

          // res.status(200).json({ message: "send", success: true });
        });
      });
      this.worker();
    } catch (e) {
      console.log(e);
      throw e;
    }
  };
  worker = async (req, res) => {
    amqp.connect("amqp://localhost", function (error0, connection) {
      if (error0) {
        throw error0;
      }
      connection.createChannel(function (error1, channel) {
        if (error1) {
          throw error1;
        }
        var queue = "email";

        channel.assertQueue(queue, {
          // durable: true,
        });
        // channel.prefetch(1);
        // console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);

        channel.consume(
          queue,
          (msg) => {
            console.log(
              `Message received From Happy QUEUE: ${msg.content.toString()}`
            );

            var transporter = nodemailer.createTransport({
              service: "gmail",
              auth: {
                user: "dummyseniour007@gmail.com",
                pass: "gurmeet@21",
              },
            });

            var mailOption = {
              from: "dummyseniour007@gmail.com",
              to: `${msg.content.toString()}`,
              subject: `Forget Password`,
              text: Math.floor(Math.random() * 99999).toString(),
            };

            transporter.sendMail(mailOption, function (error, info) {
              if (error) {
                console.log(error);
              }
              console.log(info.response);
              return res
                .status(200)
                .json({ message: info.response, success: true });
            });
          },
          {
            noAck: true,
          }
        );
      });
    });
  };
}

module.exports = new mailservice();

module.exports = router;
