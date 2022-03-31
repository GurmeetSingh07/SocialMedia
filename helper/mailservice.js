let nodemailer = require("nodemailer");
const amqp = require("amqplib/callback_api");
var connectionObject = require("../helper/rabbitMqConnection");
class Rabbitmqnodemailer {
  constructor() {
    this.createConnection();
  }
  createConnection = async (req, res) => {
    this.connection = await connectionObject.connection();
  };

  rabbit = async (globalstorage, emailId) => {
    try {
      let otp = globalstorage[`${emailId}`];

      console.log(emailId);
      console.log(otp);

      // amqp.connect("amqp://localhost", (connError, connection) => {
      //   if (connError) {
      //     throw connError;
      //   }

      this.connection.createChannel((channelError, channel) => {
        if (channelError) {
          throw channelError;
        }

        let data = {
          emailId: `${emailId}`,
          otp: `${otp}`,
        };
        // console.log(data);

        let newData = JSON.stringify(data);
        const QUEUE = "email";
        channel.assertQueue(QUEUE);

        channel.sendToQueue(QUEUE, Buffer.from(newData));
        // console.log(`Message send ${QUEUE} `);
      });
      // });

       
      // Receive
      this.connection.createChannel((channelError, channel) => {
        if (channelError) {
          throw channelError;
        }

        const QUEUE = "email";
        channel.assertQueue(QUEUE);

        channel.consume(
          QUEUE,
          (msg) => {
            // console.log(
            //   `Message received From ${QUEUE} QUEUE: ${msg.content.toString()}`
            // );

            let result = msg.content.toString();
            let mailData = JSON.parse(result);

            // console.log(fetch.emailId);

            let transporter = nodemailer.createTransport({
              service: "gmail",
              auth: {
                user: "dummyt902@gmail.com",
                pass: "@12346788@",
              },
              tls: {
                rejectUnauthorized: false,
              },
            });
            mailOptions = {
              from: `dummyt902@gmail.com`,
              to: `${mailData.emailId}`,
              subject: `Forget Password`,
              text: `Your OTP code is ${mailData.otp} `,
            };
            console.log("newotp" + mailData.otp);

            const sendEmail = transporter.sendMail(mailOptions);
          },
          {
            noAck: true,
          }
        );
      });
      // });
    } catch (e) {
      console.log(e);
      throw e;
    }
  };
}
module.exports = new Rabbitmqnodemailer();
