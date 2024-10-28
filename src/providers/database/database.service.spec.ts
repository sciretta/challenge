import { Test, TestingModule } from '@nestjs/testing'
import { DatabaseService } from './database.service'
import { getModelToken } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import {
  VehicleMakeDocument,
  VehicleTypeDocument,
  TypeMakeRelationDocument
} from './database.model'

describe('DatabaseService', () => {
  let service: DatabaseService
  let vehicleMakeModel: Model<VehicleMakeDocument>
  let vehicleTypeModel: Model<VehicleTypeDocument>
  let typeMakeRelationModel: Model<TypeMakeRelationDocument>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DatabaseService,
        {
          provide: getModelToken('VehicleMake'),
          useValue: {
            bulkWrite: jest.fn(),
            countDocuments: jest.fn().mockReturnThis(),
            find: jest.fn().mockReturnThis(),
            skip: jest.fn().mockReturnThis(),
            limit: jest.fn().mockReturnThis(),
            exec: jest.fn().mockReturnThis()
          }
        },
        {
          provide: getModelToken('VehicleType'),
          useValue: {
            bulkWrite: jest.fn(),
            findOne: jest.fn().mockReturnThis(),
            exec: jest.fn()
          }
        },
        {
          provide: getModelToken('TypeMakeRelation'),
          useValue: {
            bulkWrite: jest.fn(),
            findOneAndUpdate: jest.fn().mockReturnThis(),
            findOne: jest.fn().mockReturnThis(),
            exec: jest.fn()
          }
        }
      ]
    }).compile()

    service = module.get<DatabaseService>(DatabaseService)
    vehicleMakeModel = module.get<Model<VehicleMakeDocument>>(
      getModelToken('VehicleMake')
    )
    vehicleTypeModel = module.get<Model<VehicleTypeDocument>>(
      getModelToken('VehicleType')
    )
    typeMakeRelationModel = module.get<Model<TypeMakeRelationDocument>>(
      getModelToken('TypeMakeRelation')
    )
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should save vehicle makes in bulk', async () => {
    const vehicleMakes = [
      { makeId: 1, makeName: 'Toyota' }
    ] as VehicleMakeDocument[]
    await service.saveVehicleMakesBulk(vehicleMakes)
    expect(vehicleMakeModel.bulkWrite).toHaveBeenCalledWith([
      {
        updateOne: {
          filter: { makeId: 1 },
          update: { $set: vehicleMakes[0] },
          upsert: true
        }
      }
    ])
  })

  it('should throw an error if saveVehicleMakesBulk fails', async () => {
    jest
      .spyOn(vehicleMakeModel, 'bulkWrite')
      .mockRejectedValue(new Error('Failed'))
    await expect(service.saveVehicleMakesBulk([])).rejects.toThrow(
      'DatabaseService Error on method saveVehicleMakesBulk: Failed'
    )
  })

  it('should save vehicle types in bulk', async () => {
    const vehicleTypes = [
      { vehicleTypeId: 1, vehicleTypeName: 'SUV' }
    ] as VehicleTypeDocument[]
    await service.saveVehicleTypeBulk(vehicleTypes)
    expect(vehicleTypeModel.bulkWrite).toHaveBeenCalledWith([
      {
        updateOne: {
          filter: { vehicleTypeId: 1 },
          update: { $set: vehicleTypes[0] },
          upsert: true
        }
      }
    ])
  })

  it('should throw an error if saveVehicleTypeBulk fails', async () => {
    jest
      .spyOn(vehicleTypeModel, 'bulkWrite')
      .mockRejectedValue(new Error('Failed'))
    await expect(service.saveVehicleTypeBulk([])).rejects.toThrow(
      'DatabaseService Error on method saveVehicleTypeBulk: Failed'
    )
  })

  it('should get the total count of vehicle makes', async () => {
    await service.getVehicleMakesTotal()
    expect(vehicleMakeModel.countDocuments).toHaveBeenCalled()
  })

  it('should throw an error if getVehicleMakesTotal fails', async () => {
    vehicleMakeModel.countDocuments = jest.fn().mockReturnValue({
      exec: jest.fn().mockRejectedValue(new Error('Failed'))
    })

    await expect(service.getVehicleMakesTotal()).rejects.toThrow(
      'DatabaseService Error on method getVehicleMakesTotal: Failed'
    )
  })

  it('should get vehicle makes list with pagination', async () => {
    const filter = { currentPage: 1, limit: 10 }
    await service.getVehicleMakesList(filter)
    expect(vehicleMakeModel.find).toHaveBeenCalled()
  })

  it('should throw an error if getVehicleMakesList fails', async () => {
    vehicleMakeModel.find = jest.fn().mockReturnValue({
      find: jest.fn().mockRejectedValue(new Error('Failed'))
    })

    await expect(
      service.getVehicleMakesList({ currentPage: 1, limit: 10 })
    ).rejects.toThrow('DatabaseService Error on method getVehicleMakesList:')
  })

  it('should get one vehicle type item by vehicleTypeId', async () => {
    const vehicleTypeId = 1
    await service.getOneVehicleTypeItem(vehicleTypeId)
    expect(vehicleTypeModel.findOne).toHaveBeenCalledWith({ vehicleTypeId })
  })

  it('should throw an error if getOneVehicleTypeItem fails', async () => {
    vehicleTypeModel.findOne = jest.fn().mockReturnValue({
      exec: jest.fn().mockRejectedValue(new Error('Failed'))
    })

    await expect(service.getOneVehicleTypeItem(1)).rejects.toThrow(
      'DatabaseService Error on method getOneVehicleTypeItem:'
    )
  })

  it('should get one type-make relation by makeId', async () => {
    const makeId = 1
    await service.getOneTypeMakeRelationItem(makeId)
    expect(typeMakeRelationModel.findOne).toHaveBeenCalledWith({ makeId })
  })

  it('should save one type-make relation item', async () => {
    const item = { makeId: 1, typeIds: [2] } as TypeMakeRelationDocument
    await service.saveOneTypeMakeRelationItem(item)
    expect(typeMakeRelationModel.findOneAndUpdate).toHaveBeenCalledWith(
      { makeId: item.makeId },
      { $set: item },
      { upsert: true, new: true }
    )
  })

  it('should save type-make relations in bulk', async () => {
    const typeMakeRelations = [
      { makeId: 1, typeIds: [1] }
    ] as TypeMakeRelationDocument[]
    await service.saveTypeMakeRelationBulk(typeMakeRelations)
    expect(typeMakeRelationModel.bulkWrite).toHaveBeenCalledWith([
      {
        updateOne: {
          filter: { makeId: 1 },
          update: { $set: typeMakeRelations[0] },
          upsert: true
        }
      }
    ])
  })
})
