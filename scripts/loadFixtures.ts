import FixtureLoader from './utils/load';
import reset from './utils/reset';
import ScriptBase from './utils/scriptBase';

class LoadFixtures extends ScriptBase {
  public async execute(): Promise<void> {
    console.log('Clearing database');
    await reset(this.connection);

    console.log('Loading fixtures');
    const fixtureLoader = new FixtureLoader(this.connection);
    await fixtureLoader.load();

    await this.connection.close();
  }
}

new LoadFixtures().run();
