import express from "express";
import userRoutes from "./user";
import noteRoutes from "./note";
import labelRoutes from "./label";
import * as imageUploadApi from "../api/image-upload";
import { upload } from "@/utils";

const router = express.Router();

router.get("/", (req, res) => {
  return res.status(200).json({ message: "Containers are healthy" });
});

router.use("/auth", userRoutes);
router.use("/notes", noteRoutes);
router.use("/labels", labelRoutes);
router.post("/upload", upload.single("file"), imageUploadApi.imageUpload);

export = router;
