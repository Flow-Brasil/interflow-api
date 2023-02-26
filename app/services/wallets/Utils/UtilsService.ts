import TransactionGenerator from "app/services/ai-image/utils/TransactionGenerator";
import AxiosService from "app/services/axios/AxiosService";

class UtilsService {
  async checkInitializedWallet(wallet: string) {
    try {
      console.log("was hereeee inside check init");
      const data = await TransactionGenerator.generateCheckInitializedWallet(
        wallet
      );
      const result = await AxiosService.post(`/scripts`, data);
      console.log("WAS HERE CHECK WALLET", wallet, result);
      return result;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async initInterflowCustomCollection(interflowAddress: string) {
    try {
      if (
        interflowAddress == "NO-ADDRESS" ||
        interflowAddress == null ||
        interflowAddress == ""
      )
        return "NO-ADDRESS";

      const data =
        await TransactionGenerator.generateInitCustomCollectionTransaction();
      await AxiosService.post(`/accounts/${interflowAddress}/sign`, data);
      const jobId = await AxiosService.post(
        `/accounts/${interflowAddress}/transactions`,
        data
      );

      return jobId;
    } catch (error) {
      console.log(error);
      return error;
    }
  }
}

export default new UtilsService();
