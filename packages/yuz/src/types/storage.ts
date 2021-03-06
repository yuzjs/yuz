export type TypeStorageOptions = {
  baseDir: string
}

export type TypeStorageInitOptions = {
  force: boolean;
}

export type TypeStorageQueryListParams = {
  current: number,
  size: number,
  desc: boolean
}

export type TypeStorageQueryListResult = {
  total: number,
  items: TypeStorageItem[],
}


export interface TypeStorage {
  init(opts?: TypeStorageInitOptions): void;
  createItem(item: TypeStorageItem): string|null;
  updateItem(item: TypeStorageItem): boolean;
  queryItem(uuid: string): TypeStorageItem|null;
  queryList(params: TypeStorageQueryListParams): TypeStorageQueryListResult;
  deleteItem(uuid: string): void;
  count(): number;
}

export type TypeStorageItem = {
  uuid?: string;
  name: string;
  content: string;
  creator: string;
  createTime?: number;
  lastTime?: number;
}