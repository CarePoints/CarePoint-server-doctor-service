import express from 'express';
import connectDatabase from './config/database/connection';
import cors from "cors";
import router from './presentation/routes/doctorRouter';
import { setupRabbitMQ } from './infastructure/rabbitmq/producer';
import { connectToRabbitMQ }from './infastructure/rabbitmq/consumer';
// import {RabbitMQProducer} from '../src/infastructure/rabbitmq/producer'
const PORT = 5000

const app = express();
app.use(express.json());
connectDatabase();
app.use(cors())



app.use('/doctor-service',router)

setupRabbitMQ((channel) => {
  console.log('RabbitMQ is set up and ready.');
});

connectToRabbitMQ('Queue1');

app.listen(PORT, () => {
    console.log(`server is runnign ${PORT}`);
  });
  






