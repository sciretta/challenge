import { Test, TestingModule } from '@nestjs/testing'
import { VehicleResolver } from './vehicle.resolver'
import { VehicleService } from './vehicle.service'
import { Filter, VehicleDTO } from './vehicle.dto'

describe('VehicleResolver', () => {
  let resolver: VehicleResolver
  let vehicleService: VehicleService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VehicleResolver,
        {
          provide: VehicleService,
          useValue: {
            getVehicles: jest.fn()
          }
        }
      ]
    }).compile()

    resolver = module.get<VehicleResolver>(VehicleResolver)
    vehicleService = module.get<VehicleService>(VehicleService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('getVehicles', () => {
    it('should call VehicleService.getVehicles with the provided filter and return the result', async () => {
      const filter: Filter = { currentPage: 1, limit: 1 }
      const mockVehicleData: VehicleDTO[] = [
        {
          makeId: 1,
          makeName: 'Toyota',
          vehicleTypes: [{ typeId: 101, typeName: 'SUV' }]
        }
      ];

      (vehicleService.getVehicles as jest.Mock).mockResolvedValue(
        mockVehicleData
      )

      const result = await resolver.getVehicles(filter)

      expect(vehicleService.getVehicles).toHaveBeenCalledWith(filter)
      expect(result).toEqual(mockVehicleData)
    })

    it('should log the filter and handle any errors thrown by VehicleService.getVehicles', async () => {
      const filter: Filter = { currentPage: 1, limit: 1 }
      const error = new Error('Service failed');

      (vehicleService.getVehicles as jest.Mock).mockRejectedValue(error)

      await expect(resolver.getVehicles(filter)).rejects.toThrow(error)
    })
  })
})
