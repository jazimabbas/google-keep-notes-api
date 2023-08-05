import { Response } from "express";
import { AppError, STATUS_CODE } from "./custom-errors";

type options = {
  logKey: string;
  message: string;
};

export async function errorHandler(
  response: Response,
  error: any,
  options: options = { logKey: "", message: "" }
) {
  const { logKey, message } = options;

  let errorMessage = "internal server error";
  let statusCode = STATUS_CODE.INTERNAL_ERROR;
  if (error instanceof AppError) {
    errorMessage = error.message;
    statusCode = error.statusCode;
  } else if (message) {
    errorMessage = "internal server error";
  }

  if (logKey) {
    console.log(`Error (${logKey}): ${error}`);
  }
  return response.status(statusCode).json({
    errorMessage,
  });
}
