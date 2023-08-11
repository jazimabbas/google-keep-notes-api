import UserService from "@/services/user";
import { Request, Response } from "express";
import { errorHandler } from "@/utils/errors";
import { userSchema, loginSchema } from "@/utils/validations/user";
import { validate } from "@/utils/validations";

const service = new UserService();

async function userSignup(req: Request, res: Response): Promise<Response> {
  try {
    const cleanedFields = await validate(userSchema, req.body);
    await service.Signup({ ...cleanedFields });
    return res.status(201).json({ message: "user created successfully" });
  } catch (error) {
    return errorHandler(res, error, { logKey: "UserSignup" });
  }
}

async function userLogin(req: Request, res: Response): Promise<Response> {
  try {
    const cleanedFields = await validate(loginSchema, req.body);
    const result = await service.SignIn({ ...cleanedFields });

    return res.status(200).json({ ...result });
  } catch (error) {
    return errorHandler(res, error, { logKey: "UserLogin" });
  }
}
export default { userSignup, userLogin };
