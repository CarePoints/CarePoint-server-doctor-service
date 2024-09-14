import { IdoctorUsecase } from "../interface/IdoctorUsecase";
import { IDoctorRepository } from "../../infastructure/interface/IDoctorRepository";
import { registerUser } from "../../domain/entities/signUpUser";
import { generateOtpWithTime } from "../../utils/generateOtp";
import otpSending from "../../utils/otpSending";
import { UserDocument } from "../../infastructure/database/model/userModel";
import { publishMessage } from "../../infastructure/rabbitmq/producer";

export class DoctorUseCase implements IdoctorUsecase {
  private repository: IDoctorRepository;
  constructor(repository: IDoctorRepository) {
    this.repository = repository;
  }
  async userExists(email: string) {
    const user = await this.repository.findUserExists(email);

    return user ? user : null;
  }
  async registerUser(values: registerUser) {
    const { otp, creationTime } = generateOtpWithTime();
    values.otp = otp;
    values.createdAt = creationTime;
    if (!values.firstname) {
      const user = await this.repository.saveNewUser(values);
    }
    const user = await this.repository.saveNewUser(values);

    otpSending(values.email, otp);
    return user ? user : null;
  }
  async otpVerification(otp: string) {
    const userData = await this.repository.otpVerify(otp);
    publishMessage(userData);

    return userData ? userData : null;
  }
  async loginVerfication(email: string, password: string) {
    const checkUser = await this.repository.userLogin(email, password);
    if (!checkUser) {
      return null;
    }
    return checkUser;
  }

  async getUser(userId: string) {
    const userData = await this.repository.getUserById(userId);
    if (!userData) {
      return null;
    }
    return userData;
  }

  async refreshTokenUsecase(oldToken: string) {
    if (!oldToken) {
      return null;
    }
    const checkToken = await this.repository.refreashToken(oldToken);
    if (!checkToken) {
      return null;
    } else {
      return checkToken;
    }
  }

  async docVefication(userForm: any) {
    publishMessage(userForm);

    const result = await this.repository.verification(userForm);
    if (!result) {
      return null;
    }
    console.log("result is ", result);
    return result;
  }

  async getDoc(email: string) {
    const doctorData = await this.repository.getDocData(email);
    if (!doctorData) {
      return null;
    }
    return doctorData;
  }

  async updateDoctor(doctorForm: UserDocument,image:string) {
    console.log('inmages is',image);
    
    const result = await this.repository.updateDoc(doctorForm,image);
    if (!result) {
      return null;
    }
    return result;
  }

  async emailVerification(email: string) {
    const user = await this.repository.emailVerify(email);
    if (!user) {
      return null;
    }
    return user;
  }

  async forgotOtp(otp: string, email: string) {
    console.log("otp", otp, "email", email);
    const checking = await this.repository.forgotOtpVerify(otp, email);
    console.log("user issss", checking);
    if (checking) {
      return checking;
    }

    return null;
  }

  async retrieveAllDocData(){
    const result = await this.repository.retrieveDocData()
    return result
  }
  async cancelBooking(cancelDoctor:string){
    const result = await this.repository.cancelBookingRepo(cancelDoctor)
    if(!result){
      return null
    }
    return result
  }
  async selectedDoctor(doctorEmail:string){
    const result = await this.repository.selectedDoctorData(doctorEmail)
    if(!result){
      return null
    }
    return result
  }
  async offlineAppoinments(){
    const result = await this.repository.offlineAppoinmentsRepo()
    if(!result){
      return null
    }
    return result
  }
    async appointmentAccepted(doctorEmail:string,userEmail:string){
    const result = await this.repository.appointmentAcceptedRepo(doctorEmail,userEmail)
    if(!result){
      return false
    }
    return true
  }
    async appointmentRejected(doctorEmail:string,userEmail:string){
    const result = await this.repository.appointmentRejectedRepo(doctorEmail,userEmail)
    if(!result){
      return false
    }
    return true
  }
}
