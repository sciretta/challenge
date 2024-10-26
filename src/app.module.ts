import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { VehicleModule } from "./modules/vehicle/vehicle.module";
import { GraphQLModule } from "@nestjs/graphql";
import { join } from "path";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), "src/schema.gql"),
      playground: true,
      introspection: true,
    }),
    MongooseModule.forRoot("mongodb://localhost:27017/vehiclesDB"),
    VehicleModule,
  ],
})
export class AppModule {}
