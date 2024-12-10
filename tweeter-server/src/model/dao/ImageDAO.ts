import { DAO } from "./DAO";

// string used to parse alias
export interface ImageDAO extends DAO<string> {
  updateImage(oldAlias: string, newAlias: string, newImageString: string): Promise<void>;
  putImage(alias: string, imageString: string): Promise<string>;
  getImageUrl(fileName: string): string;
}
