import { returnUser } from "../../domain/entities/returnUser";
import { registerUser } from "../../domain/entities/signUpUser";
import { UserDocument } from "../../infastructure/database/model/userModel";
import { UserLoginResponse } from "../../infastructure/interface/IDoctorRepository";

export interface IdoctorUsecase{
    userExists(email:string): Promise<returnUser | null>;
    registerUser(values:registerUser): Promise<returnUser|null> ;
    otpVerification(otp:string): Promise<returnUser|null>;
    loginVerfication(email:string,password:string): Promise<UserLoginResponse| null>;
    getUser(userId:any): Promise<UserDocument|null>;
    refreshTokenUsecase(oldToken:string): Promise<UserLoginResponse| null>;
    docVefication(doctorForm:UserDocument): Promise<UserDocument|null>;
    getDoc(email:string): Promise<UserDocument | null>
    updateDoctor(doctorForm:UserDocument) : Promise<Boolean| null>;
    emailVerification(email:string): Promise<registerUser| null>

    forgotOtp(otp:string,email:string): Promise<returnUser|null>

}