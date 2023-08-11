import bcrypt from "bcryptjs";
import { ApiError } from "./errors/custom-errors";
import jwt from "jsonwebtoken";
import { appEnvVars } from "@/utils/env-vars";
import { User } from "@/db/entities";

export const createHashPassword = async (password: string): Promise<string> => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  } catch (error) {
    throw new ApiError({
      message: "something bad happened",
      statusCode: 500,
    });
  }
};

type comparePasswordArgs = {
  userPassword: string;
  password: string;
};
export const comparePassword = async ({
  userPassword,
  password,
}: comparePasswordArgs): Promise<boolean> => {
  try {
    const isMatch = await bcrypt.compare(password, userPassword);
    return isMatch;
  } catch (error) {
    throw new ApiError({
      message: "something bad happened",
      statusCode: 500,
    });
  }
};

export const generateToken = async (user: User): Promise<string> => {
  try {
    const payload = { id: user.id, email: user.email, name: user.name };
    const token = jwt.sign(payload, appEnvVars.jwtSecret, { expiresIn: "23h" });

    return token;
  } catch (error) {
    console.log(error);
    throw new ApiError({
      message: "something bad happened",
      statusCode: 500,
    });
  }
};
