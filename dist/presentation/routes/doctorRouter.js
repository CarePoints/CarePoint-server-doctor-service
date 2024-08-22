"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const doctorRepository_1 = require("../../infastructure/repositroy/doctorRepository");
const doctorUsecase_1 = require("../../application/useCases/doctorUsecase");
const doctorController_1 = require("../../presentation/controllers/doctorController");
const authMiddleware_1 = __importDefault(require("../../utils/authMiddleware"));
const repository = new doctorRepository_1.DoctorRepository();
const doctor = new doctorUsecase_1.DoctorUseCase(repository);
const controller = new doctorController_1.DoctorController(doctor);
//routing-service and nginx both apigateway are used for authenitcation purpose
router.post('/signup', controller.registerUser.bind(controller));
router.post('/verify-otp', controller.otpConfirm.bind(controller));
router.post('/login', controller.login.bind(controller));
router.get('/user', authMiddleware_1.default, controller.getUserID.bind(controller));
router.post('/refreshToken', controller.refreshToken.bind(controller));
//nginx apigateway only
router.post('/doctorVerification', controller.doctorVerification.bind(controller));
router.post('/getDoctorData', controller.getDocData.bind(controller));
router.post('/updateDocData', controller.updateDocData.bind(controller));
router.post('/checkEmail', controller.checkEmail.bind(controller));
router.post('/forgotPassword', controller.forgotPassword.bind(controller));
router.post('/resetPassword', controller.resetPassword.bind(controller));
exports.default = router;
