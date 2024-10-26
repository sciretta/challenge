import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import mongoose from "mongoose";
import { graphqlUploadExpress } from "graphql-upload-ts";
import { AppModule } from "./src/app.module";

async function bootstrap() {
  // Create the Nest application instance
  const app = await NestFactory.create(AppModule);

  // Global Validation Pipe to ensure proper data validation in the app
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })
  );
  app.use(graphqlUploadExpress());
  // Middleware to handle GraphQL file uploads
  app.enableCors();
  // Set up MongoDB connection debug logging (optional, for development purposes)
  mongoose.set("debug", true);

  // Start the server on port 3000
  await app.listen(3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
