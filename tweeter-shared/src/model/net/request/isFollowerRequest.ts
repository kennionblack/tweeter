import { UserDto } from "../../dto/UserDto";
import { FollowRequest } from "./FollowRequest";

export interface IsFollowerRequest extends FollowRequest {
  selectedUser: UserDto;
}
