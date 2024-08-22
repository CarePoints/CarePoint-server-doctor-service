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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoctorController = void 0;
class DoctorController {
    constructor(doctorUsecase) {
        this.doctorUsecase = doctorUsecase;
    }
    registerUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.body) {
                return null;
            }
            const { firstname, lastname, email, password, phonenumber, role } = req.body;
            const values = { firstname, lastname, email, password, phonenumber, role };
            console.log("values.email", email);
            const existingUser = yield this.doctorUsecase.userExists(email);
            if (existingUser) {
                console.log("existesing ");
                const response = yield this.doctorUsecase.registerUser(values);
                return res.status(200).json({ message: response });
            }
            else {
                const response = yield this.doctorUsecase.registerUser(values);
                console.log("responsedkfjkfbhfkjgbhfjk", response);
                return res.status(200).json({ message: response });
            }
        });
    }
    otpConfirm(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Otp Controller working");
            let values = req.body;
            const user = yield this.doctorUsecase.otpVerification(values);
            if (!user) {
                return res.status(400).json({ message: "Invalid or expired Otp " });
            }
            return res
                .status(200)
                .json({ message: "Otp Verification Successfully", user });
        });
    }
    login(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("login is working");
            const { email, password } = req.body;
            const result = yield this.doctorUsecase.loginVerfication(email, password);
            console.log("user datas are", result);
            if (result) {
                res.status(200).json({ user: result.userDoc, token: result.token });
            }
            else {
                res.status(401).json({ message: "User is not exits" });
            }
        });
    }
    getUserID(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id; // This should work now
            if (!userId) {
                return res.status(404).json({ message: "User ID not found" });
            }
            // Replace with actual logic to get user
            const result = yield this.doctorUsecase.getUser(userId);
            if (!result) {
                return res.status(404).json({ message: "User not found" });
            }
            res.status(200).json({ user: result });
        });
    }
    refreshToken(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("login is working");
            const { oldToken } = req.body;
            const result = yield this.doctorUsecase.refreshTokenUsecase(oldToken);
            if (result) {
                console.log("refresh token is workkingggggggggggg", result);
                res.status(200).json({ user: result.userDoc, token: result.token });
            }
            else {
                res.status(401).json({ message: "User is not exits" });
            }
        });
    }
    doctorVerification(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let doctorForm = req.body;
            const result = yield this.doctorUsecase.docVefication(doctorForm);
            if (!result) {
                return res.status(400).json({ message: "Verification failed" });
            }
            res.status(200).json({ message: "Verification successful", data: result });
        });
    }
    getDocData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email } = req.body;
            if (!email) {
                return res.status(400).json({ message: "User Not found" });
            }
            const result = yield this.doctorUsecase.getDoc(email);
            return res.status(200).json({ result });
        });
    }
    updateDocData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // const result = await
            console.log("doctor data is", req.body);
            let doctorData = req.body;
            const result = yield this.doctorUsecase.updateDoctor(doctorData);
            console.log("result", result);
            if (!result) {
                return res.status(400).json({ message: "User Not found" });
            }
            return res.status(200).json({ message: "Data Updated successfully" });
        });
    }
    checkEmail(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let { email } = req.body.email;
            console.log("eemail isssssssssss", email);
            const result = yield this.doctorUsecase.emailVerification(email);
            console.log("ree", result);
            if (!result) {
                return res.status(400).json({ message: "User not found" });
            }
            const response = yield this.doctorUsecase.registerUser(result);
            console.log("response", response);
            return res.status(200).json({ message: "Otp send successfully" });
        });
    }
    forgotPassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("eeeee", req.body);
            const { otp, email } = req.body;
            const user = yield this.doctorUsecase.forgotOtp(otp, email);
            console.log("user", user);
            if (!user) {
                return res.status(400).json({ message: "Otp is not correct" });
            }
            return res.status(200).json({ message: "Otp is correct" });
        });
    }
    resetPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("doctor server iser", req.body);
        });
    }
}
exports.DoctorController = DoctorController;
