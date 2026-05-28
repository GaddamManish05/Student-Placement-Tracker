import User from "../Models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { tokenCookieOptions } from "../config/CookieOptions.js";
import { transporter } from "../config/Nodemailer.js";


// REGISTER
export const register = async (
    req,
    res
) => {

    try {
        const {
            name,
            email,
            password,
            branch,
            cgpa,
            rollNumber
        } = req.body;
        console.log("from register :",req.body)

        const existingUser =
        await User.findOne({ email });

        if(existingUser){

            return res.status(400).json({
                message: "User already exists"
            });

        }


        const hashedPassword =
        await bcrypt.hash(password, 10);


        const user = await User.create({

            name,

            email,

            password: hashedPassword,

            branch,

            cgpa,

            rollNumber

        });
        console.log("EMAIL_USER:", process.env.EMAIL_USER);
        console.log("EMAIL_PASS:", process.env.EMAIL_PASS);
        (async () => {

    try {

        await transporter.sendMail({

            from: process.env.EMAIL_USER,

            to: user.email,

            subject: "Welcome to Smart Placement Tracker 🎉",

            html: `

            <div
                style="
                    background:#f4f7fb;
                    padding:40px 20px;
                    font-family:Arial,sans-serif;
                "
            >

                <div
                    style="
                        max-width:600px;
                        margin:auto;
                        background:white;
                        border-radius:18px;
                        overflow:hidden;
                        box-shadow:0 10px 30px rgba(0,0,0,0.08);
                    "
                >

                    <div
                        style="
                            background:linear-gradient(135deg,#0071e3,#2563eb);
                            padding:35px;
                            text-align:center;
                            color:white;
                        "
                    >

                        <h1
                            style="
                                margin:0;
                                font-size:30px;
                            "
                        >

                            Welcome 🎉

                        </h1>

                        <p
                            style="
                                margin-top:10px;
                                opacity:0.9;
                            "
                        >

                            Smart Placement Tracker

                        </p>

                    </div>

                    <div
                        style="
                            padding:40px;
                            color:#333;
                        "
                    >

                        <h2>

                            Hello ${user.name},

                        </h2>

                        <p
                            style="
                                line-height:1.8;
                                color:#4b5563;
                            "
                        >

                            Your account has been created successfully.

                        </p>

                        <div
                            style="
                                background:#eff6ff;
                                border:1px solid #bfdbfe;
                                padding:20px;
                                border-radius:12px;
                                margin-top:25px;
                            "
                        >

                            <p>

                                <strong>Email:</strong>

                                ${user.email}

                            </p>

                            <p>

                                <strong>Branch:</strong>

                                ${user.branch}

                            </p>

                            <p>

                                <strong>CGPA:</strong>

                                ${user.cgpa}

                            </p>

                        </div>

                        <p
                            style="
                                margin-top:30px;
                                line-height:1.8;
                                color:#4b5563;
                            "
                        >

                            You can now apply for placement drives,
                            track interview rounds,
                            and manage your profile 🚀

                        </p>

                    </div>

                    <div
                        style="
                            background:#f9fafb;
                            padding:20px;
                            text-align:center;
                            color:#9ca3af;
                            font-size:13px;
                            border-top:1px solid #e5e7eb;
                        "
                    >

                        Smart Placement Tracker © 2026

                    </div>

                </div>

            </div>

            `
        });

        console.log(
            "REGISTRATION MAIL SENT"
        );

    } catch(err) {

        console.log(
            "MAIL ERROR:",
            err.message
        );

    }

})();


        return res.status(201).json({

            success: true,

            message: "Registration Successful",

            payload: user

        });

    } catch (error) {

        return res.status(500).json({

            message: error.message

        });

    }

};





// LOGIN
export const login = async (
  req,
  res
) => {
  try {
    const {
      email,
      password
    } = req.body;


    // ==================================
    // FIND USER
    // ==================================
    const user =
    await User.findOne({
      email,
    }).select("+password");

    if (!user) {

      return res.status(400).json({

        success: false,

        message:
        "Invalid Credentials",
      });
    }

    // ==================================
    // CHECK PASSWORD
    // ==================================
    const isMatch =
    await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {

      return res.status(400).json({

        success: false,

        message:
        "Invalid Credentials",
      });
    }

    // ==================================
    // CHECK ACTIVE STATUS
    // ==================================
    if (!user.isActive) {

      return res.status(403).json({

        success: false,

        message:
        "Account has been deactivated by admin",
      });
    }

    // ==================================
    // TOKEN
    // ==================================
    const token =
    jwt.sign(

      {
        id: user._id,
      },

      process.env.JWT_SECRET,

      {
        expiresIn: "7d",
      }
    );

    // ==================================
    // SAVE COOKIE
    // ==================================
    res.cookie(
      "token",
      token,
      tokenCookieOptions
    );

    // ==================================
    // RESPONSE
    // ==================================
    return res.status(200).json({

      success: true,

      message:
      "Login Successful",

      payload: user,
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({

      success: false,

      message:
      error.message,
    });
  }
};




// LOGOUT
export const logout = async (
    req,
    res
) => {

    try {

        res.clearCookie(
            "token",
            tokenCookieOptions
        );


        return res.status(200).json({

            message: "Logout Successful"

        });

    } catch (error) {

        return res.status(500).json({

            message: error.message

        });

    }

};

export const currentUser = async (
    req,
    res
) => {

    try {

        return res.status(200).json({

            payload: req.user

        });

    } catch (error) {

        return res.status(500).json({

            message: error.message

        });

    }

};

export const updateProfile = async (
    req,
    res
) => {

    try {

        const user =
        await User.findById(req.user._id);

        if(!user){

            return res.status(404).json({

                message: "User not found"

            });

        }

        const {

            name,
            branch,
            cgpa,
            rollNumber,
            skills,
            linkedIn,
            gitHub,
            portfolio

        } = req.body;

        // ======================
        // UPDATE FIELDS
        // ======================

        if(name){
            user.name = name;
        }

        if(branch){
            user.branch = branch;
        }

        if(cgpa !== undefined){
            user.cgpa = cgpa;
        }

        if(rollNumber){
            user.rollNumber = rollNumber;
        }

        if(skills){
            user.skills = skills;
        }

        if(linkedIn !== undefined){
            user.linkedIn = linkedIn;
        }

        if(gitHub !== undefined){
            user.gitHub = gitHub;
        }

        if(portfolio !== undefined){
            user.portfolio = portfolio;
        }

        // ======================
        // SAVE USER
        // ======================

        await user.save();

        return res.status(200).json({

            success: true,

            message:
            "Profile updated successfully",

            payload: user

        });

    } catch (error) {

        return res.status(500).json({

            message: error.message

        });

    }

};

export const uploadResume =
async (
  req,
  res
) => {

  try {

    const user =
    await User.findById(
      req.user._id
    );

    if (!user) {

      return res.status(404).json({

        message:
          "User not found",
      });
    }

    user.resume = req.file.path.replace(

  "/image/upload/",

  "/raw/upload/"
);

    await user.save();

    return res.status(200).json({

      success: true,

      message:
        "Resume uploaded successfully",

      payload: user,
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({

      message:
        error.message,
    });
  }
};