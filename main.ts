import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import mongoose from "mongoose";
import { graphqlUploadExpress } from "graphql-upload-ts";
import { AppModule } from "./src/app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })
  );
  app.use(graphqlUploadExpress());
  app.enableCors();
  mongoose.set("debug", true);

  await app.listen(3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
