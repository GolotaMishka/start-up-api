import '../src/utils/config';

import axios from 'axios';
import { exec } from 'child_process';
import * as crypto from 'crypto';
import * as path from 'path';
import { promisify } from 'util';

import uploadFolder from './utils/uploadFolder';

export default class CoverageProcessor {
  private channel: string;
  private token: string;
  private url = "https://slack.com/api/chat.postMessage";
  constructor() {
    const { SLACK_CHANNEL: channel, SLACK_TOKEN: token } = process.env;
    this.channel = channel;
    this.token = token;
  }
  public getCoverageFromSummary() {
    const coverageReport = require(
      path.join(process.cwd(), "coverage", "coverage-summary.json"),
    );
    const totals = coverageReport.total;
    const [branchesPercentage, functionsPercentage, statementsPercentage] = [
      totals.branches.pct,
      totals.functions.pct,
      totals.statements.pct,
    ];
    return { branchesPercentage, functionsPercentage, statementsPercentage };
  }
  public async postMessageToSlack(
    url: string,
    statement: number,
    branches: number,
    functions: number,
  ) {
    const totalPercentage = Math.round((statement + branches + functions) / 3);
    const color = this.getColorFromPercentage(totalPercentage);
    const message = {
      channel: `#${this.channel}`,
      text: ``,
      username: `Coverage for \`${await this
        .getBranchName()}\` with a total of ${totalPercentage}%`,
      icon_url:
        `https://quickchart.io/chart?c={type:'radialGauge',data:{datasets:[{data:[${totalPercentage}],backgroundColor:'%23${color}'}]},options:{centerPercentage:50,centerArea:{fontSize:90,fontColor:'%23${color}'},domain:[50,100]}}&height=300&width=300`,
      attachments: [
        this.getAttachment(branches, "Branches", url),
        this.getAttachment(functions, "Functions", url),
        this.getAttachment(statement, "Statement", url),
      ],
    };
    const response = await axios.post(this.url, message, {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    });
  }
  public async uploadToGcloud() {
    const coverageRootPath = path.join(process.cwd(), "coverage");
    const remotePath = `coverage/${this.channel}/${await this
      .getBranchName()}/${
      crypto
        .randomBytes(50)
        .toString("hex")
        .substring(50)
    }`;
    const url = await uploadFolder(coverageRootPath, remotePath);
    return `${url}/index.html`;
  }
  private getAttachment(lines: number, itemName: string, url: string) {
    return {
      fallback: `${itemName} covered for ${lines}%`,
      title: `${itemName} covered for \`${lines}%\``,
      title_link: url,
      color: `#${this.getColorFromPercentage(lines)}`,
    };
  }
  private getColorFromPercentage(percentage: number) {
    return percentage > 90 ? "04e300" : percentage > 70 ? "e3ae00" : "d13404";
  }
  private async getBranchName() {
    const { HEROKU_TEST_RUN_BRANCH } = process.env;
    if (HEROKU_TEST_RUN_BRANCH) {
      return HEROKU_TEST_RUN_BRANCH;
    }
    try {
      const execAsync = promisify(exec);
      const { stdout } = await execAsync(
        "git symbolic-ref --short HEAD",
        { cwd: process.cwd() },
      );
      return stdout.trimRight();
    } catch {
      return "failed/branch";
    }
  }
}
