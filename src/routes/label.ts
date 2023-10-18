import express from "express";
import * as labelApi from "@/api/label";
import passportAuth from "@/middleware/passport-config";

const router = express.Router();

router.post("/", passportAuth, labelApi.createLabel); // POST /api/labels
router.get("/", passportAuth, labelApi.getUserLabels); // GET /api/labels
router.delete("/:id", passportAuth, labelApi.deleteLabel); // DELETE /api/labels/:id
router.put("/:id", passportAuth, labelApi.updateLabel); // PUT /api/labels/:id

export = router;
