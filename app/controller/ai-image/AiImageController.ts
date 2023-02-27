import { Leap } from "@leap-ai/sdk";
import { CustomizeNftData } from "app/daos/CustomizeNftData";
import AiImageService from "app/services/ai-image/AiImageService";
import { Request, Response } from "express";

const leap = new Leap("4e9db6fa-b3fe-4023-9eab-c60d857b8240");
leap.usePublicModel("sd-1.5");

class AiImage {
  async customizeNft(req: Request, res: Response): Promise<Response> {
    try {
        const {  nftUuid, nftImageLink, nftCollectionName, nftType, nftContractAddress, prompt } = req.body;
        const customData: CustomizeNftData = {  nftUuid, nftImageLink, nftCollectionName, nftType, nftContractAddress, prompt };
        const customNft = await AiImageService.customizeNft(req.params.id, customData);
        return res.status(200).json(customNft);
    } catch (error) {
      console.log("ERROR", error);
      return res.status(400).json({ message: "Something went wrong customizing your NFT" });
    }
  }

  async getInterflowCustom(req: Request, res: Response): Promise<Response> {
    try {
        const interflowCustom = await AiImageService.getInterflow(req.params.id);
        return res.status(200).json(interflowCustom);
    } catch (error) {
      console.log("ERROR", error);
      return res.status(400).json({ message: "Something went wrong getting interflow custom" });
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
        const interflowCustom = await AiImageService.getAllInterflowCustomFromUser(req.params.id);
        return res.status(200).json(interflowCustom);
    } catch (error) {
      console.log("ERROR", error);
      return res.status(400).json({ message: "Something went wrong getting all interflow custom from user" });
    }
  }

  async revealInterflowCustom(req: Request, res: Response): Promise<Response> {
    try {
        const interflowCustom = await AiImageService.revealInterflowCustom(req.params.id);
        return res.status(200).json(interflowCustom);
    } catch (error) {
      console.log("ERROR", error);
      return res.status(400).json({ message: "Something went wrong revealing your NFT" });
    }
  }

  async allowReveal(req: Request, res: Response): Promise<Response> {
    try {
        const interflowCustom = await AiImageService.allowReveal(req.params.id);
        return res.status(200).json(interflowCustom);
    } catch (error) {
      console.log("ERROR", error);
      return res.status(400).json({ message: "Something went wrong allowing reveal" });
    }
  }
}

export default new AiImage();
