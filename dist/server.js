"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const connection_1 = __importDefault(require("./config/database/connection"));
const cors_1 = __importDefault(require("cors"));
const doctorRouter_1 = __importDefault(require("./presentation/routes/doctorRouter"));
const PORT = 5000;
const app = (0, express_1.default)();
app.use(express_1.default.json());
(0, connection_1.default)();
app.use((0, cors_1.default)());
app.use('/doctor-service', doctorRouter_1.default);
// const producer = new RabbitMQProducer('doctorDetails');
// producer.connect().then(()=>{
//   console.log('RabitMQ Producer connected');
// }).catch((err)=>{
//   console.error('Failed to connect RabbitMQ Producer',err)
// })
app.listen(PORT, () => {
    console.log(`server is runnign ${PORT}`);
});
