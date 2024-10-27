import { Injectable, OnModuleInit } from "@nestjs/common";
import { Filter, VehicleDTO } from "./vehicle.dto";
import { NetworkService } from "../../providers/network/network.service";
import { DatabaseService } from "../../providers/database/database.service";
import {
  TypeMakeRelationDocument,
  VehicleMakeDocument,
  VehicleTypeDocument,
} from "../../providers/database/database.model";

@Injectable()
export class VehicleService implements OnModuleInit {
  constructor(
    private networkService: NetworkService,
    private databaseService: DatabaseService
  ) {}

  async onModuleInit() {
    console.log("Filling database collections");
    await this.fillInitialCollectionsData();
    console.log("Database initial collections filled");
  }

  async getVehicles(filter: Filter): Promise<VehicleDTO[]> {
    const makes = await this.getVehicleMakes(filter);
    const parsedResponse: VehicleDTO[] = [];

    const promises: Promise<VehicleTypeDocument[]>[] = [];
    for (const { makeId } of makes) {
      promises.push(this.getVehicleTypes(makeId));
    }

    const vehiclesTypesResults = await Promise.all(promises);

    for (const promiseIndex in vehiclesTypesResults) {
      const make = makes[promiseIndex];
      const vehicleTypes = vehiclesTypesResults[promiseIndex];
      let mustBePushed = filter.make
        ? make.makeName.toLowerCase().includes(filter.make.toLocaleLowerCase())
        : true;
      if (!mustBePushed) continue;
      const vehicleTypesParsed = vehicleTypes.map((item) => {
        mustBePushed = filter.type
          ? item.vehicleTypeName
              .toLocaleLowerCase()
              .includes(filter.type.toLocaleLowerCase())
          : true;
        return {
          typeId: item.vehicleTypeId,
          typeName: item.vehicleTypeName,
        };
      });
      if (!mustBePushed) continue;
      parsedResponse.push({
        makeId: make.makeId,
        makeName: make.makeName,
        vehicleTypes: vehicleTypesParsed,
      });
    }

    return parsedResponse;
  }

  async getVehicleMakes(filter: Filter): Promise<VehicleMakeDocument[]> {
    const elementsToReturn = await this.databaseService.getVehicleMakesList(
      filter
    );

    return elementsToReturn;
  }

  async getVehicleTypes(makeId: number): Promise<VehicleTypeDocument[]> {
    let elementsToReturn: VehicleTypeDocument[] = [];
    const typeMakeRelation =
      await this.databaseService.getOneTypeMakeRelationItem(makeId);

    if (typeMakeRelation.typeIds.length === 0) {
      const vehicleTypes = await this.networkService.getVehicleTypes(makeId);
      await Promise.all([
        this.databaseService.saveOneTypeMakeRelationItem({
          makeId,
          typeIds: vehicleTypes.results.map((item) => item.vehicleTypeId),
        }),
        this.databaseService.saveVehicleTypeBulk(vehicleTypes.results),
      ]);
      elementsToReturn = vehicleTypes.results;
    } else {
      const promises = typeMakeRelation.typeIds.map((typeId) =>
        this.databaseService.getOneVehicleTypeItem(typeId)
      );

      elementsToReturn = await Promise.all(promises);
    }

    return elementsToReturn;
  }

  async fillInitialCollectionsData(): Promise<void> {
    const vehiclesMakesApi = await this.networkService.getVehicleMakes();

    if (
      (await this.databaseService.getVehicleMakesTotal()) ===
      vehiclesMakesApi.count
    )
      return;

    const typeMakeRelationInitialData: TypeMakeRelationDocument[] =
      vehiclesMakesApi.results.map((item) => ({
        typeIds: [],
        makeId: item.makeId,
      }));

    await Promise.all([
      await this.databaseService.saveVehicleMakesBulk(vehiclesMakesApi.results),
      await this.databaseService.saveTypeMakeRelationBulk(
        typeMakeRelationInitialData
      ),
    ]);
  }
}
