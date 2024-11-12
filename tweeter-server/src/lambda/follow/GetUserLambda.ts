import { FollowService } from "../../model/service/FollowService";
import { UserDto, GetUserRequest, GetUserResponse } from "tweeter-shared";

export const handler = async (request: GetUserRequest): Promise<GetUserResponse> => {
  const followService = new FollowService();
  let user: UserDto | null = await followService.getUser(request.token, request.alias);

  return {
    success: true,
    message: null,
    user: user,
  };
};
