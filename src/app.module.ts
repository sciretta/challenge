import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { VehicleModule } from './modules/vehicle/vehicle.module'
import { GraphQLModule } from '@nestjs/graphql'
import { join } from 'path'
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { ConfigModule } from '@nestjs/config'

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env'
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      playground: true,
      introspection: true
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI),
    VehicleModule
  ]
})
export class AppModule {}
