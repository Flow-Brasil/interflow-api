import * as fcl from "@onflow/fcl";
import { getUserCollections_query } from "./scripts/getUserCollections_query";
import { getAllUserNfts_query } from "./scripts/getUserNfts_query";

class FclService {
  async getAllUserNfts(addresses: string[]) {
    let checkedAddresses = addresses.filter(address => address != null && address != undefined && address != "")
    const response = await fcl.query({
      cadence: getAllUserNfts_query,
      args: (arg, t) => [
        arg(checkedAddresses, t.Array(t.Address))
      ],
    });
    return response;
  }

  async getAllUserCollections(addresses: string[]) {
    let checkedAddresses = addresses.filter(address => address != null && address != undefined && address != "")
    const response = await fcl.query({
      cadence: getUserCollections_query,
      args: (arg, t) => [
        arg(checkedAddresses, t.Array(t.Address))
      ],
    });
    return response;
  }
}

export default new FclService();
