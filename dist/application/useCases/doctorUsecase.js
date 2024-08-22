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
exports.DoctorUseCase = void 0;
const generateOtp_1 = require("../../utils/generateOtp");
const otpSending_1 = __importDefault(require("../../utils/otpSending"));
class DoctorUseCase {
    constructor(repository) {
        this.repository = repository;
    }
    userExists(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.repository.findUserExists(email);
            console.log("user is ", user);
            return user ? user : null;
        });
    }
    registerUser(values) {
        return __awaiter(this, void 0, void 0, function* () {
            const { otp, creationTime } = (0, generateOtp_1.generateOtpWithTime)();
            values.otp = otp;
            values.createdAt = creationTime;
            if (!values.firstname) {
                const user = yield this.repository.saveNewUser(values);
            }
            const user = yield this.repository.saveNewUser(values);
            console.log("Chenking");
            (0, otpSending_1.default)(values.email, otp);
            return user ? user : null;
        });
    }
    otpVerification(otp) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Otp useCase working", otp);
            const userData = yield this.repository.otpVerify(otp);
            console.log("userdaaaaaaaa", userData);
            return userData ? userData : null;
        });
    }
    loginVerfication(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Login verification on usecase", email);
            const checkUser = yield this.repository.userLogin(email, password);
            if (!checkUser) {
                return null;
            }
            return checkUser;
        });
    }
    getUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const userData = yield this.repository.getUserById(userId);
            if (!userData) {
                return null;
            }
            return userData;
        });
    }
    refreshTokenUsecase(oldToken) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!oldToken) {
                return null;
            }
            const checkToken = yield this.repository.refreashToken(oldToken);
            if (!checkToken) {
                return null;
            }
            else {
                console.log('refresh token creaedd usecase');
                return checkToken;
            }
        });
    }
    docVefication(userForm) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('in usecase', userForm);
            const result = yield this.repository.verification(userForm);
            if (!result) {
                return null;
            }
            console.log('result is ', result);
            return result;
        });
    }
    getDoc(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const doctorData = yield this.repository.getDocData(email);
            if (!doctorData) {
                return null;
            }
            return doctorData;
        });
    }
    updateDoctor(doctorForm) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.repository.updateDoc(doctorForm);
            if (!result) {
                return null;
            }
            return result;
        });
    }
    emailVerification(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.repository.emailVerify(email);
            if (!user) {
                return null;
            }
            return user;
        });
    }
    forgotOtp(otp, email) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('otp', otp, 'email', email);
            const checking = yield this.repository.forgotOtpVerify(otp, email);
            console.log('user issss', checking);
            if (checking) {
                return checking;
            }
            return null;
        });
    }
}
exports.DoctorUseCase = DoctorUseCase;
