import { FollowService } from "../../model/service/FollowService";
import { IsFollowerRequest, IsFollowerResponse } from "tweeter-shared";

export const handler = async (request: IsFollowerRequest): Promise<IsFollowerResponse> => {
  const followService = new FollowService();
  let isFollower: boolean = await followService.getIsFollowerStatus(
    request.token,
    request.user,
    request.selectedUser
  );

  return {
    success: true,
    message: null,
    isFollower: isFollower,
  };
};
