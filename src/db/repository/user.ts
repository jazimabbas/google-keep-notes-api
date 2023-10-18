import { User } from "../entities";
import dataSource from "../index";
import { In, Repository } from "typeorm";

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

    const user = await this.repository.findOne({ where });

    return user;
  }

  async findUsers(emails: string[]): Promise<User[]> {
    const users = await this.repository.find({
      where: { email: In(emails) },
      select: ["id", "email", "name"],
    });
    return users;
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
