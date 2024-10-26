import { Injectable } from "@nestjs/common";
import { VehicleMake, VehicleType } from "../../common/types";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { DATE_FORMAT } from "../../common/utils/helpers";
const moment = require("moment");

@Injectable()
export class DatabaseService {
  LAST_UPDATE_VEHICLE_MAKE_TIME: string | null = null;
  LAST_UPDATE_VEHICLE_TYPE_TIME: string | null = null;

  constructor(
    @InjectModel("VehicleMake") private vehicleMakeModel: Model<VehicleMake>,
    @InjectModel("VehicleType") private vehicleTypeModel: Model<VehicleType>
  ) {}

  async saveVehicleMakesBulk(vehicleMakes: VehicleMake[]): Promise<void> {
    try {
      const bulkOperations = vehicleMakes.map((vehicle) => ({
        updateOne: {
          filter: { makeId: vehicle.makeId },
          update: { $set: vehicle },
          upsert: true,
        },
      }));

      await this.vehicleMakeModel.bulkWrite(bulkOperations);
    } catch (err) {
      console.error("Error saving Vehicle Makes:", err);
    }
  }

  async saveVehicleTypeBulk(vehicleTypes: VehicleType[]): Promise<void> {
    try {
      await this.vehicleTypeModel.insertMany(vehicleTypes);
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

  async getVehicleMakesList(): Promise<VehicleMake[]> {
    try {
      return await this.vehicleMakeModel.find().exec();
    } catch (err) {
      console.error("Error getting Vehicle Makes list:", err);
    }
  }

  getLastUpdateVehicleMake(): string | null {
    return this.LAST_UPDATE_VEHICLE_MAKE_TIME;
  }

  getLastUpdateVehicleType(): string | null {
    return this.LAST_UPDATE_VEHICLE_TYPE_TIME;
  }

  setLastUpdateVehicleMake(): string | null {
    const newDate = moment().format(DATE_FORMAT);
    this.LAST_UPDATE_VEHICLE_MAKE_TIME = newDate;
    return this.LAST_UPDATE_VEHICLE_MAKE_TIME;
  }

  setLastUpdateVehicleType(): string | null {
    const newDate = moment().format(DATE_FORMAT);
    this.LAST_UPDATE_VEHICLE_TYPE_TIME = newDate;
    return this.LAST_UPDATE_VEHICLE_TYPE_TIME;
  }

  isVehicleMakesDBUpdated(): boolean {
    if (!this.LAST_UPDATE_VEHICLE_MAKE_TIME) return false;
    const targetDate = moment(this.LAST_UPDATE_VEHICLE_MAKE_TIME);

    const isMoreThanOneDayOld = targetDate.isSameOrBefore(
      moment().subtract(1, "days")
    );

    return !isMoreThanOneDayOld;
  }
}
