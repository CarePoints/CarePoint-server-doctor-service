import { registerUser } from "../../domain/entities/signUpUser";
import { DoctorForm, IDoctorRepository } from "../interface/IDoctorRepository";
import { hashPassword } from "../../utils/passwordUtils";
import {
  generateRefreshToken,
  generateToken,
  verifyToken,
} from "../../utils/authUtlis";
import { User, UserDocument } from "../database/model/userModel";
import bcrypt from "bcryptjs";
import { AppError } from "../../middleware/errorMiddleware";
import DoctorAppointment from "../database/model/appoinmentsDoctorside";

export class DoctorRepository implements IDoctorRepository {
  async findUserExists(email: string) {
    try {
      const user = await User.findOne({ email });
      return user;
    } catch (error) {
      throw new AppError("Database error occurred while creating user.", 500);
    }
  }
  async saveNewUser(values: registerUser) {
    try {
      const {
        firstname,
        lastname,
        email,
        password,
        phonenumber,
        otp,
        createdAt,
      } = values;

      let hashedPass;

      let existingUser = await User.findOne({ email });
      if (existingUser) {
        if (firstname && lastname && password && phonenumber) {
          hashedPass = await hashPassword(password);
          const stringMobile = phonenumber.toString();
          existingUser.firstname = firstname;
          existingUser.lastname = lastname;
          existingUser.password = hashedPass;
          existingUser.phonenumber = stringMobile;
        }
        existingUser.otp = otp;
        existingUser.createdAt = createdAt;

        await existingUser.save();
        return existingUser;
      } else {
        hashedPass = await hashPassword(password);
        const newUser = new User({
          firstname,
          lastname,
          email,
          password: hashedPass,
          phonenumber,
          isVerified: false,
          otp,
          createdAt,
        });

        await newUser.save();
        return newUser;
      }
    } catch (error) {
      throw new AppError("Database error occurred while creating user.", 500);
    }
  }

