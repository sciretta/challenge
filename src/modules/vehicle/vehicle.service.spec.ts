import { Test, TestingModule } from '@nestjs/testing'
import { VehicleService } from './vehicle.service'
import { getModelToken } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import {
  TypeMakeRelationDocument,
  VehicleMakeDocument,
  VehicleTypeDocument
} from '../../providers/database/database.model'
import { NetworkService } from '../../providers/network/network.service'
import { DatabaseService } from '../../providers/database/database.service'
import { parsedResponseVehicleMakesMock } from '../../common/utils/tests-utils'
import { Filter } from './vehicle.dto'
import { ParsedResponseVehicleTypes } from 'src/common/types'

describe('VehicleService', () => {
  let service: VehicleService
  let networkService: NetworkService
  let databaseService: DatabaseService
  let vehicleTypeModel: Model<VehicleTypeDocument>
  let vehicleMakeModel: Model<VehicleMakeDocument>
  let typeMakeRelationModel: Model<TypeMakeRelationDocument>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VehicleService,
        {
          provide: NetworkService,
          useValue: {
            getVehicleMakes: jest
              .fn()
              .mockReturnValue(parsedResponseVehicleMakesMock),
            getVehicleTypes: jest.fn()
          }
        },
        DatabaseService,
        {
          provide: getModelToken('VehicleType'),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            exec: jest.fn()
          }
        },
        {
          provide: getModelToken('VehicleMake'),
          useValue: {
            find: jest.fn().mockReturnThis(),
            findOne: jest.fn().mockReturnThis(),
            create: jest.fn().mockReturnThis(),
            exec: jest.fn().mockReturnThis(),
            countDocuments: jest.fn().mockReturnThis(),
            bulkWrite: jest.fn().mockReturnThis(),
            skip: jest.fn().mockReturnThis(),
            limit: jest.fn().mockReturnThis()
          }
        },
        {
          provide: getModelToken('TypeMakeRelation'),
          useValue: {
            find: jest.fn().mockReturnThis(),
            findOne: jest.fn().mockReturnThis(),
            create: jest.fn().mockReturnThis(),
            exec: jest.fn().mockReturnThis(),
            bulkWrite: jest.fn().mockReturnThis()
          }
        }
      ]
    }).compile()

    service = module.get<VehicleService>(VehicleService)
    networkService = module.get<NetworkService>(NetworkService)
    databaseService = module.get<DatabaseService>(DatabaseService)
    vehicleTypeModel = module.get<Model<VehicleTypeDocument>>(
      getModelToken('VehicleType')
    )
    vehicleMakeModel = module.get<Model<VehicleMakeDocument>>(
      getModelToken('VehicleMake')
    )
    typeMakeRelationModel = module.get<Model<TypeMakeRelationDocument>>(
      getModelToken('TypeMakeRelation')
    )
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  it('should call fillInitialCollectionsData on module init', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation()

    await service.onModuleInit()

    expect(consoleSpy).toHaveBeenCalledWith('Filling database collections')
    expect(consoleSpy).toHaveBeenCalledWith(
      'Database initial collections filled'
    )

    consoleSpy.mockRestore()
  })

  it('should return formatted vehicle data in getVehicles', async () => {
    const mockFilter: Filter = { currentPage: 1, limit: 1 }
    const mockMakes = [{ makeId: 1, makeName: 'Toyota' }]
    const mockVehicleTypes = [{ vehicleTypeId: 101, vehicleTypeName: 'SUV' }]

    jest.spyOn(service, 'getVehicleMakes').mockResolvedValue(mockMakes)
    jest.spyOn(service, 'getVehicleTypes').mockResolvedValue(mockVehicleTypes)

    const result = await service.getVehicles(mockFilter)

    expect(result).toEqual([
      {
        makeId: 1,
        makeName: 'Toyota',
        vehicleTypes: [{ typeId: 101, typeName: 'SUV' }]
      }
    ])
    expect(service.getVehicleMakes).toHaveBeenCalledWith(mockFilter)
    expect(service.getVehicleTypes).toHaveBeenCalledWith(1)
  })

  it('should get vehicle makes from database in getVehicleMakes', async () => {
    const mockFilter: Filter = { currentPage: 1, limit: 1 }
    const mockMakes = [{ makeId: 1, makeName: 'Toyota' }]

    jest
      .spyOn(databaseService, 'getVehicleMakesList')
      .mockResolvedValue(mockMakes)

    const result = await service.getVehicleMakes(mockFilter)

    expect(result).toEqual(mockMakes)
    expect(databaseService.getVehicleMakesList).toHaveBeenCalledWith(
      mockFilter
    )
  })

  it('should fetch vehicle types from network and save if typeIds are empty', async () => {
    const makeId = 1
    const mockRelation = { makeId, typeIds: [] }
    const mockVehicleTypes: ParsedResponseVehicleTypes = {
      count: 1,
      message: '',
      results: [{ vehicleTypeId: 101, vehicleTypeName: 'SUV' }]
    }

    jest
      .spyOn(databaseService, 'getOneTypeMakeRelationItem')
      .mockResolvedValue(mockRelation)
    jest
      .spyOn(networkService, 'getVehicleTypes')
      .mockResolvedValue(mockVehicleTypes)
    jest
      .spyOn(databaseService, 'saveOneTypeMakeRelationItem')
      .mockResolvedValue()
    jest.spyOn(databaseService, 'saveVehicleTypeBulk').mockResolvedValue()

    const result = await service.getVehicleTypes(makeId)

    expect(result).toEqual(mockVehicleTypes.results)
    expect(networkService.getVehicleTypes).toHaveBeenCalledWith(makeId)
    expect(databaseService.saveOneTypeMakeRelationItem).toHaveBeenCalledWith({
      makeId,
      typeIds: [101]
    })
    expect(databaseService.saveVehicleTypeBulk).toHaveBeenCalledWith(
      mockVehicleTypes.results
    )
  })

  it('should fetch vehicle types from database if typeIds are not empty', async () => {
    const makeId = 1
    const mockRelation = { makeId, typeIds: [101] }
    const mockVehicleType = { vehicleTypeId: 101, vehicleTypeName: 'SUV' }

    jest
      .spyOn(databaseService, 'getOneTypeMakeRelationItem')
      .mockResolvedValue(mockRelation)
    jest
      .spyOn(databaseService, 'getOneVehicleTypeItem')
      .mockResolvedValue(mockVehicleType)

    const result = await service.getVehicleTypes(makeId)

    expect(result).toEqual([mockVehicleType])
    expect(databaseService.getOneVehicleTypeItem).toHaveBeenCalledWith(101)
  })
})
