import { parseStringPromise } from "xml2js";
import {
  ApiResponseVehicleMakesResponse,
  ApiResponseVehicleTypesResponse,
  ParsedResponseVehicleMakes,
  ParsedResponseVehicleTypes,
} from "../types";

interface XmlParser<T> {
  parseXmlToJson(xmlData: string): Promise<T>;
}

export class VehicleMakesXmlParser
  implements XmlParser<ParsedResponseVehicleMakes>
{
  async parseXmlToJson(xmlData: string): Promise<ParsedResponseVehicleMakes> {
    try {
      const rawData = (await parseStringPromise(
        xmlData
      )) as ApiResponseVehicleMakesResponse;

      const parsedData = {
        count: Number(rawData.Response.Count[0]),
        message: rawData.Response.Message[0],
        results: rawData.Response.Results[0].AllVehicleMakes.map((item) => ({
          makeId: Number(item.Make_ID[0]),
          makeName: item.Make_Name[0],
        })),
      };

      return parsedData;
    } catch (error) {
      throw new Error(`Error parsing XML: ${error.message}`);
    }
  }
}

export class VehicleTypesXmlParser
  implements XmlParser<ParsedResponseVehicleTypes>
{
  async parseXmlToJson(xmlData: string): Promise<ParsedResponseVehicleTypes> {
    try {
      const rawData = (await parseStringPromise(
        xmlData
      )) as ApiResponseVehicleTypesResponse;

      const parsedData = {
        count: Number(rawData.Response.Count[0]),
        message: rawData.Response.Message[0],
        results: rawData.Response.Results[0].VehicleTypesForMakeIds.map(
          (item) => ({
            vehicleTypeId: Number(item.VehicleTypeId[0]),
            vehicleTypeName: item.VehicleTypeName[0],
          })
        ),
      };

      return parsedData;
    } catch (error) {
      throw new Error(`Error parsing XML: ${error.message}`);
    }
  }
}
