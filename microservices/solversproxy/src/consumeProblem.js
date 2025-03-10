import amqp from 'amqplib';
import { storeProblem } from './models/storeProblem.js';
import { Solver } from './controllers/controllers.js';

let solverStatus = true;

export async function consumeProblem() {
    try {
        const connection = await amqp.connect(process.env.RABBITMQ_QUESTIONS_URL);
        const channel = await connection.createChannel();
        
        await channel.assertExchange(process.env.EXCHANGE_NAME_QUESTIONS, 'fanout', { durable: true });
        
        const queueName = process.env.QUEUE_NAME;
        const queue = await channel.assertQueue(queueName, { durable: true });
        
        console.log(`Consumer started. Waiting for messages in queue ${queueName}...`);
        await channel.bindQueue(queue.queue, process.env.EXCHANGE_NAME_QUESTIONS, '');

        while (true) {
            if (solverStatus) {
                solverStatus = false;
                const message = await channel.get(queue.queue, { noAck: false });
                if (message) {
                    channel.ack(message);
                    const parsedMessage = await JSON.parse(message.content.toString());

                    if (parsedMessage.status === "running") {
                        console.log(`Received Problem (id: ${parsedMessage._id}) from ProxyQueue`);
                        //await storeProblem(parsedMessage);
                        await Solver(parsedMessage);
                    }
                }
                solverStatus = true;
            }
        }
    } catch (error) {
        console.log(error);
    }
}