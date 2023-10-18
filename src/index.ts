import app from "./app";
import dataSource from "./db";
import * as AWS from "aws-sdk";
import { awsEnvVars } from "./utils/env-vars";

async function bootstrap() {
  await dataSource.initialize();

  AWS.config.update({
    credentials: {
      accessKeyId: awsEnvVars.accessKeyId,
      secretAccessKey: awsEnvVars.secretAccessKey,
    },
  });

  const PORT = process.env.PORT || 8000;
  app.listen(PORT, () => {
    console.log(`App is listening on the PORT ${PORT} ..`);
  });
}

bootstrap();
