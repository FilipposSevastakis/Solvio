import amqp from "amqplib";

// push a message to the broker of problems
export async function produce_to_questions_queue(message) {
  try {
    // Connect to RabbitMQ server
    const connection = await amqp.connect(process.env.RABBITMQ_QUESTIONS_URL);

    // Create a channel
    const channel = await connection.createChannel();

    // Create the fanout exchange
    const exchangeName = process.env.EXCHANGE_NAME;
    await channel.assertExchange(exchangeName, "fanout", { durable: true });

    // routing key has no effect in fanout exchanges
    channel.publish(exchangeName, "", Buffer.from(message));
    console.log(`Sent : ${message}`);
  } catch (error) {
    console.log(error);
  }
}
