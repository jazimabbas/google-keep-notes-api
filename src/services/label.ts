import * as repository from "@/db/repository";
import { ApiError } from "@/utils/errors/custom-errors";
import { Label } from "@/db/entities";

export class LabelService {
  private labelRepository: repository.LabelRepository;
  private userRepository: repository.UserRepository;

  constructor() {
    this.labelRepository = new repository.LabelRepository();
    this.userRepository = new repository.UserRepository();
  }

  async createLabel(userId: string, name: string): Promise<void> {
    const user = await this.userRepository.findUser({ id: userId });

    if (!user) throw new ApiError({ message: "user not exist" });

    await this.labelRepository.create({ name, user });
  }

  async deleteLabel(id: string): Promise<void> {
    await this.labelRepository.delete(id);
  }

  async editLabel(id: string, name: string): Promise<void> {
    await this.labelRepository.update(id, name);
  }

  async getUserLabels(userId: string): Promise<Label[]> {
    const labels = await this.labelRepository.getLabelsByUserId(userId);
    return labels;
  }
}
