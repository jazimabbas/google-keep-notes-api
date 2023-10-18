import * as yup from "yup";
import * as schema from "@/utils/validations/note";
export type CreateNoteOptions = {
  title?: string;
  imageUrls?: string[];
  theme?: string;
  pined?: boolean;
  labels?: string[];
} & (CreateSimpleNote | CreateNoteList);

export type CreateSimpleNote = {
  hasCheckBoxEnable: false;
  content: string;
};

export type CreateNoteList = {
  hasCheckBoxEnable: true;
  noteList: NoteList[];
};

export type NoteList = BaseNoteItem & ({ hasItems: false } | NoteItemsList);

export type NoteItemsList = {
  hasItems: true;
  noteItemList: BaseNoteItem[];
};

export type BaseNoteItem = {
  content: string;
  isCompleted: boolean;
  order: number;
};
