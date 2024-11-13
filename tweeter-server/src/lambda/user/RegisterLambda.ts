import { UserService } from "../../model/service/UserService";
import { RegisterRequest, LoginResponse } from "tweeter-shared";

export const handler = async (request: RegisterRequest): Promise<LoginResponse> => {
  const userService = new UserService();
  const [user, authToken] = await userService.register(
    request.firstName,
    request.lastName,
    request.alias,
    request.password,
    request.userImageBytes,
    request.imageFileExtension
  );

  return {
    success: true,
    message: null,
    user: user,
    authToken: authToken,
  };
};
