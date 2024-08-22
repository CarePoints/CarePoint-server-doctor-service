import { registerUser } from "../../domain/entities/signUpUser";
import { UserDocument } from "../database/model/userModel";
export interface UserLoginResponse {
    token: string;
    userDoc: UserDocument;
  }
export interface DoctorForm {
    formValues: {
      specialization: string;
      licenseNumber: string;
      certificationDetails: string;
      yearsOfExperience: string; 
      residentialAddress: string;
      practiceAddress: string;
      workingHours: string;
      consultationTypes: string[];
      alternativePhoneNumber: string;
      alternateEmail: string;
      bio: string;
      onCallAvailability: string;
    };
    email: string;
  }
export interface IDoctorRepository{
    findUserExists(email:string): Promise<UserDocument | null>;
    saveNewUser(values:registerUser): Promise<UserDocument| null>
    otpVerify(otp:any): Promise<UserDocument|null> 
    userLogin(email:string,password:string): Promise<UserLoginResponse | null>
    getUserById(userId:string): Promise<UserDocument | null>
    refreashToken(token: string): Promise<any | null>;
    verification(doctorForm:DoctorForm): Promise<UserDocument| null>;
    getDocData(email:string): Promise<UserDocument| null>
    updateDoc(doctorForm:UserDocument) : Promise<Boolean>
    emailVerify(email:string): Promise<any|null>
    forgotOtpVerify(otp:string,email:string) : Promise<UserDocument|null>    
}