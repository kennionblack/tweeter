import { AuthToken, User } from "tweeter-shared";
import { ServerFacade } from "../../server/ServerFacade";

export class FollowService {
  private serverFacade: ServerFacade;

  public constructor() {
    this.serverFacade = new ServerFacade();
  }

  public async loadMoreFollowers(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: User | null
  ): Promise<[User[], boolean]> {
    const request = {
      token: authToken.token,
      userAlias: userAlias,
      pageSize: pageSize,
      lastItem: lastItem == null ? null : lastItem.dto,
    };

    return await this.serverFacade.getMoreFollowers(request);
  }

  public async loadMoreFollowees(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: User | null
  ): Promise<[User[], boolean]> {
    const request = {
      token: authToken.token,
      userAlias: userAlias,
      pageSize: pageSize,
      lastItem: lastItem == null ? null : lastItem.dto,
    };

    return await this.serverFacade.getMoreFollowees(request);
  }

  public async getUser(authToken: AuthToken, alias: string): Promise<User | null> {
    const request = {
      token: authToken.token,
      alias: alias,
    };

    return await this.serverFacade.getUser(request);
  }

  public async unfollow(
    authToken: AuthToken,
    userToUnfollow: User
  ): Promise<[followerCount: number, followeeCount: number]> {
    const request = {
      token: authToken.token,
      user: userToUnfollow.dto,
    };

    return await this.serverFacade.unfollow(request);
  }

  public async follow(
    authToken: AuthToken,
    userToFollow: User
  ): Promise<[followerCount: number, followeeCount: number]> {
    const request = {
      token: authToken.token,
      user: userToFollow.dto,
    };

    return await this.serverFacade.follow(request);
  }

  public async getFollowerCount(authToken: AuthToken, user: User): Promise<number> {
    const request = {
      token: authToken.token,
      user: user.dto,
    };

    return await this.serverFacade.getFollowerCount(request);
  }

  public async getFolloweeCount(authToken: AuthToken, user: User): Promise<number> {
    const request = {
      token: authToken.token,
      user: user.dto,
    };

    return await this.serverFacade.getFolloweeCount(request);
  }

  public async getIsFollowerStatus(
    authToken: AuthToken,
    user: User,
    selectedUser: User
  ): Promise<boolean> {
    const request = {
      token: authToken.token,
      user: user.dto,
      selectedUser: selectedUser.dto,
    };

    return await this.serverFacade.getFollowerStatus(request);
  }
}
