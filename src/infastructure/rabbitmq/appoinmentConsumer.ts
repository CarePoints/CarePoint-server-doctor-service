
import {
    connect,
    Connection,
    Channel,
    ConsumeMessage,
  } from "amqplib/callback_api";
  import { DoctorRepository } from "../repositroy/doctorRepository";
  
  const amqpUrl: string = "amqp://172.29.64.1";
  const queueName: string = "Queue1"; // Unique name for each consumer's queue
  const exchangeName: string = "appoinmentDetails";
  const routingKey: string = "appoinment.data";
  
  export const connectToRabbitMQForAppoinment = (queue: string) => {
    connect(amqpUrl, (err: Error | null, connection: Connection) => {
      if (err) {
        throw err;
      }
      connection.createChannel((err: Error | null, channel: Channel) => {
        if (err) {
          throw err;
        }
  
        // Assert the queue
        channel.assertQueue(queue, { durable: false });
  
        // Bind the queue to the exchange with the routing key
        channel.bindQueue(queue, exchangeName, routingKey);
  
        console.log(`Waiting for messages in ${queue}. To exit press CTRL+C`);

        const doctorRepo = new DoctorRepository();
        // Consume messages from the queue
        channel.consume(queue, async (msg: any | null) => {
          if (msg) {
            const receivedData = JSON.parse(msg.content.toString());
            console.log(`Received message in ${queue}: in doctor servicegi`, receivedData);
            // Process the message here
            const { email, user, Date, Time, appointmentType } = receivedData;
            
            await doctorRepo.savingAppoinments(email,user,Date,Time,appointmentType);
        
      }
          channel.ack(msg);
        });
      });
    });
  };
  