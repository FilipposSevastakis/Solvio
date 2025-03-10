import amqp from "amqplib";
import Users from "./models/Users.js";
import axios from "axios";

// consume an answer from the broker of answers
export async function consume_from_answers_queue() {
  try {
    // Connect to RabbitMQ server
    const connection = await amqp.connect(process.env.RABBITMQ_ANSWERS_URL);
    console.log(process.env.RABBITMQ_ANSWERS_URL);

    // Create a channel
    const channel = await connection.createChannel();

    // Create the fanout exchange
    const exchangeName = process.env.EXCHANGE_NAME_ANSWERS;
    await channel.assertExchange(exchangeName, "fanout", { durable: true });

    // Create the usersmanagement queue and bind it to the exchange
    // (no binding key is necessary - fanout exchange)
    const queueName = process.env.QUEUE_NAME_USERS_MANAGEMENT;
    const assertQueue = await channel.assertQueue(queueName, { durable: true });

    await channel.bindQueue(assertQueue.queue, exchangeName, "");

    // Start consuming messages
    console.log(
      `Consumer started. Waiting for messages in queue ${queueName}...`
    );
    channel.consume(
      assertQueue.queue,
      async (message) => {
        try {
          // find the user related to the produced answer
          const messageData = JSON.parse(message.content.toString());
          console.log(`Received message from ${queueName}: ${messageData}`);
          const user = await Users.findOne({ _id: messageData.userID });

          // if enough credits available, decrease credits.
          // Also, after every 60 seconds of using the solver,
          // give 10 credits as a gift
          if (parseInt(user.credits) - messageData.execTime >= 0) {
            user.credits = `${parseInt(user.credits) - messageData.execTime}`;
            console.log(user.credits);
            user.totalExecTime = user.totalExecTime + messageData.execTime;
            if (user.totalExecTime > 60) {
              const times = parseInt(user.totalExecTime / 60);
              user.totalExecTime = user.totalExecTime % 60;
              user.credits = `${parseInt(user.credits) + 10 * times}`;
            }
            console.log("FINAL", user);
            await user.save();
          } else {
            // if not enough credits, ensure that the produced answer
            // is not accessible by the user
            // (allowToShowResults parameter -> false)
            let result = await axios.post(
              `http://showsubmissions:5000/api/updateAllowResults`,
              {
                problemID: messageData.problemID,
              }
            );
            let result2 = await axios.post(
              `http://showresults:5000/api/updateAllowResults`,
              {
                problemID: messageData.problemID,
              }
            );
          }
          // send acknowledgement
          channel.ack(message);
        } catch (error) {
          console.error("Error processing message:", error);
        }
      },
      { noAck: false }
    );
  } catch (error) {
    console.log(error);
  }
}
