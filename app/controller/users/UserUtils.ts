import { Request, Response, NextFunction } from "express";
import { User } from "@models/users/User";
import { sequelize } from "@database/sequelize";
import { UserCompleteData } from "app/daos/UserCompleteData";
import { UserSocialData } from "app/daos/UserSocialData";

class UserUtils {
  //method that generate a random nickname
  public async generateNickname(): Promise<string> {
    const nickname = Math.random().toString(36).substring(7);

    return nickname;
  }

  public async sortUsers(ids: string[]): Promise<string[]> {
    const shuffled = ids.sort(() => 0.5 - Math.random());
    return shuffled;
  }

  public async sortUsersWithData(
    users: UserSocialData[],
    callerCollectionName: string[]
  ): Promise<UserSocialData[]> {
    const sortedUsers = users.sort((a, b) => {
      if (a.nftCollections.some(r => callerCollectionName.includes(r))) {
        return -2;
      } else if (a.nftLength > b.nftLength) {
        return -1;
      } else if (a.nftLength < b.nftLength) {
        return 1;
      } else {
        return 0;
      }
    });

    return sortedUsers;
  }

  public async sortSocialUsers( users: UserSocialData[] ): Promise<UserSocialData[]> {
    const sortedUsers = users.sort((a, b) => {
      if (a.nftLength > b.nftLength) {
        return -1;
      } else if(a.nftLength < b.nftLength) {
        return 1;
      } else {
        return 0;
      }
    });

    return sortedUsers;
  }
}

export default new UserUtils();
