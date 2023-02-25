import FclService from "./fclService/FclService";

class FlowService {
  async getAllUserCollection(user) {
    const dapperAddress = user?.dapperAddress;
    const bloctoAddress = user?.bloctoAddress;

    const response = await FclService.getAllUserCollections([
      bloctoAddress,
      dapperAddress,
    ]);
    return response;
  }

  async getAllNftsFromAccount(user): Promise<any> {
    const dapperAddress = user?.dapperAddress;
    const bloctoAddress = user?.bloctoAddress;

    const nftCollectionData: any = await FclService.getAllUserNfts([
      bloctoAddress,
      dapperAddress,
    ]);

    return nftCollectionData;
  }
}

export default new FlowService();