  async otpVerify(otp: any) {
    try {
      const otpObject = otp;
      const otpString = otpObject.otp;
      let otpNumber = parseInt(otpString, 10);
      const user = await User.findOne({ otp: otpNumber });

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
        await user.save();
        console.log("final user is", user);

        return user ? user : null;
      } else {
        return null;
      }
    } catch (error) {
      throw new AppError("Database error occurred while creating user.", 500);
    }
  }

  async userLogin(email: string, password: string) {
    try {
      const userDoc = await User.findOne({ email });

      if (!userDoc) {
        return null;
      }
      if (!userDoc.password) {
        return null;
      }
      let hashedPass = userDoc.password;
      const isMatch = await bcrypt.compare(password, hashedPass);

      if (!isMatch) {
        return null;
      }

      const user = {
        _id: userDoc._id,
        email: userDoc.email,
        roles: userDoc.roles,
      };
      const token = generateToken(user);
      return { token, userDoc };
    } catch (err) {
      throw new AppError("Database error occurred while creating user.", 500);
    }
  }

  async getUserById(doctorId: string) {
    try {
      const user = await User.findById(doctorId);
      if (!user) {
        return null;
      }
      return user;
    } catch (error) {
      throw new AppError("Database error occurred while creating user.", 500);
    }
  }
  async refreashToken(oldToken: string) {
    try {
      const decodedToken = verifyToken(oldToken);
      if (typeof decodedToken !== "string" && decodedToken.id) {
        const existingUser = await User.findById(decodedToken.id);
        if (!existingUser) {
          throw new Error("user not found");
        }
        const newToken = generateRefreshToken(existingUser);
        return newToken;
      } else {
        throw new Error("Invalid token payload");
      }
    } catch (error) {
      throw new AppError("Database error occurred while creating user.", 500);
    }
  }

  async verification(doctorForm: DoctorForm) {
    try {
      // Destructure formValues and email from doctorForm
      const { formValues, email } = doctorForm;

      // Destructure formValues
      const {
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
      } = formValues;

      // Find the doctor by email
      const doctor = await User.findOne({ email });
      if (doctor) {
        // Update the doctor with new information
        let doctorVerified = await User.findOneAndUpdate(
          { email },
          {
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
          }
        );
        return doctorVerified;
      }

      return null;
    } catch (error) {
      throw new AppError("Database error occurred while creating user.", 500);
    }
  }

  async getDocData(email: string) {
    try {
      if (!email) {
        return null;
      }
      const response = await User.findOne({ email });
      if (!response) {
        return null;
      }
      return response;
    } catch (error) {
      throw new AppError("Database error occurred while creating user.", 500);
    }
  }

  async updateDoc(doctorForm: UserDocument, image: string) {
    try {
      if (image) {
        doctorForm.profilePic = image;
      }
      console.log("doctorform is", doctorForm);

      const email = doctorForm.email;
      if (!email) {
        return false;
      }
      const doctorData = await User.findOne({ email });
      if (!doctorData) {
        return false;
      }
      const response = await User.updateOne({ email }, { $set: doctorForm });
      return true;
    } catch (error) {
      throw new AppError("Database error occurred while creating user.", 500);
    }
  }

  async emailVerify(email: string) {
    try {
      const user = await User.findOne({ email });
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
    } catch (error) {
      throw new AppError("Database error occurred while creating user.", 500);
    }
  }

  async forgotOtpVerify(otp: string, email: string) {
    try {
      const user = await User.findOne({ email });
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
    } catch (error) {
      throw new AppError("Database error occurred while creating user.", 500);
    }
  }

  async isBlockDb(email: string, isBlocked: boolean) {
    try {
      const user = await User.findOne({ email });

      if (!user) {
        return null;
      }

      user.isBlocked = isBlocked;
      await user.save();

      return user;
    } catch (error) {
      throw new AppError("Database error occurred while creating user.", 500);
    }
  }

  async retrieveDocData() {
    const doctorData = await User.find();
    if (!doctorData) {
      return null;
    }
    return doctorData;
  }

  async savingAppoinments(
    email: string,
    user: any,
    date: string,
    time: string,
    appointmentType: string
  ) {
    try {
      const doctor = await User.findOne({ email });
      console.log("appoinmented doctor is", doctor);
      const userData = user;
      console.log('the user is ',user)

      const newAppointment = new DoctorAppointment({
        doctorId: doctor?._id,
        user: {
          firstname: userData.firstname,
          lastname: userData.lastname,
          email: userData.email,
          phoneNumber: userData.phonenumber,
          profilePic: userData?.profilePic,
        },
        date: new Date(date),
        time,
        status: "pending",
        appointmentType: appointmentType,
      });

      const savedAppointment = await newAppointment.save();
      console.log("Appointment saved:", savedAppointment);
    } catch (error) {
      console.log(error);
    }
  }
  async cancelBookingRepo(cancelDoctorEmail: string) {
    try {
      console.log("Attempting to delete appointment for:", cancelDoctorEmail);

      // Step 1: Find the doctor by email
      const doctor = await User.findOne({ email: cancelDoctorEmail }).exec();

      if (!doctor) {
        console.log("No doctor found with this email.");
        return null;
      }

      // Step 2: Delete the appointment by doctor ID
      const result = await DoctorAppointment.findOneAndDelete({
        doctorId: doctor._id,
      }).exec();

      if (result) {
        console.log("Appointment found and deleted:", result);
      } else {
        console.log("No appointment found for this doctor.");
        return null;
      }

      return result;
    } catch (error) {
      console.error("Error finding or deleting appointment:", error);
      throw new Error("Error finding or deleting appointment.");
    }
  }
  async selectedDoctorData(doctorEmail: string) {
    try {
      console.log("Attempting to fetch doctorData for:", doctorEmail);

      // Step 1: Find the doctor by email
      const doctor = await User.findOne({ email: doctorEmail }).exec();

      if (!doctor) {
        console.log("No doctor found with this email.");
        return null;
      }

      return doctor;
      // return result;
    } catch (error) {
      console.error("Error finding or deleting appointment:", error);
      throw new Error("Error finding or deleting appointment.");
    }
  }
  async offlineAppoinmentsRepo() {
    try {

      // Step 1: Find the doctor by email
      const offlineAppoinments = await DoctorAppointment.find();
      
      if (!offlineAppoinments) {
        console.log("No doctor found with this email.");
        return null;
      }
      console.log('offlineAppoinments is',offlineAppoinments)

      return offlineAppoinments;
      // return result;
    } catch (error) {
      console.error("Error finding or deleting appointment:", error);
      throw new Error("Error finding or deleting appointment.");
    }
  }

  async appointmentAcceptedRepo(doctorEmail: string, userEmail: string) {
    try {
      // Fetch the appointment that matches both doctor email and userId
      const doctorData = await User.findOne({email:doctorEmail})
      if(!doctorData){
        return null
      }
      let result = await DoctorAppointment.findOne({
        'user.email': userEmail,
        doctorId: doctorData._id
      });
  
      console.log('Result:', result);
  
      // If no result is found, return false
      if (!result) {
        console.log('No appointment found matching the criteria.');
        return false;
      }
  
      // Update the status to 'confirmed'
      result.status = 'confirmed';
      await result.save();
  
      return true;
    } catch (error) {
      console.error('Error finding appointment:', error);
      throw new Error('Error finding appointment.');
    }
  }

  async appointmentRejectedRepo(doctorEmail: string, userEmail: string) {
    try {
      // Fetch the appointment that matches both doctor email and userId
      const doctorData = await User.findOne({email:doctorEmail})
      if(!doctorData){
        return null
      }
      let result = await DoctorAppointment.findOne({
        'user.email': userEmail,
        doctorId: doctorData._id
      });
  
      console.log('Result:', result);
  
      // If no result is found, return false
      if (!result) {
        console.log('No appointment found matching the criteria.');
        return false;
      }
  
      // Update the status to 'confirmed'
      result.status = 'canceled';
      await result.save();
  
      return true;
    } catch (error) {
      console.error('Error finding appointment:', error);
      throw new Error('Error finding appointment.');
    }
  }
}
