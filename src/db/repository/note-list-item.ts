import { NoteListItem } from "../entities";
import dataSource from "../index";
import { Repository } from "typeorm";

type NoteItem = {
  content: string;
  isCompleted: boolean;
  order: number;
};

class NoteListItemRepository {
  private repository: Repository<NoteListItem>;

  constructor() {
    this.repository = dataSource.getRepository(NoteListItem);
  }

  async createNoteListItems(listItems: NoteItem[]): Promise<NoteListItem[]> {
    const noteListItems = await this.repository.save(listItems);
    return noteListItems;
  }
}

export default NoteListItemRepository;
