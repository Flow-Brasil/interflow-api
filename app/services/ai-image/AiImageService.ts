import AxiosService from "../axios/AxiosService";
import { sequelize } from "@database/sequelize";
import { InterflowCustomNft } from "@models/interflow-custom-nft/InterflowCustomNft";
import { User } from "@models/users/User";
import { CustomizeNftData } from "app/daos/CustomizeNftData";
import WalletService from "../wallets/WalletService";
import UserService from "../users/UserService";

const userRepository = sequelize.getRepository(User);
const interflowCustomRepository = sequelize.getRepository(InterflowCustomNft);

class AiImageService {
  async customizeNft(id: string, nftData: CustomizeNftData): Promise<any> {
    try {
      const user = await UserService.findUserDataValue(id);
      if(!user) {
        return "User not found"
      }
      const userInterflowAddress = user.interflowAddress;

      const interflowCustom = await interflowCustomRepository.create({
        customNftId: "",
        customNftUuid: nftData.nftUuid,
        aiGeneratedImage: false,
        customNftImageLink: "",
        originalNftImageLink: nftData.nftImageLink,
        originalNftCollectionName: nftData.nftCollectionName,
        originalNftType: nftData.nftType,
        minted: false,
        jobId: "",
        revealJobId: "",
        readyToReveal: false,
        revealed: false,
        userInterflowAddress: userInterflowAddress,
        userId: id,
        user: user,
      });

      const jobId = await WalletService.mintInterflowCustom(
        userInterflowAddress,
        nftData.nftCollectionName,
        nftData.nftImageLink,
        nftData.nftUuid
      );

      console.log("JOBID", jobId)

      
      await interflowCustom.update({ jobId: jobId.jobId })

      return interflowCustom;
    } catch (error) {
      console.log("ERROR", error);
      return error;
    }
  }

  async updateMintedInterflowCustom(jobId: string){
    const interflowCustom = await interflowCustomRepository.findOne({
      where: {
        jobId: jobId,
      },
    });

  }

  async revealInterflowCustom(
    id: string,
    customNftImageLink: any
  ): Promise<any> {
    try {
      const interflowCustom = await interflowCustomRepository.findByPk(id);
      const data = {
        code: "",
        arguments: [],
      };

      interflowCustom.customNftImageLink = customNftImageLink;
      interflowCustom.aiGeneratedImage = true;
      interflowCustom.readyToReveal = true;
      interflowCustom.jobId = "";

      interflowCustom.revealed = false;
      interflowCustom.minted = false;
      await interflowCustom.save();
      return interflowCustom;
    } catch (error) {
      console.log("ERROR", error);
      return error;
    }
  }

  async getAllInterflowCustom() {
    const interflowCustom = await interflowCustomRepository.findAll();
    return interflowCustom;
  }

  async getAllInterflowCustomFromUser(id: string) {
    const interflowCustom = await interflowCustomRepository.findAll({
      where: {
        userId: id,
      },
    });
    return interflowCustom;
  }
}

export default new AiImageService();
