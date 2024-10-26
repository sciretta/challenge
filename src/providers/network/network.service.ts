import { Injectable } from "@nestjs/common";
import {
  ParsedResponseVehicleMakes,
  VehicleMake,
  VehicleType,
} from "../../common/types";
import axios from "axios";
import { VehicleMakesXmlParser } from "../../common/utils/xml-parser.util";
import { Filter } from "../../modules/vehicle/vehicle.dto";

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
    } catch (error) {
      throw new Error(`Error fetching makes: ${error.message}`);
    }
  }

  private async getVehicleTypes(filter: Filter): Promise<VehicleType[]> {
    // try {
    //   const response = await axios.get(
    //     `${this.BASE_API_URL}/GetVehicleTypesForMakeId/${makeId}?format=xml`
    //   );
    //   const vehicleTypesXmlParser = new VehicleTypesXmlParser();
    //   const jsonData = await vehicleTypesXmlParser.parseXmlToJson(
    //     response.data
    //   );
    //   return jsonData;
    // } catch (error) {
    //   throw new Error(`Error fetching types: ${error.message}`);
    // }
    return [];
  }
}
