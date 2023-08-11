import { User } from "../entities";
import dataSource from "../index";
import { Repository } from "typeorm";
import { AppError } from "@/utils/errors/custom-errors";

interface FindUserOptions {
  id?: string;
  email?: string;
}

interface UserArgs {
  email: string;
  name: string;
  password: string;
}

class UserRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = dataSource.getRepository(User);
  }

  async findUser({ id, email }: FindUserOptions): Promise<User | undefined> {
    let where = {};
    if (id) where["id"] = id;
    if (email) where["email"] = email;

    const user = await this.repository.findOneBy(where);

    return user;
  }

  async createUser({ email, password, name }: UserArgs): Promise<void> {
    const user = new User();
    user.email = email;
    user.name = name;
    user.password = password;
    await this.repository.save(user);
  }
}

export default UserRepository;
