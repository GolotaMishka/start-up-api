// Instead of loading reflection from a separate packages we include core-js
import './utils/extensions/extensions';
import 'core-js';
import 'express-async-errors';

import bodyParser = require('body-parser');
import { ClassType } from 'class-transformer/ClassTransformer';
import * as cors from 'cors';
import * as express from 'express';
import * as helmet from 'helmet';
import errorMiddleware from 'middleware/error.middleware';
import notFoundMiddleware from 'middleware/notFound.middleware';
import config from 'ormconfig';
import AuthenticationRouter from 'routes/authentication.route';
import UserRouter from 'routes/user.route';
import ClientRouter from 'routes/client.route';
import ProductRouter from 'routes/product.route';
import ProductMetricRouter from 'routes/productMetric.route';
import MetricRouter from 'routes/metric.route';
import { Connection, createConnection, getConnection } from 'typeorm';
import ExpressContext from 'utils/expressContext';
import IRouter from 'utils/interfaces/router.interface';

class App {
  public static routers: ClassType<IRouter>[] = [AuthenticationRouter, UserRouter, ClientRouter, ProductRouter, ProductMetricRouter, MetricRouter];

  public host: express.Application;
  public connection: Connection;

  constructor(private routers: ClassType<IRouter>[] = App.routers) {
    this.host = express();
  }

  public init() {
    this.initializeMiddleware();
    this.initializeRouters(this.routers);
    this.initializeErrorHandling();
  }

  public async createConnection() {
    try {
      try {
        this.connection = getConnection();
      } catch {
        this.connection = await createConnection(config);
      }
    } catch (error) {
      console.log('Error while connecting to the database', error);
      return error;
    }
  }

  public listen() {
    this.host.listen(process.env.PORT, () => {
      console.log(
        `App listening on the port ${process.env.PORT}${process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'proxy' ? `\nhttp://localhost:${process.env.PORT}` : ''}`
      );
    });
  }

  public async runMigrationsIfNeeded() {
    if (process.env.POSTGRES_USE_MIGRATIONS === false.toString()) {
      return;
    }
    try {
      const migrations = await this.connection.runMigrations({ transaction: 'all' });
      console.log('Migrations executed successfully', { migrations });
    } catch (error) {
      console.log('Error while running migrations', error);
      console.error('CRITICAL', error);
      return error;
    }
  }

  private initializeMiddleware() {
    this.host.use(helmet());

    this.host.use(
      cors({
        exposedHeaders: ['x-auth', 'x-refresh-token'],
      })
    );
    this.host.use(bodyParser.json());
    this.host.use(ExpressContext.middleware);
  }

  private initializeRouters(routers: ClassType<IRouter>[]) {
    routers.forEach(router => {
      const activated = new router();
      this.host.use(`/api/${activated.path}`, activated.router);
    });
  }

  private initializeErrorHandling() {
    this.host.use(notFoundMiddleware);
    this.host.use(errorMiddleware);
  }
}

export default App;
