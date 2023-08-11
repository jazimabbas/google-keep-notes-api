import UserRepository from "@/db/repository/user";
import { BadRequest } from "@/utils/errors/custom-errors";
import { createHashPassword, comparePassword, generateToken } from "@/utils";
import { User } from "@/db/entities";

interface SignupArgs {
  email: string;
  password: string;
  name: string;
}
interface SignInArgs {
  email: string;
  password: string;
}

interface SignInResponse {
  id: string;
  email: string;
  name: string;
}

class UserService {
  private repository: UserRepository;

  constructor() {
    this.repository = new UserRepository();
  }

  async Signup({ email, password, name }: SignupArgs): Promise<void> {
    const isUser = await this.repository.findUser({ email });
    if (isUser) {
      throw new BadRequest({
        message: "this email is already registered",
        statusCode: 400,
      });
    }

    const hash = await createHashPassword(password);

    await this.repository.createUser({ email, password: hash, name });
  }

  async SignIn({
    email,
    password,
  }: SignInArgs): Promise<{ user: SignInResponse; token: string }> {
    const user = await this.repository.findUser({ email });

    if (!user) {
      throw new BadRequest({ message: "email or password is incorrect" });
    }

    const isMatch = await comparePassword({
      password,
      userPassword: user.password,
    });

    if (!isMatch) {
      throw new BadRequest({ message: "email or password is incorrect" });
    }

    const token = await generateToken(user);

    return { user: { id: user.id, email: user.email, name: user.name }, token };
  }
}

export default UserService;
