import { ImageDAO } from "../ImageDAO";

export class ImageDAOS3 implements ImageDAO {
  readonly tableName = "images";
  async put(type: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
  async get(type: string): Promise<string> {
    throw new Error("Method not implemented.");
  }
  async delete(type: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
  async update(oldType: string, newType: string): Promise<void> {
    throw new Error("Method not implemented.");
  }

  public async getImageByAlias(alias: string): Promise<string> {
    throw new Error("Method not implemented.");
  }
}
