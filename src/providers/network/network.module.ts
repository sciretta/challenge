import { Module } from '@nestjs/common'
import { NetworkService } from './network.service'

@Module({
  imports: [],
  providers: [NetworkService]
})
export class NetworkModule {}
