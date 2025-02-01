import amqp from 'amqplib';
import { storeResult } from './models/storeResult.js';

export async function consumeResult() {
    try {
        // Connect to RabbitMQ server
        const connection = await amqp.connect(process.env.RABBITMQ_ANSWERS_URL);
        const channel = await connection.createChannel();

        await channel.assertExchange(process.env.EXCHANGE_NAME, 'fanout', { durable: true });

        const queueName = process.env.QUEUE_NAME;
        const queue = await channel.assertQueue(queueName, { durable: true });

        await channel.bindQueue(queue.queue, process.env.EXCHANGE_NAME);
        console.log(`Consumer started. Waiting for messages in queue ${queueName}...`);

        channel.consume(queue.queue, async (message) => {
            const parsedMessage = JSON.parse(message.content.toString());
            console.log(`Received Problem (id: ${parsedMessage._id}) from ${queueName}`);

            await storeResult(parsedMessage);
            channel.ack(message);
        }, { noAck: false });

    } catch (error) {
        console.log(error);
    }
}