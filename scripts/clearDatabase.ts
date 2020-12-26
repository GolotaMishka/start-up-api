import reset from './utils/reset';
import ScriptBase from './utils/scriptBase';

class ClearDatabase extends ScriptBase {
  public async execute(): Promise<void> {
    const envs = ['staging', 'production'];
    if (envs.includes(process.env.NODE_ENV)) {
      console.log('you crazy?');
      return;
    }
    await reset(this.connection);
  }
}

new ClearDatabase().run();
