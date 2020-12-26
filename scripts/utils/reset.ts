import '../../src/utils/config';

import ORMConfig from 'ormconfig';
import { Connection } from 'typeorm';

const reset = async (connection: Connection) => {
  await connection.dropDatabase();
  if (ORMConfig.synchronize) {
    await connection.synchronize();
  } else {
    await connection.runMigrations({ transaction: 'all' });
  }
};

export default reset;
