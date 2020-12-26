import SwaggerGenerator from './swaggerGenerator/swaggerGenerator';
import ScriptBase from './utils/scriptBase';

class GenerateDocs extends ScriptBase {
  public async execute(): Promise<void> {
    const generator = new SwaggerGenerator();
    await generator.generate();
  }
}

new GenerateDocs().run(false);
