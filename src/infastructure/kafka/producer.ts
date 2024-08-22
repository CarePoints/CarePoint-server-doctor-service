const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'doctor-service',
  brokers: ['localhost:9092']
});

const producer = kafka.producer();

const run = async () => {
  await producer.connect();
  await producer.send({
    topic: 'doctor-to-admin',
    messages: [
      { value: 'Your message here' }
    ],
  });
  await producer.disconnect();
};

export default run
