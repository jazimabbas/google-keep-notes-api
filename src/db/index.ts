import path from "path";
import { DataSource } from "typeorm";
import { dbEnvVars } from "@/utils/env-vars";

const dataSource = new DataSource({
  type: "mysql",
  host: dbEnvVars.host,
  username: dbEnvVars.username,
  password: dbEnvVars.password,
  port: +dbEnvVars.port,
  synchronize: false,
  database: dbEnvVars.database,
  entities: [path.join(__dirname, "./entities/**/*.{ts,js}")],
  migrations: [path.join(__dirname, "./migrations/**/*.{ts,js}")],
});

export default dataSource;
