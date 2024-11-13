import { FollowService } from "../../model/service/FollowService";
import { FollowRequest, FollowResponse } from "tweeter-shared";

export const handler = async (request: FollowRequest): Promise<FollowResponse> => {
  const followService = new FollowService();
  let [followerCount, followeeCount] = await followService.unfollow(request.token, request.user);

  return {
    success: true,
    message: null,
    followerCount: followerCount,
    followeeCount: followeeCount,
  };
};
