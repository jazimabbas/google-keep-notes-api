import express from "express";
import * as noteApi from "@/api/note";
import passportAuth from "@/middleware/passport-config";

const router = express.Router();

router.post("/", passportAuth, noteApi.createNote); // POST /api/notes
router.get("/", passportAuth, noteApi.getNotes); // GET /api/notes
router.get("/:id", passportAuth, noteApi.noteDetail); // GET /api/notes/:id
router.delete("/", passportAuth, noteApi.deleteNotes); // DELETE /api/notes
router.put("/archive", passportAuth, noteApi.archiveNotes); // PUT /api/notes/archive
router.put("/unarchive", passportAuth, noteApi.unArchiveNotes); // PUT /api/notes/unarchive
router.put("/pin", passportAuth, noteApi.pinNotes); // PUT /api/notes/pin
router.put("/unpin", passportAuth, noteApi.unPinNotes); // PUT /api/notes/unpin
router.put("/change-label", passportAuth, noteApi.changeNotesLabel); // PUT /api/notes/change-label
router.put("/:id/add-collaborator", passportAuth, noteApi.addCollaborator); // POST /api/notes/:id/add-collaborator
router.put(
  "/:id/remove-collaborator",
  passportAuth,
  noteApi.removeCollaborator
); // PUT /api/notes/remove-collaborator

router.put("/:id/reminder", passportAuth, noteApi.addReminder);
router.put("/:id/remove-reminder", passportAuth, noteApi.removeReminder);
router.put("/:id/update-reminder", passportAuth, noteApi.updateReminder);

export = router;
