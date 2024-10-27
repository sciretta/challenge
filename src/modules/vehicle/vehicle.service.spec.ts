import { Test, TestingModule } from "@nestjs/testing";
import { VehicleService } from "./vehicle.service";
import { getModelToken } from "@nestjs/mongoose";
import { Model } from "mongoose";
import {
  TypeMakeRelationDocument,
  VehicleMakeDocument,
  VehicleTypeDocument,
} from "../../providers/database/database.model";
import { NetworkService } from "../../providers/network/network.service";
import { DatabaseService } from "../../providers/database/database.service";
import { parsedResponseVehicleMakesMock } from "../../common/utils/tests-utils";
import { Filter } from "./vehicle.dto";

describe("VehicleService", () => {
  let service: VehicleService;
  let networkService: NetworkService;
  let databaseService: DatabaseService;
  let vehicleTypeModel: Model<VehicleTypeDocument>;
  let vehicleMakeModel: Model<VehicleMakeDocument>;
  let typeMakeRelationModel: Model<TypeMakeRelationDocument>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VehicleService,
        {
          provide: NetworkService,
          useValue: {
            getVehicleMakes: jest
              .fn()
              .mockReturnValue(parsedResponseVehicleMakesMock),
            getVehicleTypes: jest.fn(),
          },
        },
        DatabaseService,
        {
          provide: getModelToken("VehicleType"),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            exec: jest.fn(),
          },
        },
        {
          provide: getModelToken("VehicleMake"),
          useValue: {
            find: jest.fn().mockReturnThis(),
            findOne: jest.fn().mockReturnThis(),
            create: jest.fn().mockReturnThis(),
            exec: jest.fn().mockReturnThis(),
            countDocuments: jest.fn().mockReturnThis(),
            bulkWrite: jest.fn().mockReturnThis(),
          },
        },
        {
          provide: getModelToken("TypeMakeRelation"),
          useValue: {
            find: jest.fn().mockReturnThis(),
            findOne: jest.fn().mockReturnThis(),
            create: jest.fn().mockReturnThis(),
            exec: jest.fn().mockReturnThis(),
            bulkWrite: jest.fn().mockReturnThis(),
          },
        },
      ],
    }).compile();

    service = module.get<VehicleService>(VehicleService);
    networkService = module.get<NetworkService>(NetworkService);
    databaseService = module.get<DatabaseService>(DatabaseService);
    vehicleTypeModel = module.get<Model<VehicleTypeDocument>>(
      getModelToken("VehicleType")
    );
    vehicleMakeModel = module.get<Model<VehicleMakeDocument>>(
      getModelToken("VehicleMake")
    );
    typeMakeRelationModel = module.get<Model<TypeMakeRelationDocument>>(
      getModelToken("TypeMakeRelation")
    );
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should call fillInitialCollectionsData on module init", async () => {
    const consoleSpy = jest.spyOn(console, "log").mockImplementation();

    await service.onModuleInit();

    expect(consoleSpy).toHaveBeenCalledWith("Filling database collections");
    expect(consoleSpy).toHaveBeenCalledWith(
      "Database initial collections filled"
    );

    consoleSpy.mockRestore();
  });

  it("should return formatted vehicle data in getVehicles", async () => {
    const mockFilter: Filter = { currentPage: 1, limit: 1 };
    const mockMakes = [{ makeId: 1, makeName: "Toyota" }];
    const mockVehicleTypes = [{ vehicleTypeId: 101, vehicleTypeName: "SUV" }];

    jest.spyOn(service, "getVehicleMakes").mockResolvedValue(mockMakes);
    jest.spyOn(service, "getVehicleTypes").mockResolvedValue(mockVehicleTypes);

    const result = await service.getVehicles(mockFilter);

    expect(result).toEqual([
      {
        makeId: 1,
        makeName: "Toyota",
        vehicleTypes: [{ typeId: 101, typeName: "SUV" }],
      },
    ]);
    expect(service.getVehicleMakes).toHaveBeenCalledWith(mockFilter);
    expect(service.getVehicleTypes).toHaveBeenCalledWith(1);
  });
});
