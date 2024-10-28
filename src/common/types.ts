interface ApiResponse<T> {
  Response: {
    Count: [string]
    Message: [string]
    Results: [T]
  }
}

export interface ApiResponseVehicleMakesResponse
  extends ApiResponse<{
    AllVehicleMakes: Array<{
      Make_ID: [string]
      Make_Name: [string]
    }>
  }> {}

export interface ApiResponseVehicleTypesResponse
  extends ApiResponse<{
    VehicleTypesForMakeIds: Array<{
      VehicleTypeId: [string]
      VehicleTypeName: [string]
    }>
  }> {}

interface ParsedResponse<T> {
  count: number
  message: string
  results: T[]
}

export interface ParsedResponseVehicleMakes
  extends ParsedResponse<VehicleMake> {}

export interface VehicleMake {
  makeName: string
  makeId: number
}

export interface ParsedResponseVehicleTypes
  extends ParsedResponse<VehicleType> {}

export interface VehicleType {
  vehicleTypeId: number
  vehicleTypeName: string
}
