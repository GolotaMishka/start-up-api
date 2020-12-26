import { Connection } from 'typeorm';

import createDbConnection from './createDbConnection';

abstract class ScriptBase {
  public static shouldRunAutomatically = true;
  public connection: Connection;

  public async run(shouldConnect = true, forceRun = false, forceExit = true): Promise<void> {
    if (!ScriptBase.shouldRunAutomatically && !forceRun) {
      return;
    }
    try {
      if (shouldConnect) {
        this.connection = await createDbConnection();
      }
      await this.execute();
      // eslint-disable-next-line no-unused-expressions
      forceExit && process.exit(0);
    } catch (error) {
      console.error(`Error: ${error}\n${error.stack}`);
      process.exit(2);
    }
  }
  public abstract async execute(): Promise<void>;
}

export default ScriptBase;
