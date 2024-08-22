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
exports.DoctorRepository = void 0;
const passwordUtils_1 = require("../../utils/passwordUtils");
const authUtlis_1 = require("../../utils/authUtlis");
const userModel_1 = require("../database/model/userModel");
const bcrypt_1 = __importDefault(require("bcrypt"));
class DoctorRepository {
    findUserExists(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield userModel_1.User.findOne({ email });
            return user;
        });
    }
    saveNewUser(values) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { firstname, lastname, email, password, phonenumber, otp, createdAt, } = values;
                console.log("Received values:", values); // Inspect the values
                let hashedPass;
                let existingUser = yield userModel_1.User.findOne({ email });
                if (existingUser) {
                    if (firstname && lastname && password && phonenumber) {
                        hashedPass = yield (0, passwordUtils_1.hashPassword)(password);
                        const stringMobile = phonenumber.toString();
                        existingUser.firstname = firstname;
                        existingUser.lastname = lastname;
                        existingUser.password = hashedPass;
                        existingUser.phonenumber = stringMobile;
                    }
                    existingUser.otp = otp;
                    existingUser.createdAt = createdAt;
                    yield existingUser.save();
                    console.log("Updated existing user with new details:", existingUser);
                    return existingUser;
                }
                else {
                    hashedPass = yield (0, passwordUtils_1.hashPassword)(password);
                    const newUser = new userModel_1.User({
                        firstname,
                        lastname,
                        email,
                        password: hashedPass,
                        phonenumber,
                        isVerified: false,
                        otp,
                        createdAt,
                    });
                    console.log("Created new user:", newUser);
                    yield newUser.save();
                    return newUser;
                }
            }
            catch (error) {
                console.error("Error saving user:", error);
                return null;
            }
        });
    }
    otpVerify(otp) {
        return __awaiter(this, void 0, void 0, function* () {
            const otpObject = otp;
            const otpString = otpObject.otp;
            let otpNumber = parseInt(otpString, 10);
            console.log("Otp repositroy working", otpNumber);
            const user = yield userModel_1.User.findOne({ otp: otpNumber });
            console.log("otp userdate is", user);
            if (user && user.createdAt) {
                const createdAt = new Date(user.createdAt);
                const newTime = new Date();
                const timeDifference = newTime.getTime() - createdAt.getTime();
                const difference = Math.floor(timeDifference / (1000 * 60));
                if (difference > 1) {
                    return null;
                }
                user.isVerified = true;
                user.otp = 0;
                yield user.save();
                console.log("final user is", user);
                return user ? user : null;
            }
            else {
                return null;
            }
        });
    }
    userLogin(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userDoc = yield userModel_1.User.findOne({ email });
                if (!userDoc) {
                    return null;
                }
                if (!userDoc.password) {
                    return null;
                }
                let hashedPass = userDoc.password;
                const isMatch = yield bcrypt_1.default.compare(password, hashedPass);
                if (!isMatch) {
                    return null;
                }
                const user = {
                    _id: userDoc._id,
                    email: userDoc.email,
                    roles: userDoc.roles,
                };
                const token = (0, authUtlis_1.generateToken)(user);
                return { token, userDoc };
            }
            catch (err) {
                console.log(err);
            }
            return null;
        });
    }
    getUserById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield userModel_1.User.findById(userId);
            if (!user) {
                return null;
            }
            return user;
        });
    }
    refreashToken(oldToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const decodedToken = (0, authUtlis_1.verifyToken)(oldToken);
            if (typeof decodedToken !== "string" && decodedToken.id) {
                const existingUser = yield userModel_1.User.findById(decodedToken.id);
                if (!existingUser) {
                    throw new Error("user not found");
                }
                const newToken = (0, authUtlis_1.generateRefreshToken)(existingUser);
                return newToken;
            }
            else {
                throw new Error("Invalid token payload");
            }
        });
    }
    verification(doctorForm) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Destructure formValues and email from doctorForm
                const { formValues, email } = doctorForm;
                // Destructure formValues
                const { specialization, licenseNumber, certificationDetails, yearsOfExperience, residentialAddress, practiceAddress, workingHours, consultationTypes, alternativePhoneNumber, alternateEmail, bio, onCallAvailability, } = formValues;
                console.log("Form Values:", formValues);
                console.log("Email:", email);
                // Find the doctor by email
                const doctor = yield userModel_1.User.findOne({ email });
                if (doctor) {
                    // Update the doctor with new information
                    let doctorVerified = yield userModel_1.User.findOneAndUpdate({ email }, {
                        specialization,
                        licenseNumber,
                        certificationDetails,
                        yearsOfExperience,
                        residentialAddress,
                        practiceAddress,
                        workingHours,
                        consultationTypes,
                        alternativePhoneNumber,
                        alternateEmail,
                        bio,
                        onCallAvailability,
                    });
                    return doctorVerified;
                }
                return null;
            }
            catch (error) {
                console.error("Error in verification:", error);
                return null;
            }
        });
    }
    getDocData(email) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!email) {
                return null;
            }
            const response = yield userModel_1.User.findOne({ email });
            if (!response) {
                return null;
            }
            return response;
        });
    }
    updateDoc(doctorForm) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("form value are", doctorForm);
            const email = doctorForm.email;
            if (!email) {
                return false;
            }
            const doctorData = yield userModel_1.User.findOne({ email });
            if (!doctorData) {
                return false;
            }
            const response = yield userModel_1.User.updateOne({ email }, { $set: doctorForm });
            console.log("Update successful", response);
            return true;
        });
    }
    emailVerify(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield userModel_1.User.findOne({ email });
            if (!user) {
                return null;
            }
            const userData = {
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email,
                password: user.password,
                phonenumber: user.phonenumber,
                otp: user.otp,
                createdAt: user.createdAt,
            };
            return userData;
        });
    }
    forgotOtpVerify(otp, email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield userModel_1.User.findOne({ email });
            if (!user) {
                return null;
            }
            const otpNumber = parseInt(otp, 10);
            if (isNaN(otpNumber) || user.otp === undefined) {
                return null;
            }
            if (user.otp === otpNumber) {
                return user;
            }
            return null;
        });
    }
}
exports.DoctorRepository = DoctorRepository;
