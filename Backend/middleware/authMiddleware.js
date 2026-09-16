import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const auth = (req, res, next) => {

    const { authorization } = req.headers;

    if (authorization && authorization.startsWith("Bearer ")) {

        const token = authorization.split(" ")[1];

        try {

            const decoded = jwt.verify(
                token,
                process.env.JWT_SECRET
            );

            req.userExist = decoded;

            next();

        } catch (err) {

            return res.status(401).json({
                message: "Invalid or expired token",
                status: false
            });

        }

    } else {

        return res.status(401).json({
            message: "Unauthorized: No token provided",
            status: false
        });

    }
};

export const optionalAuth = (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization || !authorization.startsWith("Bearer ")) {
        return next();
    }

    try {
        req.userExist = jwt.verify(
            authorization.split(" ")[1],
            process.env.JWT_SECRET
        );
    } catch {
        return res.status(401).json({
            message: "Invalid or expired token",
            status: false
        });
    }

    next();
};

export const vendorOnly = (req, res, next) => {
    if (!['admin', 'vendor'].includes(req.userExist?.role)) {
        return res.status(403).json({
            message: "Only vendors can manage recipes",
            status: false
        });
    }

    next();
};

export default auth;