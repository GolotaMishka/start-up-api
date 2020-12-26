import * as fs from 'fs';
import * as path from 'path';

import ScriptBase from './utils/scriptBase';

class CopyAssets extends ScriptBase {
  // eslint-disable-next-line require-await
  public async execute(): Promise<void> {
    const srcAssets = path.join(process.cwd(), 'src', 'assets');
    const buildAssets = path.join(process.cwd(), 'build', 'src', 'assets');

    if (!fs.existsSync(buildAssets)) {
      fs.mkdirSync(buildAssets);
    }

    const files = fs.readdirSync(srcAssets);
    files.forEach(file => {
      fs.copyFileSync(path.join(srcAssets, file), path.join(buildAssets, file));
    });
  }
}

new CopyAssets().run(false);
