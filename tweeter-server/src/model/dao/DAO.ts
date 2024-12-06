export interface DAO<T> {
  readonly tableName: string;
  //readonly indexName: string;

  put(type: T): Promise<void>;
  get(type: T): Promise<T>;
  delete(type: T): Promise<void>;
  update(oldType: T, newType: T): Promise<void>;
}
