import { Leap } from "@leap-ai/sdk";
import { CustomizeNftData } from "app/daos/CustomizeNftData";
import AiImageService from "app/services/ai-image/AiImageService";
import { Request, Response } from "express";

const leap = new Leap("4e9db6fa-b3fe-4023-9eab-c60d857b8240");
leap.usePublicModel("sd-1.5");

class AiImage {
  async customizeNft(req: Request, res: Response): Promise<Response> {
    try {
        const { userInterflowAddress, nftUuid, nftImageLink, nftCollectionName, nftType, nftContractAddress } = req.body;
        const customData: CustomizeNftData = { nftUuid, nftImageLink, nftCollectionName, nftType, nftContractAddress };
        const customNft = await AiImageService.customizeNft(req.body.id, customData);
        return res.status(200).json(customNft);
    } catch (error) {
      console.log("ERROR", error);
      return res.status(400).json({ message: "Something went wrong customizing your NFT" });
    }
  }

  async getAllInterflowCustom(req: Request, res: Response): Promise<Response> {
    try {
        const interflowCustom = await AiImageService.getAllInterflowCustom();
        return res.status(200).json(interflowCustom);
    } catch (error) {
      console.log("ERROR", error);
      return res.status(400).json({ message: "Something went wrong getting all interflow custom" });
    }
  }

  async getAllInterflowCustomFromUser(req: Request, res: Response): Promise<Response> {
    try {
        const interflowCustom = await AiImageService.getAllInterflowCustomFromUser(req.body.id);
        return res.status(200).json(interflowCustom);
    } catch (error) {
      console.log("ERROR", error);
      return res.status(400).json({ message: "Something went wrong getting all interflow custom from user" });
    }
  }
}

export default new AiImage();
