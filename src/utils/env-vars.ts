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
