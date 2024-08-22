"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RabbitMQProducer = void 0;
const amqplib_1 = __importDefault(require("amqplib"));
class RabbitMQProducer {
    constructor(queue) {
        this.queue = queue;
        this.connection = null;
        this.channel = null;
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            // Connect to RabbitMQ with username and password
            const rabbitMQUrl = 'amqp://guest:guest@localhost:5672';
            this.connection = yield amqplib_1.default.connect(rabbitMQUrl);
            this.channel = yield this.connection.createChannel();
            yield this.channel.assertQueue(this.queue, { durable: true });
        });
    }
    sendMessage(message) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.channel) {
                throw new Error('Channel not initialized. Call connect() first.');
            }
            this.channel.sendToQueue(this.queue, Buffer.from(JSON.stringify(message)), { persistent: true });
        });
    }
    disconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.channel)
                yield this.channel.close();
            if (this.connection)
                yield this.connection.close();
        });
    }
}
exports.RabbitMQProducer = RabbitMQProducer;
// Example usage
(() => __awaiter(void 0, void 0, void 0, function* () {
    const producer = new RabbitMQProducer('doctorDetails');
    yield producer.connect();
    yield producer.sendMessage({ userId: '123', userDetails: { name: 'John Doessssssssss' } });
    yield producer.disconnect();
}))();
