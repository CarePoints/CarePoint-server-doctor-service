import express from 'express';
const router = express.Router()
import multer from 'multer'
const upload = multer();

import {DoctorRepository} from '../../infastructure/repositroy/doctorRepository';
import {DoctorUseCase} from '../../application/useCases/doctorUsecase';
import {DoctorController} from '../../presentation/controllers/doctorController';
import authenticationToken from '../../utils/authMiddleware';
import { uploadSingleImage } from '../../middleware/uploadMiddleware';

const repository = new DoctorRepository();
const doctor = new DoctorUseCase(repository);
const controller = new DoctorController(doctor);

//routing-service and nginx both apigateway are used for authenitcation purpose
router.post('/signup', controller.registerUser.bind(controller));
router.post('/verify-otp', controller.otpConfirm.bind(controller)); 
router.post('/login', controller.login.bind(controller));
router.get('/user', authenticationToken,controller.getUserID.bind(controller));
router.post('/refreshToken', controller.refreshToken.bind(controller)); 

//nginx apigateway only
router.post('/doctorVerification', controller.doctorVerification.bind(controller)); 
router.post('/getDoctorData', controller.getDocData.bind(controller)); 
router.post('/updateDocData', controller.updateDocData.bind(controller)); 
router.post('/checkEmail', controller.checkEmail.bind(controller));
router.post('/forgotPassword', controller.forgotPassword.bind(controller));
router.post('/resetPassword',controller.resetPassword.bind(controller))
router.get('/getDoctorData',controller.getDoctorData.bind(controller))
router.post('/cancelBooking', controller.cancelBooking.bind(controller))
router.post('/selectedDoctorForMapTracking', controller.selectedDoctorForMapTracking.bind(controller))
router.get('/appointments', controller.offlineAppoinments.bind(controller))
router.post('/appointmentAccepted', controller.appointmentAccepted.bind(controller))
router.post('/appointmentRejected', controller.appointmentRejected.bind(controller))
router.post('/upload',uploadSingleImage, controller.addPrescription.bind(controller))
router.post("/sendPrescription",upload.single('file'), controller.sendPrescription.bind(controller))



export default router