import { User } from "@models/users/User";
import { sequelize } from "@database/sequelize";
import { account } from "@models/Wallet/Account";
import { Op } from "sequelize";
import AxiosService from "../axios/AxiosService";
import TransactionGenerator from "../ai-image/utils/TransactionGenerator";
import { InterflowCustomNft } from "@models/interflow-custom-nft/InterflowCustomNft";
import UtilsService from "./Utils/UtilsService";

const walletRepository = sequelize.getRepository(account);
const userRespository = sequelize.getRepository(User);
const interflowCustomRepository = sequelize.getRepository(InterflowCustomNft);

class WalletService {
  // This method calls the Interflow Wallet API to create a new account
  async createWalletAccount() {
    try {
      const accountJob = await AxiosService.post("/accounts");
      return accountJob;
    } catch (error) {
      console.log("CONNECTION PROBLEM WITH INTERFLOW WALLET API");
    }
  }

  async getHealth() {
    try {
      const health = await AxiosService.get("/health/ready");
      return health;
    } catch (error) {
      console.log("CONNECTION PROBLEM WITH INTERFLOW WALLET API");
    }
  }

  // This method find a available account and set the user id to it
  // If there is 3 or less available account, it will create 3 new accounts
  // and then set the user id to one of them
  // If there is no available account, it will call itself again
  async setWalletAccountToUser(user: User): Promise<string> {
    let availableWalletsLength = (await this.getAllAvailableAccounts()).length;

    let wallet: account | null = null;

    wallet = await walletRepository.findOne({
      where: {
        interflow_user_id: null,
      },
    });

    //OUR IDEA IT'S TO ALWAYS HAVE AT LEAST 10 ACCOUNTS AVAILABLE
    //IF THERE IS LESS THAN 10 ACCOUNTS AVAILABLE, IT WILL CREATE 10 NEW ACCOUNTS
    try {
      if (availableWalletsLength <= 10) {
        if ((await this.getHealth()) != undefined) {
          let x = 0;
          while (x < 3) {
            console.log("Creating wallet account" + x);
            await this.createWalletAccount();
            x++;
          }
        } else {
          console.log(
            " -------- CONNECTION PROBLEM WITH INTERFLOW WALLET API -------- "
          );
        }
      }
    } catch (error) {
      console.log("ERROR ----", error);
    }

    try {
      console.log("WALLET FOUND!? ----", wallet);

      let x = 0;

      if (!wallet) {
        checkWalletExist();

        function checkWalletExist() {
          setTimeout(async function () {
            x++;
            const wallet = await walletRepository.findOne({
              where: {
                interflow_user_id: null,
              },
            });
            if (wallet) {
              await wallet.update({ interflow_user_id: user.dataValues.id });

              //CHECK IF THE WALLET IS INITIALIZED
              let isInit = await UtilsService.checkInitializedWallet(wallet.dataValues.address)

              if(!isInit) {
                const jobId = await UtilsService.initInterflowCustomCollection(wallet.dataValues.address);
                await user.update({
                  interflowAddress: wallet.dataValues.address,
                  interflowCollectionInitializedJobId: jobId.jobId,
                });
                return `WALLET ADDED TO USER! ${user.dataValues.id}`;
              }
                  
              await user.update({
                interflowAddress: wallet.dataValues.address,
                interflowCollectionInitialized: true
              });

              
              console.log(`WALLET ADDED TO USER! ${user.dataValues.id}`);
              return `WALLET ADDED TO USER! ${user.dataValues.id}`;
            } else {
              if (x < 5) {
                console.log("NULL WALLET FOUND NOT FOUND!");
                checkWalletExist();
              } else {
                console.log("FINISHED PROCESS ------------- WALLET NOT FOUND!");
                //We can add a function that call a notification system
                //To let admin know that there is no wallet available
                return "ADDRESS-ERROR";
              }
            }
          }, 5000);
        }
      } else {
        await wallet.update({ interflow_user_id: user.dataValues.id });

        //CHECK IF THE WALLET IS INITIALIZED
        const isInit = await UtilsService.checkInitializedWallet(wallet.dataValues.address)
              if(!isInit) {
                const jobId = await UtilsService.initInterflowCustomCollection(wallet.dataValues.address);
                await user.update({
                  interflowAddress: wallet.dataValues.address,
                  interflowCollectionInitializedJobId: jobId.jobId,
                });
                return `WALLET ADDED TO USER! ${user.dataValues.id}`;
              }
                  
              await user.update({
                interflowAddress: wallet.dataValues.address,
                interflowCollectionInitialized: true
              });

        return wallet.address;
      }
    } catch (error) {
      await user.update({ interflowAddress: "NO-ADDRESS" });
      console.log(`WALLET ADDED TO USER! ${user.dataValues.id}`);
    }
  }

