import { StatusDto } from "../../dto/StatusDto";
import { StatusRequest } from "./StatusRequest";

export interface PostStatusRequest extends StatusRequest {
  newStatus: StatusDto;
}
