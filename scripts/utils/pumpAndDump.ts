import { exec } from 'child_process';
import { Connection } from 'typeorm';

import FixtureLoader from './load';
import reset from './reset';

const pumpAndDump = async (connection: Connection, hashDumpFile: string) => {
  let dumpCommand;
  if (process.env.DATABASE_URL) {
    dumpCommand = `pg_dump ${process.env.DATABASE_URL} > ${hashDumpFile}`;
  } else {
    dumpCommand = `docker exec -i ${process.env.POSTGRES_CONTAINER} pg_dump -U ${process.env.POSTGRES_USER} ${process.env.POSTGRES_DB} > ${hashDumpFile}`;
  }

  await reset(connection);
  const fixtureLoader = new FixtureLoader(connection);
  await fixtureLoader.load();

  await new Promise((res, rej) => {
    exec(dumpCommand, (error, stdout, stderr) => {
      if (error) {
        console.log(`error: ${error.message}`);
        rej();
        return;
      }
      if (stderr) {
        console.log(`stderr: ${stderr}`);
        rej();
        return;
      }
      res();
      console.log(`Database dumped in ${hashDumpFile}`);
    });
  });
};

export default pumpAndDump;
