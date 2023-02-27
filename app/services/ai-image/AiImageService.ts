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
      const user = await UserService.getUser(id);
      if (!user) {
        return "User not found";
      }
      console.log("USER", user);
      let userTokens = user.dataValues.interflowTokens;

      if (userTokens < 10) {
        return {
          status: "FAILED",
          message: "You don't have enough tokens to mint this NFT",
        };
      }

      const userInterflowAddress = user.dataValues.interflowAddress;
      const nftId = (await interflowCustomRepository.findAll()).length + 1;

      const interflowCustom = await interflowCustomRepository.create({
        customNftId: nftId.toString(),
        customNftUuid: nftData.nftUuid,
        aiGeneratedImage: false,
        customNftImageLink: "",
        originalNftImageLink: nftData.nftImageLink,
        originalNftCollectionName: nftData.nftCollectionName,
        originalNftType: nftData.nftType,
        prompt: nftData.prompt,
        minted: false,
        jobId: "",
        revealJobId: "",
        readyToReveal: false,
        revealed: false,
        userInterflowAddress: userInterflowAddress,
        userId: id,
        user: user.dataValues,
      });

      const jobId = await WalletService.mintInterflowCustom(
        nftId.toString(),
        userInterflowAddress,
        nftData.nftCollectionName,
        nftData.nftImageLink,
        nftData.nftUuid
      );

      console.log("JOBID", jobId);

      await interflowCustom.update({ jobId: jobId.jobId });
      await user.update({ interflowTokens: userTokens - 10 });

      return {user: user.dataValues};
    } catch (error) {
      console.log("ERROR", error);
      return error;
    }
  }

  async revealInterflowCustom(id: string): Promise<any> {
    try {
      const interflowCustom = await interflowCustomRepository.findByPk(id);

      if (!interflowCustom) {
        return "Interflow Custom not found";
      }

      let readyToReveal = interflowCustom.dataValues.readyToReveal;

      if (!readyToReveal) {
        return "Not ready to reveal";
      }

      let customNftLink = `https://interflow-app.s3.amazonaws.com/${interflowCustom.dataValues.customNftId}.png`;

      const revealJobId = await WalletService.revealInterflowCustom(
        interflowCustom.dataValues.userInterflowAddress,
        interflowCustom.dataValues.customNftId
      );
      await interflowCustom.update({
        revealJobId: revealJobId.jobId,
        customNftImageLink: customNftLink,
      });

      return interflowCustom;
    } catch (error) {
      console.log("ERROR", error);
      return error;
    }
  }

  async allowReveal(id: string): Promise<any> {
    try {
      const interflowCustom = await interflowCustomRepository.findByPk(id);

      if (!interflowCustom) {
        return "Interflow Custom not found";
      }

      await interflowCustom.update({ readyToReveal: true });
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
