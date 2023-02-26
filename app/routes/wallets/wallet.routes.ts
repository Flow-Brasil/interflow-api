import { Router } from "express";

import WalletController from "@controller/wallets/WalletController";

const walletRoutes = Router();

// ------------ GET REQUESTS
walletRoutes.get("/wallets/getWallets", WalletController.getAllWallets);
walletRoutes.get("/wallets/getAvailableWallets", WalletController.getAllAvailableWallets);
walletRoutes.get("/wallets/getAvailableWalletsLength", WalletController.getAllAvailableWalletsLength);
walletRoutes.get("/wallets/getUsedWallets", WalletController.getAllUsedWallets);
walletRoutes.get("/wallets/getAllJobs", WalletController.getAllJobs);
walletRoutes.get("/wallets/getJob/:id", WalletController.getJob);

// ------------ POST REQUESTS
walletRoutes.post("/wallets/setWalletToUsersWithoutOne", WalletController.setWalletToUsersWithoutOne);
walletRoutes.post("/wallets/createWallet", WalletController.createWallet);
walletRoutes.post("/wallets/webhookJob", WalletController.webhook);


export default walletRoutes;
