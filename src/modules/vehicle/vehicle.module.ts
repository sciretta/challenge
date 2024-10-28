import { Module } from '@nestjs/common'
import { VehicleService } from './vehicle.service'
import { VehicleResolver } from './vehicle.resolver'
import { NetworkModule } from '../../providers/network/network.module'
import { DatabaseModule } from '../../providers/database/database.module'
import { NetworkService } from '../../providers/network/network.service'
import { DatabaseService } from '../../providers/database/database.service'

@Module({
  imports: [NetworkModule, DatabaseModule],
  providers: [VehicleService, VehicleResolver, NetworkService, DatabaseService]
})
export class VehicleModule {}
