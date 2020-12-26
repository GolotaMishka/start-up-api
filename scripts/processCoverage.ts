import CoverageProcessor from './coverageProcessor';
import ScriptBase from './utils/scriptBase';

export class ProcessCoverage extends ScriptBase {
  public async execute(): Promise<void> {
    const processor = new CoverageProcessor();
    const url = await processor.uploadToGcloud();
    const { branchesPercentage, functionsPercentage, statementsPercentage } =
      processor.getCoverageFromSummary();
    await processor.postMessageToSlack(
      url,
      statementsPercentage,
      branchesPercentage,
      functionsPercentage,
    );
  }
}

new ProcessCoverage().run(false);
