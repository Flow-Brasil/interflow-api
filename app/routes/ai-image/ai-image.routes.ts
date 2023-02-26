import AiImageController from "@controller/ai-image/AiImageController";
import { Router } from "express";

const aiImageRoute = Router();

// ------------ POST REQUESTS
aiImageRoute.post("/image/generate/:id", AiImageController.customizeNft);

aiImageRoute.get("/image/getAllInterflowCustom", AiImageController.getAllInterflowCustom);
aiImageRoute.get("/image/getAllInterflowCustomFromUser/:id", AiImageController.getAllInterflowCustomFromUser);


export default aiImageRoute;
