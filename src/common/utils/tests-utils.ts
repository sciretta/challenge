import { ParsedResponseVehicleMakes, VehicleMake } from "../types";

export const vehicleMakeMock: VehicleMake = {
  makeId: 1,
  makeName: "test-vehicle",
};

export const parsedResponseVehicleMakesMock: ParsedResponseVehicleMakes = {
  count: 2,
  message: "test-response",
  results: [vehicleMakeMock, vehicleMakeMock, vehicleMakeMock],
};
