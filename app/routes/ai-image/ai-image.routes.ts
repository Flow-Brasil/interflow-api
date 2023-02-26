import AiImageController from "@controller/ai-image/AiImageController";
import { Router } from "express";

const aiImageRoute = Router();

// ------------ POST REQUESTS
aiImageRoute.post("/image/generate/:id", AiImageController.customizeNft);


export default aiImageRoute;
