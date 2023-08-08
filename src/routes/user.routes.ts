import express from "express";
import userApi from "@/api/user";

const router = express.Router();

router.post("/signup", userApi.userSignup);

export = router;
