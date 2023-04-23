import { MongoClient, Db } from "mongodb";
import { log } from "arcybot";

type DB = {
  symbol?: string;
  url?: string;
};

export class Database {
  public dbs: Record<string, Db> = {};

  constructor(public config: DB[]) {}

  public init = async () => {
    this.config.forEach(c => this.connectToDbClient(c));
    log.INFO("Database successfully initialized!");
  };

  connectToDbClient = async (db: DB): Promise<void> => {
    try {
      if (!db.url || !db.symbol)
        throw new Error(`Database: SYMBOL or URL missing.`);
      const client = new MongoClient(db.url);
      this.dbs[db.symbol] = client.db(db.symbol);
    } catch (err) {
      log.WARN(`Error while connecting to database: ${err}`);
    }
  };
}
