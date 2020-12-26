import './utils/config';
import 'reflect-metadata';

import App from './app';

void (async () => {
  const app = new App();
  await app.createConnection();

  if (!app.connection.options.synchronize) {
    await app.runMigrationsIfNeeded();
  } else {
    console.log('Synchronizing - Make sure you drop the database before migrating!');
  }

  await app.init();
  app.listen();
})();
