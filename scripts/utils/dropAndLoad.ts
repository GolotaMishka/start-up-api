import { exec } from 'child_process';
import * as fs from 'fs-extra';
import * as hashFiles from 'hash-files';
import { Connection } from 'typeorm';

import pumpAndDump from './pumpAndDump';

const generateHash = () =>
  new Promise((res, rej) => {
    hashFiles({ files: ['./fixtures/**', './src/entities/**'] }, (error, hash) => {
      if (error) {
        console.log(`error: ${error.message}`);
        rej();
        return;
      }
      res(hash);
    });
  });

const dropAndLoad = async (connection: Connection) => {
  const hash = await generateHash();
  const dumpFolder = './src/assets/dumps';
  const hashDumpFile = `${dumpFolder}/${hash}.sql`;
  if (!fs.existsSync(hashDumpFile)) {
    console.log('Changes in fixtures or entities found');
    fs.emptyDirSync(dumpFolder);
    fs.writeFileSync(`${dumpFolder}/.gitkeep`, '!.gitignore');
    await pumpAndDump(connection, hashDumpFile);
  }

  await connection.dropDatabase();

  let loadCommand;
  if (process.env.DATABASE_URL) {
    loadCommand = `psql ${process.env.DATABASE_URL} < ${hashDumpFile}`;
  } else {
    loadCommand = `docker exec -i ${process.env.POSTGRES_CONTAINER} psql -U ${process.env.POSTGRES_USER} -d ${process.env.POSTGRES_DB} < ${hashDumpFile}`;
  }

  await new Promise((res, rej) =>
    exec(loadCommand, (error, stdout, stderr) => {
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
    })
  );
};

export default dropAndLoad;
