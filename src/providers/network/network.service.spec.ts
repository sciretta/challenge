import { Test, TestingModule } from "@nestjs/testing";
import { NetworkService } from "./network.service";
import axios from "axios";
import {
  VehicleMakesXmlParser,
  VehicleTypesXmlParser,
} from "../../common/utils/xml-parser.util";
import {
  ParsedResponseVehicleMakes,
  ParsedResponseVehicleTypes,
} from "../../common/types";

jest.mock("axios");
jest.mock("../../common/utils/xml-parser.util");

describe("NetworkService", () => {
  let service: NetworkService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NetworkService],
    }).compile();

    service = module.get<NetworkService>(NetworkService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getVehicleMakes", () => {
    it("should return parsed vehicle makes data on success", async () => {
      const mockXmlData = "<xml>mocked data</xml>";
      const mockParsedData: ParsedResponseVehicleMakes = {
        count: 1,
        message: "test",
        results: [{ makeId: 1, makeName: "Toyota" }],
      };

      (axios.get as jest.Mock).mockResolvedValue({ data: mockXmlData });
      (
        VehicleMakesXmlParser.prototype.parseXmlToJson as jest.Mock
      ).mockResolvedValue(mockParsedData);

      const result = await service.getVehicleMakes();

      expect(axios.get).toHaveBeenCalledWith(
        "https://vpic.nhtsa.dot.gov/api/vehicles/getallmakes?format=XML"
      );
      expect(
        VehicleMakesXmlParser.prototype.parseXmlToJson
      ).toHaveBeenCalledWith(mockXmlData);
      expect(result).toEqual(mockParsedData);
    });

    it("should throw an error if the axios request fails", async () => {
      (axios.get as jest.Mock).mockRejectedValue(new Error("Request failed"));

      await expect(service.getVehicleMakes()).rejects.toThrow(
        "NetworkService Error on method getVehicleMakes: Request failed"
      );
      expect(axios.get).toHaveBeenCalled();
    });

    it("should throw an error if XML parsing fails", async () => {
      const mockXmlData = "<xml>mocked data</xml>";

      (axios.get as jest.Mock).mockResolvedValue({ data: mockXmlData });
      (
        VehicleMakesXmlParser.prototype.parseXmlToJson as jest.Mock
      ).mockRejectedValue(new Error("Parsing failed"));

      await expect(service.getVehicleMakes()).rejects.toThrow(
        "NetworkService Error on method getVehicleMakes: Parsing failed"
      );
      expect(axios.get).toHaveBeenCalled();
      expect(
        VehicleMakesXmlParser.prototype.parseXmlToJson
      ).toHaveBeenCalledWith(mockXmlData);
    });
  });

  describe("getVehicleTypes", () => {
    it("should return parsed vehicle types data on success", async () => {
      const makeId = 1;
      const mockXmlData = "<xml>mocked data</xml>";
      const mockParsedData: ParsedResponseVehicleTypes = {
        count: 1,
        message: "test-message",
        results: [{ vehicleTypeId: 1, vehicleTypeName: "SUV" }],
      };

      (axios.get as jest.Mock).mockResolvedValue({ data: mockXmlData });
      (
        VehicleTypesXmlParser.prototype.parseXmlToJson as jest.Mock
      ).mockResolvedValue(mockParsedData);

      const result = await service.getVehicleTypes(makeId);

      expect(axios.get).toHaveBeenCalledWith(
        `https://vpic.nhtsa.dot.gov/api/vehicles/GetVehicleTypesForMakeId/${makeId}?format=xml`
      );
      expect(
        VehicleTypesXmlParser.prototype.parseXmlToJson
      ).toHaveBeenCalledWith(mockXmlData);
      expect(result).toEqual(mockParsedData);
    });

    it("should throw an error if the axios request fails", async () => {
      const makeId = 1;

      (axios.get as jest.Mock).mockRejectedValue(new Error("Request failed"));

      await expect(service.getVehicleTypes(makeId)).rejects.toThrow(
        "NetworkService Error on method getVehicleTypes: Request failed"
      );
      expect(axios.get).toHaveBeenCalled();
    });

    it("should throw an error if XML parsing fails", async () => {
      const makeId = 1;
      const mockXmlData = "<xml>mocked data</xml>";

      (axios.get as jest.Mock).mockResolvedValue({ data: mockXmlData });
      (
        VehicleTypesXmlParser.prototype.parseXmlToJson as jest.Mock
      ).mockRejectedValue(new Error("Parsing failed"));

      await expect(service.getVehicleTypes(makeId)).rejects.toThrow(
        "NetworkService Error on method getVehicleTypes: Parsing failed"
      );
      expect(axios.get).toHaveBeenCalled();
      expect(
        VehicleTypesXmlParser.prototype.parseXmlToJson
      ).toHaveBeenCalledWith(mockXmlData);
    });
  });
});
