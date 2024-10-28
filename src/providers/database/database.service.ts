import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Filter } from 'src/modules/vehicle/vehicle.dto'
import {
  TypeMakeRelationDocument,
  VehicleMakeDocument,
  VehicleTypeDocument
} from './database.model'

@Injectable()
export class DatabaseService {
  constructor (
    @InjectModel('VehicleMake')
    private readonly vehicleMakeModel: Model<VehicleMakeDocument>,
    @InjectModel('VehicleType')
    private readonly vehicleTypeModel: Model<VehicleTypeDocument>,
    @InjectModel('TypeMakeRelation')
    private readonly typeMakeRelationModel: Model<TypeMakeRelationDocument>
  ) {}

  async saveVehicleMakesBulk (
    vehicleMakes: VehicleMakeDocument[]
  ): Promise<void> {
    try {
      const bulkOperations = vehicleMakes.map((make) => ({
        updateOne: {
          filter: { makeId: make.makeId },
          update: { $set: make },
          upsert: true
        }
      }))

      await this.vehicleMakeModel.bulkWrite(bulkOperations)
    } catch (err) {
      console.error(
        'DatabaseService Error on method saveVehicleMakesBulk',
        err
      )
      throw new Error(
        `DatabaseService Error on method saveVehicleMakesBulk: ${err.message}`
      )
    }
  }

  async saveVehicleTypeBulk (
    vehicleTypes: VehicleTypeDocument[]
  ): Promise<void> {
    try {
      const bulkOperations = vehicleTypes.map((type) => ({
        updateOne: {
          filter: { vehicleTypeId: type.vehicleTypeId },
          update: { $set: type },
          upsert: true
        }
      }))

      await this.vehicleTypeModel.bulkWrite(bulkOperations)
    } catch (err) {
      console.error(
        'DatabaseService Error on method saveVehicleTypeBulk:',
        err
      )
      throw new Error(
        `DatabaseService Error on method saveVehicleTypeBulk: ${err.message}`
      )
    }
  }

  async getVehicleMakesTotal (): Promise<number> {
    try {
      return await this.vehicleMakeModel.countDocuments().exec()
    } catch (err) {
      console.error(
        'DatabaseService Error on method getVehicleMakesTotal',
        err
      )
      throw new Error(
        `DatabaseService Error on method getVehicleMakesTotal: ${err.message}`
      )
    }
  }

  async getVehicleMakesList (filter: Filter): Promise<VehicleMakeDocument[]> {
    try {
      const skips = (filter.currentPage - 1) * filter.limit
      return await this.vehicleMakeModel
        .find()
        .skip(skips)
        .limit(filter.limit)
        .exec()
    } catch (err) {
      console.error('DatabaseService Error on method getVehicleMakesList', err)
      throw new Error(
        `DatabaseService Error on method getVehicleMakesList: ${err.message}`
      )
    }
  }

  async getOneVehicleTypeItem (
    vehicleTypeId: number
  ): Promise<VehicleTypeDocument> {
    try {
      return await this.vehicleTypeModel.findOne({ vehicleTypeId }).exec()
    } catch (err) {
      console.error(
        'DatabaseService Error on method getOneVehicleTypeItem',
        err
      )
      throw new Error(
        `DatabaseService Error on method getOneVehicleTypeItem: ${err.message}`
      )
    }
  }

  async getOneTypeMakeRelationItem (
    makeId: number
  ): Promise<TypeMakeRelationDocument> {
    try {
      return await this.typeMakeRelationModel.findOne({ makeId }).exec()
    } catch (err) {
      console.error(
        'DatabaseService Error on method getOneTypeMakeRelationItem',
        err
      )
      throw new Error(
        `DatabaseService Error on method getOneTypeMakeRelationItem: ${err.message}`
      )
    }
  }

  async saveOneTypeMakeRelationItem (
    item: TypeMakeRelationDocument
  ): Promise<void> {
    try {
      await this.typeMakeRelationModel
        .findOneAndUpdate(
          { makeId: item.makeId },
          { $set: item },
          { upsert: true, new: true }
        )
        .exec()
    } catch (err) {
      console.error(
        'DatabaseService Error on method saveOneTypeMakeRelationItem',
        err
      )
      throw new Error(
        `DatabaseService Error on method saveOneTypeMakeRelationItem: ${err.message}`
      )
    }
  }

  async saveTypeMakeRelationBulk (
    typeMakeRelations: TypeMakeRelationDocument[]
  ): Promise<void> {
    try {
      const bulkOperations = typeMakeRelations.map((type) => ({
        updateOne: {
          filter: { makeId: type.makeId },
          update: { $set: type },
          upsert: true
        }
      }))

      await this.typeMakeRelationModel.bulkWrite(bulkOperations)
    } catch (err) {
      console.error(
        'DatabaseService Error on method saveTypeMakeRelationBulk',
        err
      )
      throw new Error(
        `DatabaseService Error on method saveTypeMakeRelationBulk: ${err.message}`
      )
    }
  }
}
