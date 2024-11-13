import { StatusDto } from "../../dto/StatusDto";
import { StatusRequest } from "./StatusRequest";

export interface StatusItemRequest extends StatusRequest {
  readonly alias: string;
  readonly pageSize: number;
  readonly lastItem: StatusDto | null;
}
