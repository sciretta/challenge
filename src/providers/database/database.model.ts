import { Schema, model } from 'mongoose'

export interface VehicleMakeDocument {
  makeId: number
  makeName: string
}

export const vehicleMakeSchema = new Schema({
  makeId: Number,
  makeName: String
})

export interface VehicleTypeDocument {
  vehicleTypeId: number
  vehicleTypeName: string
}

export const vehicleTypeSchema = new Schema({
  vehicleTypeId: Number,
  vehicleTypeName: String
})

export interface TypeMakeRelationDocument {
  makeId: number
  typeIds: number[]
}

export const typeMakeRelationSchema = new Schema({
  makeId: Number,
  typeIds: [Number]
})

export const VehicleMakeModel = model<VehicleMakeDocument>(
  'VehicleMake',
  vehicleMakeSchema
)
export const VehicleTypeModel = model<VehicleTypeDocument>(
  'VehicleType',
  vehicleTypeSchema
)
export const TypeMakeRelationModel = model<VehicleMakeDocument>(
  'TypeMakeRelation',
  typeMakeRelationSchema
)