  async setWalletToUsersWithoutOne() {
    const usersWithoutWallet = await userRespository.findAll({
      where: {
        interflowAddress: "ADDRESS-ERROR",
      },
    });

    const wallets = await walletRepository.findAll({
      where: {
        interflow_user_id: null,
      },
    });

    //create a for of getting the index of the array
    //and then use the index to get the wallet
    for (let i = 0; i < usersWithoutWallet.length; i++) {
      if (wallets[i]) {
        await wallets[i].update({
          interflow_user_id: usersWithoutWallet[i].id,
        });
        await usersWithoutWallet[i].update({
          interflowAddress: wallets[i].address,
        });
        console.log(
          `WALLET ${wallets[i].address} ADDED TO USER! ${usersWithoutWallet[i].id}}`
        );
      } else {
        console.log("NO WALLET FOUND!");
      }
    }
  }

  async getAllJobs() {
    const jobs = await AxiosService.get("/jobs");
    return jobs;
  }

  async getJobById(id: string) {
    const job = await AxiosService.get(`/jobs/${id}`);
    return job;
  }

  async getAllWallets() {
    const wallets = await walletRepository.findAll();
    return wallets;
  }

  async getAllUsedWallets() {
    const wallets = await walletRepository.findAll({
      where: {
        interflow_user_id: {
          [Op.not]: null,
        },
      },
    });

    return wallets;
  }

  // This method returns the number of available accounts
  async getAllAvailableAccounts() {
    try {
      const walletsWithNullUserId = await walletRepository.findAll({
        where: {
          interflow_user_id: null,
        },
      });

      return walletsWithNullUserId;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  // --------------------------------------------
  // WEBHOOK ---------------------------
  // --------------------------------------------
  async getWebhook(jobId: string, type: string, state: string) {
    try {
      if (state == "COMPLETE" && type == "transaction") {
        console.log("JOB ID WAS HERE ----", jobId);
        const interflowCustom = await interflowCustomRepository.findOne({
          where: {
            [Op.or]: [{ jobId: jobId }, { revealJobId: jobId }],
          },
        });

        if (interflowCustom) {
          if (interflowCustom.dataValues.minted) {
            await interflowCustom.update({ revealed: true });
            return interflowCustom;
          } else {
            await interflowCustom.update({ minted: true });
            return interflowCustom;
          }
        }

        console.log('WAS HERE ----- SEARCHING USER! --------- ')
        const user = await userRespository.findOne({
          where: {
            interflowCollectionInitializedJobId: jobId,
          },
        });

        if (user) {
          await user.update({ interflowCollectionInitialized: true });
          return user;
        } else {
          return "ANY INTERFLOW CUSTOM OR USER FOUND";
        }
      }
    } catch (error) {
      console.log("ERROR -----", error);
      return error;
    }
  }

  // --------------------------------------------
  // INTERFLOW CUSTOM ---------------------------
  // --------------------------------------------

  async mintInterflowCustom(
    userInterflowAddress: string,
    nftCollectionName: string,
    nftImageLink: string,
    nftUuid: string
  ) {
    try {
      if (
        userInterflowAddress == "NO-ADDRESS" ||
        userInterflowAddress == null ||
        userInterflowAddress == ""
      )
        return "NO-ADDRESS";

      const ADMIN_ADDRESS = "0xfe514356a985ec2a";
      const data = await TransactionGenerator.generateMintCustomNftTransaction(
        nftCollectionName,
        nftImageLink,
        nftUuid,
        userInterflowAddress
      );
      await AxiosService.post(`/accounts/${ADMIN_ADDRESS}/sign`, data);
      const jobId = await AxiosService.post(
        `/accounts/${ADMIN_ADDRESS}/transactions`,
        data
      );

      return jobId;
    } catch (error) {
      console.log(error);
      return error;
    }
  }
}

export default new WalletService();
