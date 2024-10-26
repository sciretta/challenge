import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import {
  vehicleMakeSchema,
  vehicleTypeSchema,
} from "../../providers/database/database.model";
import { DatabaseService } from "./database.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: "VehicleMake", schema: vehicleMakeSchema },
      { name: "VehicleType", schema: vehicleTypeSchema },
    ]),
  ],
  providers: [DatabaseService],
  exports: [DatabaseService, MongooseModule],
})
export class DatabaseModule {}
