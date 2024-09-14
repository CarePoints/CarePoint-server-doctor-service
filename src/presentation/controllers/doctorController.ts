import { NextFunction, Request, Response } from "express";
import { IdoctorUsecase } from "../../application/interface/IdoctorUsecase";

export class DoctorController {
  private doctorUsecase: IdoctorUsecase;
  constructor(doctorUsecase: IdoctorUsecase) {
    this.doctorUsecase = doctorUsecase;
  }
  async registerUser(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.body) {
        return null;
      }

      const { firstname, lastname, email, password, phonenumber, role } =
        req.body;
      const values = {
        firstname,
        lastname,
        email,
        password,
        phonenumber,
        role,
      };

      const existingUser = await this.doctorUsecase.userExists(email);

      if (existingUser) {
        const response = await this.doctorUsecase.registerUser(values);
        return res.status(200).json({ message: response });
      } else {
        const response = await this.doctorUsecase.registerUser(values);
        return res.status(200).json({ message: response });
      }
    } catch (error) {
      next(error);
    }
  }
  async otpConfirm(req: Request, res: Response, next: NextFunction) {
    try {

      let values = req.body;
      const user = await this.doctorUsecase.otpVerification(values);

      if (!user) {
        return res.status(400).json({ message: "Invalid or expired Otp " });
      }
      return res
        .status(200)
        .json({ message: "Otp Verification Successfully", user });
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const result = await this.doctorUsecase.loginVerfication(email, password);
      if (result) {
        res.status(200).json({ user: result.userDoc, token: result.token });
      } else {
        res.status(401).json({ message: "User is not exits" });
      }
    } catch (error) {
      next(error);
    }
  }

  async getUserID(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id; // This should work now

      if (!userId) {
        return res.status(404).json({ message: "User ID not found" });
      }

      // Replace with actual logic to get user
      const result = await this.doctorUsecase.getUser(userId);
      if (!result) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({ user: result });
    } catch (error) {
      next(error);
    }
  }

  async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const { oldToken } = req.body;
      const result = await this.doctorUsecase.refreshTokenUsecase(oldToken);

      if (result) {
        res.status(200).json({ user: result.userDoc, token: result.token });
      } else {
        res.status(401).json({ message: "User is not exits" });
      }
    } catch (error) {
      next(error);
    }
  }

  async doctorVerification(req: Request, res: Response, next: NextFunction) {
    try {
      let doctorForm = req.body;
      const result = await this.doctorUsecase.docVefication(doctorForm);
      if (!result) {
        return res.status(400).json({ message: "Verification failed" });
      }
      res
        .status(200)
        .json({ message: "Verification successful", data: result });
    } catch (error) {
      next(error);
    }
  }

  async getDocData(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ message: "User Not found" });
      }
      const result = await this.doctorUsecase.getDoc(email);
      return res.status(200).json({ result });
    } catch (error) {
      next(error);
    }
  }

  async updateDocData(req: Request, res: Response, next: NextFunction) {
    try {
      let {formData,selectedFile} = req.body;
      console.log('doctorData',formData);
      console.log('selectedFilezvsZvzsdfaw',selectedFile);
      
      const result = await this.doctorUsecase.updateDoctor(formData,selectedFile);
      if (!result) {
        return res.status(400).json({ message: "User Not found" });
      }
      return res.status(200).json({ message: "Data Updated successfully" });
    } catch (error) {
      next(error);
    }
  }

  async checkEmail(req: Request, res: Response, next: NextFunction) {
    try {
      let { email } = req.body.email;
      const result = await this.doctorUsecase.emailVerification(email);
      if (!result) {
        return res.status(400).json({ message: "User not found" });
      }

       await this.doctorUsecase.registerUser(result);
      return res.status(200).json({ message: "Otp send successfully" });
    } catch (error) {
      next(error);
    }
  }

  async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { otp, email } = req.body;
      const user = await this.doctorUsecase.forgotOtp(otp, email);
      if (!user) {
        console.log("Otp is not correct",user);
        
        return res.status(400).json({ message: "Otp is not correct" });
      }
      return res.status(200).json({ message: "Otp is correct" });
    } catch (error) {
      next(error);
    }
  }
  async resetPassword(req: Request, res: Response) {
    console.log("doctor server iser", req.body);
  }

  async getDoctorData(req: Request, res: Response){
    const result = await this.doctorUsecase.retrieveAllDocData();
    if(!result){
      res.status(400).json({message: 'Doctor does not exits'})
    }
    res.status(200).json({data: result})
  }

  async cancelBooking(req:Request, res:Response){
    try{
      // let result = await this.userUsecase.findBookedDoctors()
      console.log('it woring mahm',req.body);
      const {cancelDoctor} = req.body;
      let result = await this.doctorUsecase.cancelBooking(cancelDoctor)
    
      return res.status(200).json({message:'succees', result})
    }catch(error){
      console.log('error is',error);
    }
  }

  async selectedDoctorForMapTracking(req:Request, res:Response){
    try{
      // let result = await this.userUsecase.findBookedDoctors()
      console.log('sdfdsf',req.body);
      const {doctorEmail} = req.body;
      let result = await this.doctorUsecase.selectedDoctor(doctorEmail)
    
      return res.status(200).json({message:'succees', result})
    }catch(error){
      console.log('error is',error);
    }
  }

  async offlineAppoinments(req:Request, res:Response){
    try{
      // let result = await this.userUsecase.findBookedDoctors()
      console.log('offlineAppoinments controller is working')
      let result = await this.doctorUsecase.offlineAppoinments()      
    
      return res.status(200).json({message:'succees', result})
    }catch(error){
      console.log('error is',error);
    }
  }
  async appointmentAccepted(req: Request, res: Response) {
    try {
      console.log('Request body:', req.body);
      const { doctorEmail,userEmail } = req.body;
  
      if (!doctorEmail) {
        return res.status(400).json({ message: 'doctorEmail is missing' });
      }
      if (!userEmail) {
        return res.status(400).json({ message: 'userId is missing' });
      }
  
      const result = await this.doctorUsecase.appointmentAccepted(doctorEmail,userEmail);
  
      return res.status(200).json({ message: 'Success', result });
    } catch (error) {
      console.log('Error:', error);
      return res.status(500).json({ message: 'An error occurred', error });
    }
  }
  async appointmentRejected(req: Request, res: Response) {
    try {
      console.log('Request body:', req.body);
      const { doctorEmail,userEmail } = req.body;
  
      if (!doctorEmail) {
        return res.status(400).json({ message: 'doctorEmail is missing' });
      }
      if (!userEmail) {
        return res.status(400).json({ message: 'userId is missing' });
      }
  
      const result = await this.doctorUsecase.appointmentRejected(doctorEmail,userEmail);
  
      return res.status(200).json({ message: 'Success', result });
    } catch (error) {
      console.log('Error:', error);
      return res.status(500).json({ message: 'An error occurred', error });
    }
  }
}
