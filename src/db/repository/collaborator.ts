import * as entities from "../entities";
import { In, Repository } from "typeorm";
import dataSource from "../index";
import { BadRequest } from "@/utils/errors/custom-errors";

type CreateOptions = {
  user: entities.User;
  note: entities.Note;
  owner: boolean;
  userNoteId: string;
};

export default class CollaboratorRepository {
  private repository: Repository<entities.Collaborator>;

  constructor() {
    this.repository = dataSource.getRepository(entities.Collaborator);
  }

  async create({
    user,
    note,
    owner,
    userNoteId,
  }: CreateOptions): Promise<void> {
    const collaborator = await this.repository.create({
      owner,
      user,
      note,
      userNoteId,
    });
    await this.repository.save(collaborator);
  }

  async getCollaborator({
    userId,
    noteId,
  }: {
    userId: string;
    noteId: string;
  }): Promise<entities.Collaborator> {
    const collaborator = await this.repository.findOne({
      where: { user: { id: userId }, note: { id: noteId } },
    });

    return collaborator;
  }

  async getCollaborators(ids: string[]): Promise<entities.Collaborator[]> {
    const collaborators = await this.repository.find({
      where: { id: In(ids) },
    });
    return collaborators;
  }

  async createBulk(args: CreateOptions[]) {
    await this.repository
      .createQueryBuilder()
      .insert()
      .into(entities.Collaborator)
      .values(args)
      .execute();
  }

  async getOwner(noteId): Promise<entities.Collaborator> {
    const collaborator = await this.repository.findOne({
      where: { note: { id: noteId }, owner: true },
      relations: ["user"],
    });
    return collaborator;
  }

  async remove(ids: string[]): Promise<void> {
    const { affected } = await this.repository.delete({
      id: In(ids),
      owner: false,
    });
    if (affected === 0) {
      throw new BadRequest({ message: "collaborator not found" });
    }
  }
  async removeByUserNoteIds(userNoteIds: string[]): Promise<void> {
    await this.repository.delete({
      userNoteId: In(userNoteIds),
      owner: false,
    });
  }
}
