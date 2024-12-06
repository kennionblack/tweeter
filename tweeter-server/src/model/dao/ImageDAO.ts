import { DAO } from "./DAO";

// string used to parse alias
export interface ImageDAO extends DAO<string> {
  getImageByAlias(alias: string): Promise<string>;
}
