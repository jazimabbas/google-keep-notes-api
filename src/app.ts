import express from "express";
import allRoutes from "@/routes";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors());
app.use("/api", allRoutes);

export default app;
