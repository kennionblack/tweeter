import { User, UserDto } from "tweeter-shared";
import { Follow } from "../Follow";
import { DataPage } from "../DataPage";
import { Service } from "./Service";

const MAX_DATA_PAGE_SIZE = 100;

export class FollowService extends Service {
  public async loadMoreFollowers(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    await this.authorize(token);
    const lastFolloweeHandle = lastItem ? lastItem.alias : undefined;
    const dataPage = await this.followDAO.getPageOfFollowees(
      userAlias,
      pageSize,
      lastFolloweeHandle
    );

    const hasMore = dataPage.hasMorePages;
    return [await this.convertDataPageToUserDtos(dataPage, true), hasMore];
  }

  public async loadMoreFollowees(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    await this.authorize(token);
    const lastFollowerHandle = lastItem ? lastItem.alias : undefined;
    const dataPage = await this.followDAO.getPageOfFollowers(
      userAlias,
      pageSize,
      lastFollowerHandle
    );

    const hasMore = dataPage.hasMorePages;
    return [await this.convertDataPageToUserDtos(dataPage, false), hasMore];
  }

  private async convertDataPageToUserDtos(
    dataPage: DataPage<Follow>,
    isFollower: boolean
  ): Promise<UserDto[]> {
    const userDtos = await Promise.all(
      dataPage.values.map(async (follow) => this.convertFollowToUser(follow, isFollower))
    );

    return userDtos;
  }

  public async getUser(token: string, alias: string): Promise<UserDto | null> {
    await this.authorize(token);
    // default time inserted as only the token is needed in search but the function requires an AuthToken
    let foundUser = await this.followDAO.getByAlias(alias);
    if (foundUser === null) {
      return null;
    } else {
      return foundUser.dto;
    }
  }

  async convertFollowToUser(follow: Follow, isFollower: boolean): Promise<UserDto> {
    let handle: string;
    if (isFollower) {
      handle = follow.follower_handle;
    } else {
      handle = follow.followee_handle;
    }

    const userInfo = await this.userDAO.getUserByAlias(handle);
    let user = new User(userInfo.firstName, userInfo.lastName, userInfo.alias, userInfo.imageUrl);
    return user.dto;
  }

  public async unfollow(
    token: string,
    userToUnfollow: UserDto
  ): Promise<[followerCount: number, followeeCount: number]> {
    await this.authorize(token);

    this.followDAO.delete(new Follow(userToUnfollow.alias, "", "", ""));

    const followerCount = await this.getFollowerCount(token, userToUnfollow);
    const followeeCount = await this.getFolloweeCount(token, userToUnfollow);

    return [followerCount, followeeCount];
  }

  public async follow(
    token: string,
    userToFollow: UserDto
  ): Promise<[followerCount: number, followeeCount: number]> {
    await this.authorize(token);

    this.followDAO.put(new Follow(userToFollow.alias, "", "", ""));

    const followerCount = await this.getFollowerCount(token, userToFollow);
    const followeeCount = await this.getFolloweeCount(token, userToFollow);

    return [followerCount, followeeCount];
  }

  public async getFollowerCount(token: string, user: UserDto): Promise<number> {
    await this.authorize(token);

    // This is a stupid way to do this but it should work for now
    let dataPage = await this.followDAO.getPageOfFollowers(
      user.alias,
      MAX_DATA_PAGE_SIZE,
      undefined
    );
    let count = dataPage.values.length;
    while (dataPage.hasMorePages) {
      dataPage = await this.followDAO.getPageOfFollowers(
        user.alias,
        MAX_DATA_PAGE_SIZE,
        dataPage.values[dataPage.values.length - 1].follower_handle
      );
      count += dataPage.values.length;
    }
    return count;
  }

  public async getFolloweeCount(token: string, user: UserDto): Promise<number> {
    await this.authorize(token);

    let dataPage = await this.followDAO.getPageOfFollowees(
      user.alias,
      MAX_DATA_PAGE_SIZE,
      undefined
    );
    let count = dataPage.values.length;
    while (dataPage.hasMorePages) {
      dataPage = await this.followDAO.getPageOfFollowees(
        user.alias,
        MAX_DATA_PAGE_SIZE,
        dataPage.values[dataPage.values.length - 1].followee_handle
      );
      count += dataPage.values.length;
    }
    return count;
  }

  public async getIsFollowerStatus(
    token: string,
    user: UserDto,
    selectedUser: UserDto
  ): Promise<boolean> {
    await this.authorize(token);

    try {
      const dataPage = await this.followDAO.get(new Follow(user.alias, "", selectedUser.alias, ""));
      return true;
    } catch (error) {
      return false;
    }
  }
}
