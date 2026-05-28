import jwt from "jsonwebtoken";

import User from "../Models/userModel.js";



export const isAuthenticated = async (
    req,
    res,
    next
) => {

    try {

        const token =
        req.cookies.token;


        if(!token){

            return res.status(401).json({

                message: "Login First"

            });

        }


        const decoded = jwt.verify(

            token,

            process.env.JWT_SECRET

        );


        const user = await User.findById(decoded.id);

        if(!user){

            return res.status(404).json({

                message: "User not found"

            });

        }
        if (!user.isActive) {
            return res.status(403).json({
            success: false,
            message:
            "Account has been deactivated",
        });
}

        req.user = user;

        next();

    } catch (error) {

        if (
            error.name === "JsonWebTokenError" ||
            error.name === "TokenExpiredError"
        ) {
            return res.status(401).json({
                message: "Unauthorized: Invalid or expired token"
            });
        }

        return res.status(500).json({

            message: error.message

        });

    }

};