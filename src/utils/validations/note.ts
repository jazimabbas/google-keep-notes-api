import { object, string, date, boolean, array, number } from "yup";

const noteListItem = object().shape({
  content: string().required().label("Content"),
  isCompleted: boolean().default(false).label("Is Completed"),
  order: number().required().label("Order"),
});

const noteList = object().shape({
  content: string().required().label("Content"),
  isCompleted: boolean().default(false).label("Is Completed"),
  order: number().required().label("Order"),
  hasItems: boolean().default(false).label("Has Items"),
  noteItemList: array()
    .of(noteListItem)
    .label("NoteItemList")
    .when("hasItems", {
      is: true,
      then: (schema) => schema.required().min(1),
    }),
});

export const noteSchema = object()
  .shape({
    title: string().label("Title"),
    content: string().label("Content"),
    hasCheckBoxEnable: boolean().label("NoteList").default(false),
    imageUrls: array().of(string().url()).label("Images"),
    theme: string().label("Theme"),
    pined: boolean().label("Pined").default(false),
    labels: array().of(string().required()).label("Label"),
    noteList: array()
      .of(noteList)
      .when("hasCheckBoxEnable", {
        is: true,
        then: (schema) => schema.required().min(1),
      }),
  })
  .test(
    "titleOrContentRequired",
    "Either title or content is required when hasBoxEnable is false",
    function (value) {
      const { title, content, hasCheckBoxEnable } = value;
      if (!hasCheckBoxEnable && !title && !content) {
        return this.createError({
          path: "title",
          message:
            "Either Title or Content is required when hasCheckBoxEnable is false",
        });
      }
      return true;
    }
  );

const notesIdSchema = object().shape({
  noteIds: array().of(string().uuid()).required().min(1).label("NoteIds"),
});

export const deleteNoteSchema = notesIdSchema;

export const archiveNotesSchema = notesIdSchema;

export const unArchiveNotesSchema = notesIdSchema;

export const pinNotesSchema = notesIdSchema;

export const unPinNotesSchema = notesIdSchema;

export const changeNoteLabelSchema = object().shape({
  label: string().uuid().required().label("Label"),
  userNoteIds: array()
    .of(string().uuid())
    .required()
    .min(1)
    .label("UserNoteIds"),
  selected: boolean().required().label("Select"),
});

export const collaboratorIdsSchema = object().shape({
  collaboratorIds: array()
    .of(string().uuid())
    .required()
    .min(1)
    .label("CollaboratorIds"),
});

export const addCollaboratorSchema = object().shape({
  emails: array().of(string().email()).required().min(1).label("Emails"),
});

export const addReminderSchema = object().shape({
  dateTime: date().required().label("dateTime"),
  occurrence: number().required().label("occurrence").moreThan(0),
});

export const updateReminderSchema = addReminderSchema;
