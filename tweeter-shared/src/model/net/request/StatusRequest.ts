import { TweeterRequest } from "./TweeterRequest";

export interface StatusRequest extends TweeterRequest {
  readonly token: string;
}
