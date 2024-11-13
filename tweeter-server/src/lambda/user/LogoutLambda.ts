import { UserService } from "../../model/service/UserService";
import { LogoutRequest, TweeterResponse } from "tweeter-shared";

export const handler = async (request: LogoutRequest): Promise<TweeterResponse> => {
  const userService = new UserService();
  await userService.logout(request.token);

  return {
    success: true,
    message: null,
  };
};
