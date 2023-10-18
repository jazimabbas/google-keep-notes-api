import { Label, User } from "../entities";
import dataSource from "../index";
import { Repository, In } from "typeorm";
import UserRepository from "./user";
import { ApiError, BadRequest } from "@/utils/errors/custom-errors";

type FindLabelOption = {
  id?: string;
  name?: string;
  userId?: string;
  select?: string[];
};

type CreateLabelOptions = {
  name: string;
  user: User;
};

const userRepo = new UserRepository();

class LabelRepository {
  private repository: Repository<Label>;

  constructor() {
    this.repository = dataSource.getRepository(Label);
  }

  async getLabel(args: FindLabelOption): Promise<Label | undefined> {
    const where = {};

    if (args?.id) {
      where["id"] = args.id;
    } else if (args?.name) {
      where["name"] = args.name;
      where["user"] = { id: args.userId };
    }

    const selected = [];
    const select =
      args?.select && args.select.length > 0 && selected.concat(args.select);

    const label = await this.repository.findOne({ where, select });

    return label;
  }

  async getLabelsByIds(userId: string, names: string[]): Promise<Label[]> {
    const labels = await this.repository.find({
      where: { name: In(names), user: { id: userId } },
    });

    if (names.length === 0) {
      throw new BadRequest({ message: "labels not found" });
    }
    return labels;
  }

  async getLabelsByUserId(userId: string): Promise<Label[]> {
    const labels = await this.repository.find({
      where: { user: { id: userId } },
    });
    return labels;
  }

  async create(args: CreateLabelOptions): Promise<void> {
    const { name, user } = args;
    const isExist = await this.getLabel({ userId: user.id, name });

    if (!isExist) {
      const newLabel = await this.repository.create({ name, user });

      await this.repository.save(newLabel);
    }
  }

  async delete(id: string): Promise<void> {
    const { affected } = await this.repository.delete(id);
    if (affected === 0) {
      throw new BadRequest({ message: "label not found" });
    }
  }

  async update(id: string, name: string): Promise<void> {
    const { affected } = await this.repository.update({ id }, { name });
    console.log(affected);
    if (affected === 0) {
      throw new BadRequest({ message: "label not found" });
    }
  }
}

export default LabelRepository;
