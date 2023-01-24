export enum Database {
  Mongo,
  Postgres,
  MySQL,
}

export interface ConnectionOptions {
  type: Database;
}
