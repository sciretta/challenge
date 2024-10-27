import { ParsedResponseVehicleMakes, VehicleMake } from "../types";

export const vehicleMakeMock: VehicleMake = {
  makeId: 1,
  makeName: "Toyota",
};

export const vehicleMakesMock: VehicleMake[] = [
  { makeId: 1, makeName: "Toyota" },
  { makeId: 2, makeName: "Ford" },
];

export const parsedResponseVehicleMakesMock: ParsedResponseVehicleMakes = {
  count: 2,
  message: "test-response",
  results: [vehicleMakeMock],
};
