import { Connection, createConnection } from 'typeorm';
import config from '../../src/ormconfig';

const createDbConnection = async (): Promise<Connection> => {
  try {
    return await createConnection(config);
  } catch (up) {
    console.log('Error while connecting to the database', up);
    throw up;
  }
};

export default createDbConnection;
