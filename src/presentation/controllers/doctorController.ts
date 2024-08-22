import { NextFunction, Request, Response } from "express";
import { IdoctorUsecase } from "../../application/interface/IdoctorUsecase";

export class DoctorController {
  private doctorUsecase: IdoctorUsecase;
  constructor(doctorUsecase: IdoctorUsecase) {
    this.doctorUsecase = doctorUsecase;
  }
  async registerUser(req: Request, res: Response, next: NextFunction) {

    if (!req.body) {
      return null;
    }

    const { firstname, lastname, email, password, phonenumber, role } =
      req.body;
    const values = { firstname, lastname, email, password, phonenumber, role };
    console.log("values.email", email);

    const existingUser = await this.doctorUsecase.userExists(email);

    if (existingUser) {
      console.log("existesing ");
      const response = await this.doctorUsecase.registerUser(values);
      return res.status(200).json({ message: response });
    } else {
      const response = await this.doctorUsecase.registerUser(values);
      console.log("responsedkfjkfbhfkjgbhfjk", response);

      return res.status(200).json({ message: response });
    }
  }
  async otpConfirm(req: Request, res: Response, next: NextFunction) {
    console.log("Otp Controller working");

    let values = req.body;
    const user = await this.doctorUsecase.otpVerification(values);
    
    if (!user) {
      return res.status(400).json({ message: "Invalid or expired Otp " });
    }
    return res
      .status(200)
      .json({ message: "Otp Verification Successfully", user });
  }

  async login(req: Request, res: Response, next: NextFunction) {
    console.log("login is working");
    const { email, password } = req.body;
    const result = await this.doctorUsecase.loginVerfication(email, password);
    console.log("user datas are", result);
    if (result) {
      res.status(200).json({ user: result.userDoc, token: result.token });
    } else {
      res.status(401).json({ message: "User is not exits" });
    }
  }

  async getUserID(req: Request, res: Response, next: NextFunction) {
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
  }

  async refreshToken(req: Request, res: Response, next: NextFunction) {
    console.log("login is working");
    const { oldToken } = req.body;
    const result = await this.doctorUsecase.refreshTokenUsecase(oldToken);

    if (result) {
      console.log("refresh token is workkingggggggggggg", result);

      res.status(200).json({ user: result.userDoc, token: result.token });
    } else {
      res.status(401).json({ message: "User is not exits" });
    }
  }

  async doctorVerification(req: Request, res: Response, next: NextFunction) {
    let doctorForm = req.body;
    const result = await this.doctorUsecase.docVefication(doctorForm);
    if (!result) {
      return res.status(400).json({ message: "Verification failed" });
    }
    res.status(200).json({ message: "Verification successful", data: result });
  }

  async getDocData(req: Request, res: Response, next: NextFunction) {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "User Not found" });
    }
    const result = await this.doctorUsecase.getDoc(email);
    return res.status(200).json({ result });
  }

  async updateDocData(req: Request, res: Response, next: NextFunction) {
    // const result = await
    console.log("doctor data is", req.body);
    let doctorData = req.body;
    const result = await this.doctorUsecase.updateDoctor(doctorData);
    console.log("result", result);
    if (!result) {
      return res.status(400).json({ message: "User Not found" });
    }
    return res.status(200).json({ message: "Data Updated successfully" });
  }

  async checkEmail(req: Request, res: Response, next: NextFunction) {
    let { email } = req.body.email;
    console.log("eemail isssssssssss", email);
    const result = await this.doctorUsecase.emailVerification(email);
    console.log("ree", result);

    if (!result) {
      return res.status(400).json({ message: "User not found" });
    }

    const response = await this.doctorUsecase.registerUser(result);
    console.log("response", response);
    return res.status(200).json({ message: "Otp send successfully" });
  }

  async forgotPassword(req: Request, res: Response, next: NextFunction) {
    console.log("eeeee", req.body);
    const { otp, email } = req.body;
    const user = await this.doctorUsecase.forgotOtp(otp, email);
    console.log("user", user);
    if (!user) {
      return res.status(400).json({ message: "Otp is not correct" });
    }
    return res.status(200).json({ message: "Otp is correct" });
  }
  async resetPassword(req: Request, res: Response) {
    console.log("doctor server iser", req.body);
  }

}
