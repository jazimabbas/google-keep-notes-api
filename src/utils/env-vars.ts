import dotenv from "dotenv";
dotenv.config();

export const dbEnvVars = {
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 3306,
};

export const appEnvVars = {
  jwtSecret: process.env.JWT_SECRET,
};

export const awsEnvVars = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  bucketName: process.env.BUCKET_NAME,
};
