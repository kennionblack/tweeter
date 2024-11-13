import { TweeterResponse } from "tweeter-shared/dist/model/net/response/TweeterResponse";
import { StatusService } from "../../model/service/StatusService";
import { PostStatusRequest } from "tweeter-shared";

export const handler = async (request: PostStatusRequest): Promise<TweeterResponse> => {
  const statusService = new StatusService();
  await statusService.postStatus(request.token, request.newStatus);

  return {
    success: true,
    message: null,
  };
};
