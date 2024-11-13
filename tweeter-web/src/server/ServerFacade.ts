import {
  AuthToken,
  FollowCountResponse,
  FollowRequest,
  FollowResponse,
  GetUserRequest,
  GetUserResponse,
  IsFollowerRequest,
  IsFollowerResponse,
  LoginRequest,
  LoginResponse,
  LogoutRequest,
  PagedUserItemRequest,
  PagedUserItemResponse,
  PostStatusRequest,
  RegisterRequest,
  Status,
  StatusItemRequest,
  StatusItemResponse,
  TweeterResponse,
  User,
} from "tweeter-shared";
import { ClientCommunicator } from "./ClientCommunicator";

export class ServerFacade {
  private SERVER_URL = "https://jwf145mdj0.execute-api.us-west-2.amazonaws.com/dev";

  private clientCommunicator = new ClientCommunicator(this.SERVER_URL);

  public async getMoreFollowees(request: PagedUserItemRequest): Promise<[User[], boolean]> {
    const response = await this.clientCommunicator.doPost<
      PagedUserItemRequest,
      PagedUserItemResponse
    >(request, "/followee/list");

    // Convert the UserDto array returned by ClientCommunicator to a User array
    const items: User[] | null =
      response.success && response.items
        ? response.items.map((dto) => User.fromDto(dto) as User)
        : null;

    // Handle errors
    if (response.success) {
      if (items == null) {
        throw new Error(`No followees found`);
      } else {
        return [items, response.hasMore];
      }
    } else {
      console.error(response);
      throw new Error(response.message ?? "An unknown error occurred");
    }
  }

  public async getMoreFollowers(request: PagedUserItemRequest): Promise<[User[], boolean]> {
    const response = await this.clientCommunicator.doPost<
      PagedUserItemRequest,
      PagedUserItemResponse
    >(request, "/follower/list");

    // Convert the UserDto array returned by ClientCommunicator to a User array
    const items: User[] | null =
      response.success && response.items
        ? response.items.map((dto) => User.fromDto(dto) as User)
        : null;

    // Handle errors
    if (response.success) {
      if (items == null) {
        throw new Error(`No followers found`);
      } else {
        return [items, response.hasMore];
      }
    } else {
      console.error(response);
      throw new Error(response.message ?? "An unknown error occurred when getting followers");
    }
  }

  public async getUser(request: GetUserRequest): Promise<User | null> {
    const response = await this.clientCommunicator.doPost<GetUserRequest, GetUserResponse>(
      request,
      "/user"
    );

    const user: User | null =
      response.success && response.user ? User.fromDto(response.user) : null;

    if (response.success) {
      if (user === null) {
        throw new Error("No user found");
      } else {
        return user;
      }
    } else {
      console.error(response);
      throw new Error(response.message ?? "An unknown error occurred when getting user");
    }
  }

  public async follow(
    request: FollowRequest
  ): Promise<[followerCount: number, followeeCount: number]> {
    const response = await this.clientCommunicator.doPost<FollowRequest, FollowResponse>(
      request,
      "/user/follow"
    );

    if (response.success) {
      // TODO: add checks for values of followerCount and followeeCount
      return [response.followerCount, response.followeeCount];
    } else {
      console.error(response);
      throw new Error(response.message ?? "An unknown error occurred when following user");
    }
  }

  public async unfollow(
    request: FollowRequest
  ): Promise<[followerCount: number, followeeCount: number]> {
    const response = await this.clientCommunicator.doPost<FollowRequest, FollowResponse>(
      request,
      "/user/unfollow"
    );

    if (response.success) {
      // TODO: add checks for values of followerCount and followeeCount
      return [response.followerCount, response.followeeCount];
    } else {
      console.error(response);
      throw new Error(response.message ?? "An unknown error occurred when unfollowing user");
    }
  }

  public async getFollowerCount(request: FollowRequest): Promise<number> {
    const response = await this.clientCommunicator.doPost<FollowRequest, FollowCountResponse>(
      request,
      "/follower/count"
    );

    if (response.success) {
      return response.count;
    } else {
      console.error(response);
      throw new Error(
        response.message ?? "An unknown error occurred when retrieving follower count"
      );
    }
  }

