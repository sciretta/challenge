import { Injectable } from "@nestjs/common";
import {
  ParsedResponseVehicleMakes,
  ParsedResponseVehicleTypes,
} from "../../common/types";
import axios from "axios";
import {
  VehicleMakesXmlParser,
  VehicleTypesXmlParser,
} from "../../common/utils/xml-parser.util";

@Injectable()
export class NetworkService {
  private readonly BASE_API_URL = "https://vpic.nhtsa.dot.gov/api/vehicles";
  constructor() {}

  async getVehicleMakes(): Promise<ParsedResponseVehicleMakes> {
    try {
      const response = await axios.get(
        `${this.BASE_API_URL}/getallmakes?format=XML`
      );
      const vehicleMakesXmlParser = new VehicleMakesXmlParser();
      const jsonData = await vehicleMakesXmlParser.parseXmlToJson(
        response.data
      );
      return jsonData;
    } catch (err) {
      console.error("NetworkService Error on method getVehicleMakes", err);
      throw new Error(
        `NetworkService Error on method getVehicleMakes: ${err.message}`
      );
    }
  }

  async getVehicleTypes(makeId: number): Promise<ParsedResponseVehicleTypes> {
    try {
      const response = await axios.get(
        `${this.BASE_API_URL}/GetVehicleTypesForMakeId/${makeId}?format=xml`
      );
      const vehicleTypesXmlParser = new VehicleTypesXmlParser();
      const jsonData = await vehicleTypesXmlParser.parseXmlToJson(
        response.data
      );
      return jsonData;
    } catch (err) {
      console.error("NetworkService Error on method getVehicleTypes", err);
      throw new Error(
        `NetworkService Error on method getVehicleTypes: ${err.message}`
      );
    }
  }
}
