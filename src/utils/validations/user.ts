import { object, string } from "yup";

const userSchema = object().shape({
  email: string().email().required().label("Email Address"),
  password: string().required().label("Password"),
  name: string().required().label("Name"),
});

const loginSchema = object().shape({
  email: string().email().required().label("Email Address"),
  password: string().required().label("Password"),
});

export { userSchema, loginSchema };
