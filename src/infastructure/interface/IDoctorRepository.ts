import { registerUser } from "../../domain/entities/signUpUser";
import { IDoctorAppointment } from "../database/model/appoinmentsDoctorside";
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
    updateDoc(doctorForm:UserDocument,image:string) : Promise<Boolean>
    emailVerify(email:string): Promise<any|null>
    forgotOtpVerify(otp:string,email:string) : Promise<UserDocument|null>    
    retrieveDocData() : Promise<UserDocument[]| null>    
    savingAppoinments(email:string,user:string,Date:string,time:string,appointmentType:string):Promise<void>
    cancelBookingRepo(cancelDoctor:string): Promise<any | null>
    selectedDoctorData(doctorEmail:string): Promise<UserDocument | null>
    offlineAppoinmentsRepo(): Promise<any | null>
    appointmentAcceptedRepo(doctorEmail:string,userEmail:string): Promise<boolean| null>
    appointmentRejectedRepo(doctorEmail:string,userEmail:string): Promise<boolean| null>

}