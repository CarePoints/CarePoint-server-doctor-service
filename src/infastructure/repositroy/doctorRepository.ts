import { registerUser } from "../../domain/entities/signUpUser";
import { DoctorForm, IDoctorRepository } from "../interface/IDoctorRepository";
import { hashPassword } from "../../utils/passwordUtils";
import {
  generateRefreshToken,
  generateToken,
  verifyToken,
} from "../../utils/authUtlis";
import { User, UserDocument } from "../database/model/userModel";
import bcrypt from "bcrypt";

export class DoctorRepository implements IDoctorRepository {
  async findUserExists(email: string) {
    const user = await User.findOne({ email });
    return user;
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

      console.log("Received values:", values); // Inspect the values
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
        console.log("Updated existing user with new details:", existingUser);
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

        console.log("Created new user:", newUser);
        await newUser.save();
        return newUser;
      }
    } catch (error) {
      console.error("Error saving user:", error);
      return null;
    }
  }

  async otpVerify(otp: any) {
    const otpObject = otp;
    const otpString = otpObject.otp;
    let otpNumber = parseInt(otpString, 10);
    console.log("Otp repositroy working", otpNumber);
    const user = await User.findOne({ otp: otpNumber });
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
      await user.save();
      console.log("final user is", user);

      return user ? user : null;
    } else {
      return null;
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
      console.log(err);
    }
    return null;
  }

  async getUserById(userId: string) {
    const user = await User.findById(userId);
    if (!user) {
      return null;
    }
    return user;
  }
  async refreashToken(oldToken: string) {
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

      console.log("Form Values:", formValues);
      console.log("Email:", email);

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
      console.error("Error in verification:", error);
      return null;
    }
  }

  async getDocData(email: string) {
    if (!email) {
      return null;
    }
    const response = await User.findOne({ email });
    if (!response) {
      return null;
    }
    return response;
  }

  async updateDoc(doctorForm: UserDocument) {
    console.log("form value are", doctorForm);
    const email = doctorForm.email;
    if (!email) {
      return false;
    }
    const doctorData = await User.findOne({ email });
    if (!doctorData) {
      return false;
    }
    const response = await User.updateOne({ email }, { $set: doctorForm });
    console.log("Update successful", response);
    return true;
  }

  async emailVerify(email: string) {
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
  }

  async forgotOtpVerify(otp: string, email: string) {
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
  }


    async isBlockDb(email: string, isBlocked: boolean) {
    const user = await User.findOne({ email });
    console.log("sucess ", isBlocked);

    if (!user) {
      return null;
    }
    console.log('kkkkkkkkkkkkkkkkkkkkkkk');
    
    user.isBlocked = isBlocked;
    await user.save();
    console.log("last", user);

    return user;
  }

}
