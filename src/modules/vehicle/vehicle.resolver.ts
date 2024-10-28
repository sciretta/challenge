import { Resolver, Query, Args } from '@nestjs/graphql'
import { VehicleService } from './vehicle.service'
import { Filter, VehicleDTO } from './vehicle.dto'

@Resolver(() => VehicleDTO)
export class VehicleResolver {
  constructor (private readonly vehicleService: VehicleService) {}

  @Query(() => [VehicleDTO], { name: 'getVehicles' })
  async getVehicles (
    @Args('filter', { type: () => Filter }) filter: Filter
  ): Promise<VehicleDTO[]> {
    return await this.vehicleService.getVehicles(filter)
  }
}
