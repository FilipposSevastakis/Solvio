import amqp from 'amqplib';

export async function pushResults(message) {
    try {
        const connection = await amqp.connect(process.env.RABBITMQ_ANSWERS_URL);
        const channel = await connection.createChannel();
        
        await channel.assertExchange(process.env.EXCHANGE_NAME_ANSWERS, 'fanout', { durable: true });

        const stringifiedMessage = JSON.stringify(message);
        channel.publish(process.env.EXCHANGE_NAME_ANSWERS, '', Buffer.from(stringifiedMessage));

        console.log(`Sent: ${stringifiedMessage}`);

    } catch (error) {
        console.log(error);
    }
}