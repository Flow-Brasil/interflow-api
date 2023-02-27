import AiImageController from "@controller/ai-image/AiImageController";
import { Router } from "express";

const aiImageRoute = Router();

// ------------ POST REQUESTS
aiImageRoute.post("/image/generate/:id", AiImageController.customizeNft);
aiImageRoute.post("/image/reveal/:id", AiImageController.revealInterflowCustom);
aiImageRoute.post("/image/allowReveal/:id", AiImageController.allowReveal);

aiImageRoute.get("/image/getAllInterflowCustom", AiImageController.getAllInterflowCustom);
aiImageRoute.get("/image/getAllInterflowCustomFromUser/:id", AiImageController.getAllInterflowCustomFromUser);
aiImageRoute.get("/image/getInterflow/:id", AiImageController.getInterflowCustom);


export default aiImageRoute;
