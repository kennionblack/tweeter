import { FollowService } from "../../model/service/FollowService";
import { FollowRequest, FollowCountResponse } from "tweeter-shared";

export const handler = async (request: FollowRequest): Promise<FollowCountResponse> => {
  const followService = new FollowService();
  let count = await followService.getFolloweeCount(request.token, request.user);

  return {
    success: true,
    message: null,
    count: count,
  };
};
