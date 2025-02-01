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

    // Create the email service queue and bind it to the exchange
    // (no binding key is necessary - fanout exchange)
    const queueName = process.env.QUEUE_NAME_EMAIL_SERVICE;
    const assertQueue = await channel.assertQueue(queueName, { durable: true });

    await channel.bindQueue(assertQueue.queue, exchangeName, "");

    // Start consuming messages : When a new answer is consumed, an email is sent to the
    // appropriate user (call to the email service)
    console.log(
      `Consumer started. Waiting for messages in queue ${queueName}...`
    );
    channel.consume(
      assertQueue.queue,
      async (message) => {
        try {
          const messageData = JSON.parse(message.content.toString());
          console.log(messageData);
          console.log(
            `Received message from ${queueName}: ${messageData.userID} ${messageData.id}`
          );
          const result = await axios.post(
            "http://emailservice:5000/email/sendEmailForAnswer",
            {
              userID: messageData.userID,
              problemID: messageData.id,
            }
          );
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
