import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Filter } from "src/modules/vehicle/vehicle.dto";
import {
  TypeMakeRelationDocument,
  VehicleMakeDocument,
  VehicleTypeDocument,
} from "./database.model";

@Injectable()
export class DatabaseService {
  constructor(
    @InjectModel("VehicleMake")
    private vehicleMakeModel: Model<VehicleMakeDocument>,
    @InjectModel("VehicleType")
    private vehicleTypeModel: Model<VehicleTypeDocument>,
    @InjectModel("TypeMakeRelation")
    private typeMakeRelationModel: Model<TypeMakeRelationDocument>
  ) {}

  async saveVehicleMakesBulk(
    vehicleMakes: VehicleMakeDocument[]
  ): Promise<void> {
    try {
      const bulkOperations = vehicleMakes.map((make) => ({
        updateOne: {
          filter: { makeId: make.makeId },
          update: { $set: make },
          upsert: true,
        },
      }));

      await this.vehicleMakeModel.bulkWrite(bulkOperations);
    } catch (err) {
      console.error("Error saving Vehicle Makes:", err);
    }
  }

  async saveVehicleTypeBulk(
    vehicleTypes: VehicleTypeDocument[]
  ): Promise<void> {
    try {
      const bulkOperations = vehicleTypes.map((type) => ({
        updateOne: {
          filter: { vehicleTypeId: type.vehicleTypeId },
          update: { $set: type },
          upsert: true,
        },
      }));

      await this.vehicleTypeModel.bulkWrite(bulkOperations);
    } catch (err) {
      console.error("Error saving Vehicle Types:", err);
    }
  }

  async getVehicleMakesTotal(): Promise<number> {
    try {
      return await this.vehicleMakeModel.countDocuments().exec();
    } catch (err) {
      console.error("Error getting Vehicle Makes count:", err);
    }
  }

  async getVehicleMakesList(filter: Filter): Promise<VehicleMakeDocument[]> {
    try {
      const skips = (filter.currentPage - 1) * filter.pages;
      return await this.vehicleMakeModel
        .find()
        .skip(skips)
        .limit(filter.pages)
        .exec();
    } catch (err) {
      console.error("Error getting Vehicle Makes list:", err);
    }
  }

  async getOneVehicleTypeItem(
    vehicleTypeId: number
  ): Promise<VehicleTypeDocument> {
    try {
      return await this.vehicleTypeModel.findOne({ vehicleTypeId }).exec();
    } catch (err) {
      console.error("Error getting Vehicle Type:", err);
    }
  }

  async getOneTypeMakeRelationItem(
    makeId: number
  ): Promise<TypeMakeRelationDocument> {
    try {
      return await this.typeMakeRelationModel.findOne({ makeId }).exec();
    } catch (err) {
      console.error("Error getting Vehicle Makes count:", err);
    }
  }

  async saveOneTypeMakeRelationItem(
    item: TypeMakeRelationDocument
  ): Promise<void> {
    try {
      await this.typeMakeRelationModel
        .findOneAndUpdate(
          { makeId: item.makeId },
          { $set: item },
          { upsert: true, new: true }
        )
        .exec();
    } catch (err) {
      console.error("Error saving or updating TypeMakeRelation item:", err);
    }
  }
  async saveTypeMakeRelationBulk(
    typeMakeRelations: TypeMakeRelationDocument[]
  ): Promise<void> {
    try {
      const bulkOperations = typeMakeRelations.map((type) => ({
        updateOne: {
          filter: { makeId: type.makeId },
          update: { $set: type },
          upsert: true,
        },
      }));

      await this.typeMakeRelationModel.bulkWrite(bulkOperations);
    } catch (err) {
      console.error("Error saving Vehicle Types:", err);
    }
  }
}
