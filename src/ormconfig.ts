import { ConnectionOptions, DefaultNamingStrategy, Table } from 'typeorm';

let config: ConnectionOptions = {
  type: 'postgres',
  entities: [`${__dirname}/**/*.entity{.ts,.js}`],
  subscribers: [`${__dirname}/**/*.subscriber{.ts,.js}`],
  synchronize: process.env.POSTGRES_USE_MIGRATIONS === 'false',
  migrations: [`${__dirname}/**/migrations/*{.ts,.js}`],
  namingStrategy: new (class CustomNamingStrategy extends DefaultNamingStrategy {
    public foreignKeyName(tableOrName: Table | string, columnNames: string[]): string {
      return `FK_${this.getSuffix(tableOrName, columnNames)}`;
    }

    public primaryKeyName(tableOrName: Table | string, columnNames: string[]): string {
      return `PK_${this.getSuffix(tableOrName, columnNames)}`;
    }
    public uniqueConstraintName(tableOrName: Table | string, columnNames: string[]): string {
      return `UC_${this.getSuffix(tableOrName, columnNames)}`;
    }

    private getSuffix(tableOrName: Table | string, columnNames: string[]) {
      const clonedColumnNames = [...columnNames];
      clonedColumnNames.sort();
      const tableName = tableOrName instanceof Table ? tableOrName.name : tableOrName;
      return `${tableName}_${clonedColumnNames.join('_')}`;
    }
  })(),
  cli: {
    entitiesDir: 'src/entities',
    migrationsDir: 'src/migrations',
    subscribersDir: 'src/subscribers',
  },
};

config = {
  ...config,
  ...(process.env.DATABASE_URL
    ? {
        url: process.env.DATABASE_URL,
        ssl: process.env.POSTGRES_SSL === true.toString(),
      }
    : {
        database: process.env.POSTGRES_DB,
        host: process.env.POSTGRES_HOST,
        password: process.env.POSTGRES_PASSWORD,
        port: Number(process.env.POSTGRES_PORT),
        username: process.env.POSTGRES_USER,
        ssl: process.env.POSTGRES_SSL === true.toString(),
      }),
};

export default config;
