import { AuthTokenDto } from "../../dto/AuthTokenDto";
import { TweeterRequest } from "./TweeterRequest";

export interface LogoutRequest extends TweeterRequest {
  readonly token: AuthTokenDto;
}