  public async getFolloweeCount(request: FollowRequest): Promise<number> {
    const response = await this.clientCommunicator.doPost<FollowRequest, FollowCountResponse>(
      request,
      "/followee/count"
    );

    if (response.success) {
      return response.count;
    } else {
      console.error(response);
      throw new Error(
        response.message ?? "An unknown error occurred when retrieving followee count"
      );
    }
  }

  public async getFollowerStatus(request: IsFollowerRequest): Promise<boolean> {
    const response = await this.clientCommunicator.doPost<IsFollowerRequest, IsFollowerResponse>(
      request,
      "/follower/isFollower"
    );

    if (response.success) {
      return response.isFollower;
    } else {
      console.error(response);
      throw new Error(
        response.message ?? "An unknown error occurred when determining follower status"
      );
    }
  }

  public async postStatus(request: PostStatusRequest): Promise<void> {
    const response = await this.clientCommunicator.doPost<PostStatusRequest, TweeterResponse>(
      request,
      "/status/post"
    );

    if (!response.success) {
      console.error(response);
      throw new Error(response.message ?? "An unknown error occurred when posting status");
    }
  }

  public async loadMoreStoryItems(request: StatusItemRequest): Promise<[Status[], boolean]> {
    const response = await this.clientCommunicator.doPost<StatusItemRequest, StatusItemResponse>(
      request,
      "/status/story"
    );

    const items: Status[] | null =
      response.success && response.items
        ? response.items.map((dto) => Status.fromDto(dto) as Status)
        : null;

    if (response.success) {
      if (items === null) {
        throw new Error("No more story items found");
      } else {
        return [items, response.hasMore];
      }
    } else {
      console.error(response);
      throw new Error(response.message ?? "An unknown error occurred when loading story items");
    }
  }

  public async loadMoreFeedItems(request: StatusItemRequest): Promise<[Status[], boolean]> {
    const response = await this.clientCommunicator.doPost<StatusItemRequest, StatusItemResponse>(
      request,
      "/status/feed"
    );

    const items: Status[] | null =
      response.success && response.items
        ? response.items.map((dto) => Status.fromDto(dto) as Status)
        : null;

    if (response.success) {
      if (items === null) {
        throw new Error("No more feed items found");
      } else {
        return [items, response.hasMore];
      }
    } else {
      console.error(response);
      throw new Error(response.message ?? "An unknown error occurred when loading feed items");
    }
  }

  public async login(request: LoginRequest): Promise<[User, AuthToken]> {
    const response = await this.clientCommunicator.doPost<LoginRequest, LoginResponse>(
      request,
      "/user/login"
    );

    const user = User.fromDto(response.user);
    const authToken = AuthToken.fromDto(response.authToken);

    if (response.success) {
      if (user === null || authToken === null) {
        throw new Error("Login failed");
      } else {
        return [user, authToken];
      }
    } else {
      console.error(response);
      throw new Error(response.message ?? "An unknown error occurred when logging in");
    }
  }

  public async logout(request: LogoutRequest): Promise<void> {
    const response = await this.clientCommunicator.doPost<LogoutRequest, TweeterResponse>(
      request,
      "/user/logout"
    );

    if (!response.success) {
      console.error(response);
      throw new Error(response.message ?? "An unknown error occurred when logging out");
    }
  }

  public async register(request: RegisterRequest): Promise<[User, AuthToken]> {
    const response = await this.clientCommunicator.doPost<RegisterRequest, LoginResponse>(
      request,
      "/user/register"
    );

    const user = User.fromDto(response.user);
    const authToken = AuthToken.fromDto(response.authToken);

    if (response.success) {
      if (user === null || authToken === null) {
        throw new Error("Register failed");
      } else {
        return [user, authToken];
      }
    } else {
      console.error(response);
      throw new Error(response.message ?? "An unknown error occurred when registering");
    }
  }
}
