import { Reminder, UserNote } from "../entities";
import { Repository } from "typeorm";
import dataSource from "../index";
import { BadRequest } from "@/utils/errors/custom-errors";

type CreateReminderOptions = {
  id: string;
  dateTime: Date;
  occurrence: number;
  userNote: UserNote;
};

type UpdateReminderOptions = {
  dateTime?: Date;
  occurrence?: number;
  id: string;
};

export default class ReminderRepository {
  private repository: Repository<Reminder>;

  constructor() {
    this.repository = dataSource.getRepository(Reminder);
  }

  async create(args: CreateReminderOptions): Promise<void> {
    const reminder = await this.repository.create({ ...args });

    await this.repository.save(reminder);
  }

  async update(args: UpdateReminderOptions): Promise<void> {
    const { id, ...updatedValues } = args;

    const { affected } = await this.repository.update(
      { id },
      { ...updatedValues }
    );

    if (affected === 0) {
      throw new BadRequest({ message: "reminder not found" });
    }
  }

  async remove(id: string): Promise<void> {
    const { affected } = await this.repository.delete(id);

    if (affected === 0) {
      throw new BadRequest({ message: "reminder not found" });
    }
  }
}
