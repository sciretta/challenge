import { Injectable, OnModuleInit } from "@nestjs/common";
import { Filter, VehicleDTO } from "./vehicle.dto";
import { NetworkService } from "../../providers/network/network.service";
import { DatabaseService } from "../../providers/database/database.service";
import { VehicleMake } from "../../common/types";

@Injectable()
export class VehicleService implements OnModuleInit {
  constructor(
    private networkService: NetworkService,
    private databaseService: DatabaseService
  ) {}

  async onModuleInit() {
    await this.fillVehicleMakesCollection();
    console.log("VehicleMakes collection updated");
  }

  async getVehicles(filter: Filter): Promise<VehicleDTO[]> {
    await this.getVehicleMakes(filter);
    return [];
  }

  private async getVehicleMakes(filter: Filter): Promise<VehicleMake[]> {
    let elementsToReturn: VehicleMake[] = [];
    if (!this.databaseService.isVehicleMakesDBUpdated()) {
      elementsToReturn = await this.fillVehicleMakesCollection();
    } else {
      elementsToReturn = await this.databaseService.getVehicleMakesList();
    }

    console.log(elementsToReturn.length);

    return elementsToReturn;
  }

  private async fillVehicleMakesCollection(): Promise<VehicleMake[]> {
    const totalElementInCollectionPromise =
      this.databaseService.getVehicleMakesTotal();
    const vehiclesMakesApiPromise = this.networkService.getVehicleMakes();

    const [totalElementInCollection, vehiclesMakesApi] = await Promise.all([
      totalElementInCollectionPromise,
      vehiclesMakesApiPromise,
    ]);

    if (totalElementInCollection !== vehiclesMakesApi.count) {
      var { results } = vehiclesMakesApi;
      await this.databaseService.saveVehicleMakesBulk(results);
    }
    this.databaseService.setLastUpdateVehicleMake();

    return results;
  }
}
