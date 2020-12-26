import * as fs from 'fs';
import * as path from 'path';

const write = (name: string, body: string) =>
  new Promise((resolve, reject) => {
    fs.writeFile(path.join(__dirname, '../../src', name), body, err => {
      if (err) reject();
      resolve();
    });
  });

export default write;
