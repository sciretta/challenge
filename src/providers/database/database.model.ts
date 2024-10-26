import { Schema, model } from "mongoose";

export interface VehicleMakeDocument extends Document {
  makeId: number;
  makeName: string;
}

export const vehicleMakeSchema = new Schema({
  makeId: Number,
  makeName: String,
});

export interface VehicleTypeDocument extends Document {
  vehicleTypeId: number;
  vehicleTypeName: string;
}

export const vehicleTypeSchema = new Schema({
  vehicleTypeId: Number,
  vehicleTypeName: String,
});

export const VehicleMakeModel = model<VehicleMakeDocument>(
  "VehicleMake",
  vehicleMakeSchema
);
export const VehicleTypeModel = model<VehicleTypeDocument>(
  "VehicleType",
  vehicleTypeSchema
);
