import * as chalk from 'chalk';
import { Bar } from 'cli-progress';
import * as path from 'path';
import { Connection, Repository } from 'typeorm';
import { Builder, fixturesIterator, IFixture, Loader, Parser, Resolver } from 'typeorm-fixtures-cli/dist';
import EntityBase from 'utils/entities/base';

export default class FixtureLoader {
  private static entities: EntityBase[] = [];

  private connection: Connection;

  constructor(connection: Connection) {
    this.connection = connection;
  }

  public async load() {
    if (FixtureLoader.entities.length > 0) {
      await this.loadExistingEntities();
      return;
    }

    const loader = new Loader();
    loader.load(path.resolve(process.cwd(), 'fixtures'));

    const resolver = new Resolver();
    const fixtures: IFixture[] = resolver.resolve(loader.fixtureConfigs);
    const builder = new Builder(this.connection, new Parser());

    const bar = new Bar({
      format: `${chalk.default.yellow('Progress')}  ${chalk.default.green('[{bar}]')} ${chalk.default.yellow('{percentage}% | ETA: {eta}s | {value}/{total} {name}')} `,
      barCompleteChar: '\u2593',
      barIncompleteChar: '¯\\_(ツ)_/¯   ',
      barsize: 20
    });
    bar.start(fixtures.length, 0, { name: '' });
    for (const fixture of fixturesIterator(fixtures)) {
      const entity = await builder.build(fixture);
      bar.increment(1, { name: fixture.name });

      try {
        const repo = (this.connection as any).getRepository(entity.constructor.name) as Repository<EntityBase>;
        await repo.save(entity);
        FixtureLoader.entities.push(entity as any);
      } catch (error) {
        throw error;
      }
    }
    bar.update(fixtures.length, { name: '' });
    bar.stop();
    return FixtureLoader.entities;
  }

  private async loadExistingEntities() {
    await this.connection.query('SET CONSTRAINTS ALL DEFERRED');
    await this.connection.transaction(manager => Promise.all(FixtureLoader.entities.map(re => manager.insert(re.constructor, re))));
    await this.connection.query('SET CONSTRAINTS ALL IMMEDIATE');
  }
}
