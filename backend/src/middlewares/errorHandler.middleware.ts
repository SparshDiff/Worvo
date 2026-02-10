import { ErrorRequestHandler } from "express";
import { HTTPSTATUS } from "../config/http.config";
import { AppError } from "../utils/appError";
import { z, ZodError } from "zod";
import { Response } from "express-serve-static-core";
import { ErrorCodeEnum } from "../enums/error-code.enums";

export const errorHandler: ErrorRequestHandler = (error, req, res, next): any => {

    // SAFE LOGGING — Node will never crash here
    console.error(`\n❌Error Occurred on PATH: ${req.path}`);
    console.error("Message:", error?.message);
    console.error("Stack:", error?.stack);

    if (error instanceof ZodError) {
        return formatZodError(res,error)
    }

    if (error instanceof SyntaxError) {
        return res.status(HTTPSTATUS.BAD_REQUEST).json({
            message: "Invalid JSON format. Please check your request body.",
        });
    }

    if (error instanceof AppError) {
        return res.status(error.statusCode).json({
            message: error.message,
            errorCode: error.errorCode,
        });
    }
    return res.status(HTTPSTATUS.INTERNAL_SERVER_ERROR).json({
        message: "Internal Server Error",
        error: error?.message || "An unknown error occurred.",
    });
}

const formatZodError = (res: Response, error: z.ZodError) => {
    const errors = error?.issues?.map((err) => ({
        field: err.path.join("."),
        message: err.message,
    }));
    return res.status(HTTPSTATUS.BAD_REQUEST).json({
        message: "Validation failed",
        errors: errors,
        errorCode: ErrorCodeEnum.VALIDATION_ERROR,
    });
};

